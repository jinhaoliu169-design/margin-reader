from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import html
import json
import os
import re
import socket
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
import webbrowser
from concurrent.futures import ThreadPoolExecutor, as_completed
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
APP_DIR = ROOT / "app"
DATA_DIR = APP_DIR / "data"
DATA_ROOT = Path(os.environ.get("MARGIN_DATA_DIR", str(ROOT / "work"))).expanduser()
CACHE_DIR = DATA_ROOT / "cache"
DICT_CACHE_DIR = CACHE_DIR / "dictionary"
TEXT_CACHE_DIR = CACHE_DIR / "books"
TRANSLATE_CACHE_DIR = CACHE_DIR / "translations"
STORE_DIR = DATA_ROOT / "store"
BORROW_CACHE_DIR = CACHE_DIR / "borrow"
BOOKS_PATH = DATA_DIR / "books.json"
FALLBACK_DICT_PATH = DATA_DIR / "dictionary-fallback.json"
IMPORTS_PATH = STORE_DIR / "imports.json"

DICT_CACHE_DIR.mkdir(parents=True, exist_ok=True)
TEXT_CACHE_DIR.mkdir(parents=True, exist_ok=True)
TRANSLATE_CACHE_DIR.mkdir(parents=True, exist_ok=True)
STORE_DIR.mkdir(parents=True, exist_ok=True)
BORROW_CACHE_DIR.mkdir(parents=True, exist_ok=True)
STORE_LOCK = threading.RLock()
ACCESS_CODE = os.environ.get("MARGIN_ACCESS_CODE", "").strip()
MULTIUSER = os.environ.get("MARGIN_MULTIUSER", "").strip() == "1"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"
)


def load_books() -> dict:
    return json.loads(BOOKS_PATH.read_text(encoding="utf-8"))


def strip_tags(value: str) -> str:
    value = re.sub(r"<br\s*/?>", "\n", value or "", flags=re.I)
    value = re.sub(r"<[^>]+>", "", value)
    return html.unescape(value).strip()


def first(value, default=None):
    return value[0] if isinstance(value, list) and value else default


def collect_i(value) -> list[str]:
    if isinstance(value, str):
        return [strip_tags(value)] if strip_tags(value) else []
    if isinstance(value, list):
        output: list[str] = []
        for item in value:
            output.extend(collect_i(item))
        return output
    return []


def normalize_dictionary(payload: dict, query: str) -> dict:
    simple = first((payload.get("simple") or {}).get("word") or []) or {}
    ec = first((payload.get("ec") or {}).get("word") or []) or {}
    ee = (payload.get("ee") or {}).get("word") or {}
    phrases_payload = payload.get("phrs") or {}
    synonyms_payload = payload.get("syno") or {}
    etymology_payload = payload.get("etym") or {}
    picture_payload = payload.get("pic_dict") or {}
    sentence_payload = payload.get("blng_sents_part") or {}
    collins_payload = payload.get("collins") or {}

    meanings: list[dict] = []
    for group in ec.get("trs") or []:
        for item in group.get("tr", []) or []:
            for definition in collect_i(((item.get("l") or {}).get("i"))):
                pos = ""
                body = definition
                match = re.match(r"^([a-zA-Z.]+)\s+(.*)$", definition)
                if match:
                    pos, body = match.group(1), match.group(2)
                meanings.append({"pos": pos, "text": body})

    forms = []
    for item in ec.get("wfs") or []:
        form = item.get("wf") or {}
        if form.get("name") and form.get("value"):
            forms.append({"name": form["name"], "value": form["value"]})

    english_defs = []
    for group in ee.get("trs") or []:
        for item in group.get("tr") or []:
            text = collect_i((item.get("l") or {}).get("i"))
            if text:
                english_defs.append({"pos": group.get("pos", ""), "text": " ".join(text)})

    phrases = []
    for phrase_group in phrases_payload.get("phrs") or []:
        phrase = phrase_group.get("phr") or {}
        headword = strip_tags(((phrase.get("headword") or {}).get("l") or {}).get("i") or "")
        translations = []
        for tr in phrase.get("trs") or []:
            translations.extend(collect_i((tr.get("tr") or {}).get("l", {}).get("i")))
        if headword:
            phrases.append({"text": headword, "meaning": "；".join(dict.fromkeys(translations))})

    synonyms = []
    for syn_group in synonyms_payload.get("synos") or []:
        syn = syn_group.get("syno") or {}
        words = [item.get("w") for item in syn.get("ws") or [] if item.get("w")]
        if words:
            synonyms.append({"pos": syn.get("pos", ""), "words": words, "meaning": syn.get("tran", "")})

    examples = []
    for pair in sentence_payload.get("sentence-pair") or []:
        english = strip_tags(pair.get("sentence-eng") or pair.get("sentence") or "")
        chinese = strip_tags(pair.get("sentence-translation") or "")
        if english:
            examples.append({"en": english, "zh": chinese})

    preview = ""
    preview_html = ""
    try:
        preview_html = collins_payload["collins_entries"][0]["entries"]["entry"][0]["tran_entry"][0]["tran"]
        preview = strip_tags(preview_html)
    except (KeyError, IndexError, TypeError):
        if english_defs:
            preview = english_defs[0]["text"]

    images = []
    for image in picture_payload.get("pic") or []:
        url = image.get("image") or image.get("url")
        if url:
            images.append(url)

    etymology = []
    for language, entries in (etymology_payload.get("etyms") or {}).items():
        for entry in entries or []:
            if entry.get("value"):
                etymology.append(
                    {
                        "lang": language,
                        "text": strip_tags(entry["value"]),
                        "source": entry.get("source", ""),
                    }
                )

    word = ec.get("return-phrase") or simple.get("return-phrase") or query
    if isinstance(word, dict):
        word = first(collect_i((word.get("l") or {}).get("i"))) or query

    return {
        "query": query,
        "word": strip_tags(str(word)) or query,
        "phonetic": {
            "uk": simple.get("ukphone") or ec.get("ukphone") or "",
            "us": simple.get("usphone") or ec.get("usphone") or "",
        },
        "audio": {
            "uk": f"https://dict.youdao.com/dictvoice?audio={urllib.parse.quote(query)}&type=1",
            "us": f"https://dict.youdao.com/dictvoice?audio={urllib.parse.quote(query)}&type=2",
        },
        "meanings": meanings,
        "forms": forms,
        "examTags": (payload.get("ec") or {}).get("exam_type") or ec.get("exam_type") or [],
        "preview": preview,
        "englishDefinitions": english_defs,
        "phrases": phrases[:8],
        "synonyms": synonyms[:6],
        "examples": examples[:4],
        "etymology": etymology[:4],
        "images": images[:2],
        "source": {
            "name": "有道词典",
            "url": f"https://dict.youdao.com/result?word={urllib.parse.quote(query)}&lang=en",
        },
        "fetchedAt": int(time.time()),
    }


def fetch_dictionary(word: str) -> dict:
    cache_key = hashlib.sha1(word.lower().encode("utf-8")).hexdigest() + ".json"
    cache_path = DICT_CACHE_DIR / cache_key
    if cache_path.exists():
        try:
            cached = json.loads(cache_path.read_text(encoding="utf-8"))
            if time.time() - cached.get("fetchedAt", 0) < 60 * 60 * 24 * 30:
                cached["cached"] = True
                return cached
        except (OSError, json.JSONDecodeError):
            pass

    url = "https://dict.youdao.com/jsonapi?" + urllib.parse.urlencode({"q": word})
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Referer": "https://dict.youdao.com/",
            "Accept": "application/json,text/plain,*/*",
        },
    )
    with urllib.request.urlopen(request, timeout=18) as response:
        payload = json.loads(response.read().decode("utf-8"))
    result = normalize_dictionary(payload, word)
    if not result["meanings"] and not result["englishDefinitions"] and not result["phrases"]:
        raise ValueError("No dictionary entry returned")
    cache_path.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
    return result


def load_fallback_dictionary(word: str) -> dict | None:
    if not FALLBACK_DICT_PATH.exists():
        return None
    try:
        payload = json.loads(FALLBACK_DICT_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    entry = payload.get(word.lower())
    if not entry:
        return None
    return {
        **entry,
        "query": word,
        "word": word,
        "source": {"name": "本地简释", "url": "https://dict.youdao.com/"},
        "fetchedAt": int(time.time()),
        "fallback": True,
    }


def clean_gutenberg_text(raw: str) -> str:
    raw = raw.replace("\r\n", "\n").replace("\r", "\n").replace("\ufeff", "")
    start = re.search(
        r"\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*",
        raw,
        flags=re.I | re.S,
    )
    if start:
        raw = raw[start.end() :]
    end = re.search(r"\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*", raw, flags=re.I)
    if end:
        raw = raw[: end.start()]
    chapter_matches = list(
        re.finditer(r"(?im)^(?:chapter|book|part)\s+(?:[IVXLCDM]+|\d+)\b.*$", raw)
    )
    if chapter_matches:
        chosen = None
        for index, match in enumerate(chapter_matches):
            next_start = chapter_matches[index + 1].start() if index + 1 < len(chapter_matches) else len(raw)
            if next_start - match.start() > 1500:
                chosen = match
                break
        if chosen and chosen.start() > 0:
            raw = raw[chosen.start() :]
    raw = re.sub(r"[ \t]+\n", "\n", raw)
    raw = re.sub(r"(?im)^\s*\[illustration[^\]]*\]\s*$", "", raw)
    raw = re.sub(r"\n{4,}", "\n\n\n", raw)
    return raw.strip()


def fetch_book_text(book: dict) -> str:
    gutenberg_id = int(book["gutenbergId"])
    local = DATA_DIR / "texts" / f"{gutenberg_id}.txt"
    cached = TEXT_CACHE_DIR / f"{gutenberg_id}.txt"
    if local.exists():
        return clean_gutenberg_text(local.read_text(encoding="utf-8", errors="replace"))
    if cached.exists():
        return clean_gutenberg_text(cached.read_text(encoding="utf-8", errors="replace"))

    url = f"https://gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.txt"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        raw = response.read().decode("utf-8", errors="replace")
    cached.write_text(raw, encoding="utf-8")
    return clean_gutenberg_text(raw)


def count_words(text: str) -> int:
    return len(re.findall(r"[A-Za-z][A-Za-z'’-]*", text or ""))


def load_imports() -> list[dict]:
    with STORE_LOCK:
        if not IMPORTS_PATH.exists():
            return []
        try:
            payload = json.loads(IMPORTS_PATH.read_text(encoding="utf-8"))
            return payload if isinstance(payload, list) else []
        except (OSError, json.JSONDecodeError):
            return []


def write_imports(items: list[dict]) -> None:
    with STORE_LOCK:
        temporary = IMPORTS_PATH.with_suffix(".tmp")
        temporary.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
        os.replace(temporary, IMPORTS_PATH)


def import_summary(item: dict) -> dict:
    text = item.get("text") or ""
    return {
        "id": item.get("id"),
        "title": item.get("title", ""),
        "titleZh": item.get("titleZh", ""),
        "source": item.get("source", ""),
        "sourceBookId": item.get("sourceBookId", ""),
        "notes": item.get("notes", ""),
        "deletedAt": item.get("deletedAt", 0),
        "createdAt": item.get("createdAt", 0),
        "updatedAt": item.get("updatedAt", 0),
        "charCount": len(text),
        "wordCount": count_words(text),
        "preview": re.sub(r"\s+", " ", text)[:180],
    }


def clean_import_text(value) -> str:
    return str(value or "").strip()


def clean_import_field(value, limit: int = 240) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()[:limit]


def translation_cache_path(text: str) -> Path:
    key = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return TRANSLATE_CACHE_DIR / f"{key}.txt"


def translate_with_youdao(text: str) -> str:
    url = "https://aidemo.youdao.com/trans"
    data = urllib.parse.urlencode({"q": text, "from": "Auto", "to": "Auto"}).encode("utf-8")
    last_error = None
    for attempt in range(3):
        try:
            request = urllib.request.Request(
                url,
                data=data,
                headers={
                    "User-Agent": USER_AGENT,
                    "Referer": "https://aidemo.youdao.com/",
                    "Accept": "application/json,text/plain,*/*",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
            )
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            if str(payload.get("errorCode")) != "0":
                raise ValueError("Translation service returned an error")
            translated = payload.get("translation") or []
            if isinstance(translated, list):
                return "".join(str(item) for item in translated).strip()
            return str(translated).strip()
        except Exception as exc:
            last_error = exc
            time.sleep(0.5 + attempt * 0.7)
    raise last_error or ValueError("Translation failed")


def translate_with_mymemory(text: str) -> str:
    pieces = []
    remaining = text
    while remaining:
        if len(remaining) <= 420:
            piece, remaining = remaining, ""
        else:
            cut = remaining.rfind(" ", 0, 420)
            if cut < 200:
                cut = 420
            piece, remaining = remaining[:cut], remaining[cut:].lstrip()
        url = "https://api.mymemory.translated.net/get?" + urllib.parse.urlencode(
            {"q": piece, "langpair": "en|zh-CN"}
        )
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=25) as response:
            payload = json.loads(response.read().decode("utf-8"))
        translated = (payload.get("responseData") or {}).get("translatedText") or ""
        pieces.append(str(translated).strip())
    return "".join(pieces)


def translate_texts(texts: list[str]) -> list[str]:
    normalized = [str(text or "").strip() for text in texts]

    def split_unit(text: str, limit: int = 620) -> list[str]:
        if len(text) <= limit:
            return [text]
        sentences = re.split(r"(?<=[.!?])\s+", text)
        chunks: list[str] = []
        current = ""
        for sentence in sentences:
            if len(sentence) > limit:
                words = sentence.split()
                piece = ""
                for word in words:
                    if piece and len(piece) + len(word) + 1 > limit:
                        if current:
                            chunks.append(current)
                            current = ""
                        chunks.append(piece)
                        piece = word
                    else:
                        piece = f"{piece} {word}".strip()
                if piece:
                    if current and len(current) + len(piece) + 1 <= limit:
                        current = f"{current} {piece}"
                    else:
                        if current:
                            chunks.append(current)
                        current = piece
                continue
            if current and len(current) + len(sentence) + 1 > limit:
                chunks.append(current)
                current = sentence
            else:
                current = f"{current} {sentence}".strip()
        if current:
            chunks.append(current)
        return chunks or [text]

    units: list[tuple[int, int, str]] = []
    unit_counts: list[int] = []
    for input_index, text in enumerate(normalized):
        parts = split_unit(text) if text else []
        unit_counts.append(len(parts))
        for unit_index, part in enumerate(parts):
            units.append((input_index, unit_index, part))

    unit_results: dict[tuple[int, int], str] = {}
    missing: list[tuple[int, int, str]] = []
    for input_index, unit_index, text in units:
        cache_path = translation_cache_path(text)
        if cache_path.exists():
            try:
                unit_results[(input_index, unit_index)] = cache_path.read_text(encoding="utf-8")
                continue
            except OSError:
                pass
        missing.append((input_index, unit_index, text))

    sentinel = "\n@@MARGIN_PARA@@\n"
    batches: list[list[tuple[int, int, str]]] = []
    current: list[tuple[int, int, str]] = []
    current_size = 0
    for item in missing:
        size = len(item[2]) + len(sentinel)
        if current and current_size + size > 620:
            batches.append(current)
            current = []
            current_size = 0
        current.append(item)
        current_size += size
    if current:
        batches.append(current)

    def process_batch(batch):
        joined = sentinel.join(text for _, _, text in batch)
        try:
            translated = translate_with_youdao(joined)
            parts = [part.strip() for part in translated.split("@@MARGIN_PARA@@")]
            if len(parts) != len(batch):
                raise ValueError("Translation boundary mismatch")
            for (input_index, unit_index, source), result in zip(batch, parts):
                unit_results[(input_index, unit_index)] = result
                translation_cache_path(source).write_text(result, encoding="utf-8")
        except Exception:
            for input_index, unit_index, source in batch:
                try:
                    translated = translate_with_youdao(source)
                except Exception:
                    try:
                        translated = translate_with_mymemory(source)
                    except Exception:
                        translated = ""
                unit_results[(input_index, unit_index)] = translated
                if translated:
                    translation_cache_path(source).write_text(translated, encoding="utf-8")

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(process_batch, batch) for batch in batches]
        for future in as_completed(futures):
            future.result()

    results = []
    for input_index, count in enumerate(unit_counts):
        results.append(
            "".join(unit_results.get((input_index, unit_index), "") for unit_index in range(count)).strip()
        )
    return results


def find_borrowable_copy(title: str, author: str) -> dict | None:
    cache_key = hashlib.sha256(f"{title}|{author}".lower().encode("utf-8")).hexdigest() + ".json"
    cache_path = BORROW_CACHE_DIR / cache_key
    if cache_path.exists():
        try:
            return json.loads(cache_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            pass

    def creator_matches(value) -> bool:
        if not author:
            return True
        names = value if isinstance(value, list) else [value]
        wanted = re.sub(r"[^a-z0-9]+", "", author.split()[-1].lower())
        if not wanted:
            return True
        for name in names:
            normalized = re.sub(r"[^a-z0-9]+", "", str(name).lower())
            if wanted in normalized:
                return True
        return False

    queries = [
        f'title:("{title}") AND creator:("{author}") AND mediatype:texts',
        f'title:("{title}") AND collection:(internetarchivebooks OR printdisabled)',
    ]
    for query in queries:
        params = [
            ("q", query),
            ("fl[]", "identifier"),
            ("fl[]", "title"),
            ("fl[]", "creator"),
            ("fl[]", "access-restricted-item"),
            ("fl[]", "collection"),
            ("rows", "30"),
            ("output", "json"),
        ]
        url = "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode(params)
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
        docs = (payload.get("response") or {}).get("docs") or []
        for doc in docs:
            collections = doc.get("collection") or []
            if isinstance(collections, str):
                collections = [collections]
            restricted = str(doc.get("access-restricted-item", "")).lower() == "true"
            lending_collection = any(
                name in {"internetarchivebooks", "printdisabled", "inlibrary"}
                for name in collections
            )
            if not (restricted or lending_collection):
                continue
            if not creator_matches(doc.get("creator")):
                continue
            identifier = doc.get("identifier")
            if not identifier:
                continue
            result = {
                "identifier": identifier,
                "title": doc.get("title") or title,
                "creator": doc.get("creator") or author,
                "restricted": restricted,
                "url": f"https://archive.org/details/{urllib.parse.quote(identifier)}",
                "readerUrl": f"https://archive.org/stream/{urllib.parse.quote(identifier)}",
                "source": "Internet Archive",
            }
            cache_path.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
            return result
    return None


class LexiconHandler(SimpleHTTPRequestHandler):
    server_version = "MarginReader/1.0"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        if os.environ.get("MARGIN_VERBOSE") == "1":
            super().log_message(fmt, *args)

    def prepare_context(self) -> None:
        self.owner_id = "local"
        self.new_owner = False
        if MULTIUSER:
            cookie = SimpleCookie(self.headers.get("Cookie", ""))
            value = cookie.get("margin_uid")
            if value and re.fullmatch(r"[a-f0-9]{32}", value.value):
                self.owner_id = value.value
            else:
                self.owner_id = uuid.uuid4().hex
                self.new_owner = True

    def end_headers(self) -> None:
        if getattr(self, "new_owner", False):
            self.send_header(
                "Set-Cookie",
                f"margin_uid={self.owner_id}; Path=/; Max-Age=31536000; SameSite=Lax",
            )
            self.new_owner = False
        super().end_headers()

    def authorize(self) -> bool:
        if not ACCESS_CODE:
            return True
        header = self.headers.get("Authorization", "")
        if header.startswith("Basic "):
            try:
                decoded = base64.b64decode(header[6:]).decode("utf-8")
                _, password = decoded.split(":", 1)
                if hmac.compare_digest(password, ACCESS_CODE):
                    return True
            except (ValueError, UnicodeDecodeError):
                pass
        body = json.dumps({"error": "需要访问密码。"}).encode("utf-8")
        self.send_response(HTTPStatus.UNAUTHORIZED)
        self.send_header("WWW-Authenticate", 'Basic realm="Margin Reader", charset="UTF-8"')
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        return False

    def scoped_imports(self, items: list[dict]) -> list[dict]:
        if not MULTIUSER:
            return items
        return [item for item in items if item.get("ownerId", "local") == self.owner_id]

    def send_json(self, payload, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > 5 * 1024 * 1024:
            raise ValueError("请求内容为空或超过 5 MB。")
        raw = self.rfile.read(length)
        payload = json.loads(raw.decode("utf-8"))
        if not isinstance(payload, dict):
            raise ValueError("请求格式不正确。")
        return payload

    def do_GET(self) -> None:
        self.prepare_context()
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path != "/api/health" and not self.authorize():
            return
        if path == "/api/health":
            self.send_json({"ok": True, "books": load_books().get("count", 0), "time": int(time.time())})
            return
        if path == "/api/dictionary":
            self.handle_dictionary(parsed)
            return
        if path == "/api/borrow":
            self.handle_borrow(parsed)
            return
        if path.startswith("/api/text/"):
            self.handle_text(path.removeprefix("/api/text/"))
            return
        if path == "/api/books":
            self.send_json(load_books())
            return
        if path == "/api/imports":
            include_deleted = (urllib.parse.parse_qs(parsed.query).get("include_deleted") or [""])[0] == "1"
            items = self.scoped_imports(load_imports())
            if not include_deleted:
                items = [item for item in items if not item.get("deletedAt")]
            items = sorted(items, key=lambda item: item.get("updatedAt", 0), reverse=True)
            self.send_json({"items": [import_summary(item) for item in items]})
            return
        if path.startswith("/api/imports/"):
            self.handle_import_get(path.removeprefix("/api/imports/"))
            return
        if path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self) -> None:
        self.prepare_context()
        if not self.authorize():
            return
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/translate":
            self.handle_translate()
            return
        if path != "/api/imports":
            self.send_json({"error": "接口不存在。"}, HTTPStatus.NOT_FOUND)
            return
        try:
            payload = self.read_json_body()
            text = clean_import_text(payload.get("text"))
            title = clean_import_field(payload.get("title"))
            if not text:
                raise ValueError("文章正文不能为空。")
            if not title:
                first_line = next((line.strip() for line in text.splitlines() if line.strip()), "未命名文章")
                title = first_line[:120]
            now = int(time.time() * 1000)
            item = {
                "id": clean_import_field(payload.get("id"), 100)
                or f"import-{int(time.time())}-{uuid.uuid4().hex[:6]}",
                "title": title,
                "titleZh": clean_import_field(payload.get("titleZh")),
                "source": clean_import_field(payload.get("source") or "截图导入"),
                "sourceBookId": clean_import_field(payload.get("sourceBookId"), 120),
                "notes": clean_import_field(payload.get("notes"), 2000),
                "deletedAt": int(payload.get("deletedAt") or 0),
                "text": text,
                "createdAt": int(payload.get("createdAt") or now),
                "updatedAt": now,
                "ownerId": self.owner_id if MULTIUSER else "local",
            }
            with STORE_LOCK:
                items = load_imports()
                existing = next((entry for entry in items if entry.get("id") == item["id"]), None)
                if existing:
                    item["createdAt"] = existing.get("createdAt", item["createdAt"])
                    items = [item if entry.get("id") == item["id"] else entry for entry in items]
                else:
                    items.append(item)
                write_imports(items)
            self.send_json({**item, **import_summary(item)})
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
        except OSError as exc:
            self.send_json({"error": f"文章保存失败：{exc}"}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def handle_translate(self) -> None:
        try:
            payload = self.read_json_body()
            texts = payload.get("texts")
            if not isinstance(texts, list) or not texts:
                raise ValueError("需要提供要翻译的段落。")
            if len(texts) > 120:
                raise ValueError("一次最多翻译 120 段。")
            cleaned = []
            for text in texts:
                value = str(text or "").strip()
                if len(value) > 6000:
                    raise ValueError("单个段落不能超过 6000 个字符。")
                cleaned.append(value)
            translations = translate_texts(cleaned)
            self.send_json(
                {
                    "translations": translations,
                    "source": {"name": "有道翻译", "url": "https://aidemo.youdao.com/"},
                }
            )
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
        except (urllib.error.URLError, TimeoutError) as exc:
            self.send_json(
                {"error": "翻译服务暂时不可用。请稍后重试。", "detail": str(exc)[:160]},
                HTTPStatus.BAD_GATEWAY,
            )

    def do_PATCH(self) -> None:
        self.prepare_context()
        if not self.authorize():
            return
        path = urllib.parse.urlparse(self.path).path
        if not path.startswith("/api/imports/"):
            self.send_json({"error": "接口不存在。"}, HTTPStatus.NOT_FOUND)
            return
        import_id = urllib.parse.unquote(path.removeprefix("/api/imports/"))
        try:
            payload = self.read_json_body()
            with STORE_LOCK:
                items = load_imports()
                target = next(
                    (
                        entry
                        for entry in self.scoped_imports(items)
                        if entry.get("id") == import_id
                    ),
                    None,
                )
                if target is None:
                    self.send_json({"error": "没有找到这篇文章。"}, HTTPStatus.NOT_FOUND)
                    return
                if "title" in payload:
                    target["title"] = clean_import_field(payload.get("title")) or target.get("title", "")
                if "titleZh" in payload:
                    target["titleZh"] = clean_import_field(payload.get("titleZh"))
                if "source" in payload:
                    target["source"] = clean_import_field(payload.get("source") or "我的导入")
                if "sourceBookId" in payload:
                    target["sourceBookId"] = clean_import_field(payload.get("sourceBookId"), 120)
                if "notes" in payload:
                    target["notes"] = clean_import_field(payload.get("notes"), 2000)
                if payload.get("restore"):
                    target["deletedAt"] = 0
                if "appendText" in payload:
                    addition = clean_import_text(payload.get("appendText"))
                    if not addition:
                        self.send_json({"error": "追加内容不能为空。"}, HTTPStatus.BAD_REQUEST)
                        return
                    existing_text = target.get("text") or ""
                    target["text"] = (
                        f"{existing_text.rstrip()}\n\n{addition}"
                        if existing_text.strip()
                        else addition
                    )
                target["updatedAt"] = int(time.time() * 1000)
                write_imports(items)
            self.send_json(target)
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
        except OSError as exc:
            self.send_json({"error": f"文章更新失败：{exc}"}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def do_DELETE(self) -> None:
        self.prepare_context()
        if not self.authorize():
            return
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if not path.startswith("/api/imports/"):
            self.send_json({"error": "接口不存在。"}, HTTPStatus.NOT_FOUND)
            return
        import_id = urllib.parse.unquote(path.removeprefix("/api/imports/"))
        permanent = (urllib.parse.parse_qs(parsed.query).get("permanent") or [""])[0] == "1"
        try:
            with STORE_LOCK:
                items = load_imports()
                target = next(
                    (
                        entry
                        for entry in self.scoped_imports(items)
                        if entry.get("id") == import_id
                    ),
                    None,
                )
                if target is None:
                    self.send_json({"error": "没有找到这篇文章。"}, HTTPStatus.NOT_FOUND)
                    return
                if permanent:
                    remaining = [entry for entry in items if entry.get("id") != import_id]
                    write_imports(remaining)
                else:
                    target["deletedAt"] = int(time.time() * 1000)
                    target["updatedAt"] = int(time.time() * 1000)
                    write_imports(items)
            self.send_json({"ok": True, "id": import_id, "permanent": permanent})
        except OSError as exc:
            self.send_json({"error": f"文章删除失败：{exc}"}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def handle_dictionary(self, parsed: urllib.parse.ParseResult) -> None:
        query = (urllib.parse.parse_qs(parsed.query).get("word") or [""])[0].strip()
        if not query or len(query) > 80 or not re.fullmatch(r"[A-Za-z][A-Za-z'’ .-]{0,79}", query):
            self.send_json(
                {"error": "请输入 1–80 个英文字母、撇号或连字符。"},
                HTTPStatus.BAD_REQUEST,
            )
            return
        try:
            result = fetch_dictionary(query)
            self.send_json(result)
        except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            fallback = load_fallback_dictionary(query)
            if fallback:
                fallback["notice"] = "有道词典暂时不可用，当前显示本地简释。"
                self.send_json(fallback)
                return
            self.send_json(
                {
                    "error": "词典服务暂时没有响应。请检查网络后重试。",
                    "detail": str(exc)[:160],
                    "query": query,
                },
                HTTPStatus.BAD_GATEWAY,
            )

    def handle_borrow(self, parsed: urllib.parse.ParseResult) -> None:
        params = urllib.parse.parse_qs(parsed.query)
        title = (params.get("title") or [""])[0].strip()
        author = (params.get("author") or [""])[0].strip()
        if not title or len(title) > 240 or len(author) > 160:
            self.send_json({"error": "书名或作者不正确。"}, HTTPStatus.BAD_REQUEST)
            return
        try:
            result = find_borrowable_copy(title, author)
            if result is None:
                self.send_json(
                    {"error": "Internet Archive 暂未找到这本书的可借阅完整版本。"},
                    HTTPStatus.NOT_FOUND,
                )
                return
            self.send_json(result)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            self.send_json(
                {"error": "借阅资源查询失败，请稍后重试。", "detail": str(exc)[:160]},
                HTTPStatus.BAD_GATEWAY,
            )

    def handle_text(self, book_id: str) -> None:
        book_id = urllib.parse.unquote(book_id)
        books = load_books().get("books", [])
        book = next((item for item in books if item.get("id") == book_id), None)
        if book is None:
            self.send_json({"error": "没有找到这本书。"}, HTTPStatus.NOT_FOUND)
            return
        if not book.get("gutenbergId"):
            self.send_json(
                {
                    "error": "这本书仍受版权保护，站点仅收录书目。可以导入你自己合法拥有的文本或截图继续阅读。",
                    "book": book,
                },
                HTTPStatus.CONFLICT,
            )
            return
        try:
            text = fetch_book_text(book)
            self.send_json(
                {
                    "bookId": book_id,
                    "title": book["title"],
                    "author": book["author"],
                    "gutenbergId": book["gutenbergId"],
                    "text": text,
                    "chars": len(text),
                }
            )
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            self.send_json(
                {
                    "error": "全文下载失败。请检查网络后重试；已缓存的公版书不受影响。",
                    "detail": str(exc)[:160],
                },
                HTTPStatus.BAD_GATEWAY,
            )

    def handle_import_get(self, import_id: str) -> None:
        import_id = urllib.parse.unquote(import_id)
        item = next(
            (
                entry
                for entry in self.scoped_imports(load_imports())
                if entry.get("id") == import_id
            ),
            None,
        )
        if item is None:
            self.send_json({"error": "没有找到这篇文章。"}, HTTPStatus.NOT_FOUND)
            return
        self.send_json(item)


def choose_port(requested: int) -> int:
    for port in range(requested, requested + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError("No available port")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the Margin English reading room.")
    parser.add_argument("--host", default=os.environ.get("MARGIN_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8765")))
    parser.add_argument("--no-open", action="store_true")
    args = parser.parse_args()
    local_host = args.host in {"127.0.0.1", "localhost", "::1"}
    port = choose_port(args.port) if local_host else args.port
    server = ThreadingHTTPServer((args.host, port), LexiconHandler)
    url = f"http://{'127.0.0.1' if local_host else args.host}:{port}/"
    if not args.no_open and local_host:
        threading.Timer(0.9, lambda: webbrowser.open(url)).start()
    print(f"Margin Reader is running at {url}", flush=True)
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
