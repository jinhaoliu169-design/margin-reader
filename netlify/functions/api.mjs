import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const booksPayload = require("../../app/data/books.json");
const fallbackDictionary = require("../../app/data/dictionary-fallback.json");

export const config = { path: "/api/*" };

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/125 Safari/537.36";
const textCache = new Map();
const dictionaryCache = new Map();
const memoryImports = new Map();

let blobStore;
try {
  const { getStore } = await import("@netlify/blobs");
  blobStore = getStore("margin-reader-imports");
} catch {
  blobStore = null;
}

function json(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function htmlDecode(value) {
  return String(value || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripTags(value) {
  return htmlDecode(String(value || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim();
}

function first(value) {
  return Array.isArray(value) && value.length ? value[0] : undefined;
}

function collectI(value) {
  if (typeof value === "string") {
    const text = stripTags(value);
    return text ? [text] : [];
  }
  if (Array.isArray(value)) return value.flatMap(collectI);
  return [];
}

function cleanField(value, limit = 240) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function countWords(text) {
  return (String(text || "").match(/[A-Za-z][A-Za-z'’-]*/g) || []).length;
}

function summary(item) {
  const text = item.text || "";
  return {
    id: item.id,
    title: item.title || "",
    titleZh: item.titleZh || "",
    source: item.source || "",
    sourceBookId: item.sourceBookId || "",
    notes: item.notes || "",
    deletedAt: item.deletedAt || 0,
    createdAt: item.createdAt || 0,
    updatedAt: item.updatedAt || 0,
    charCount: text.length,
    wordCount: countWords(text),
    preview: text.replace(/\s+/g, " ").slice(0, 180),
  };
}

function ownerContext(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)margin_uid=([a-f0-9]{32})(?:;|$)/);
  if (match) return { ownerId: match[1], setCookie: "" };
  const ownerId = randomUUID().replace(/-/g, "");
  return {
    ownerId,
    setCookie: `margin_uid=${ownerId}; Path=/; Max-Age=31536000; SameSite=Lax`,
  };
}

function importKey(ownerId, id) {
  return `imports/${ownerId}/${id}`;
}

async function loadImports(ownerId) {
  if (!blobStore) {
    return [...memoryImports.values()].filter((item) => item.ownerId === ownerId);
  }
  const { blobs } = await blobStore.list({ prefix: `imports/${ownerId}/` });
  const items = [];
  for (const blob of blobs) {
    const raw = await blobStore.get(blob.key);
    if (!raw) continue;
    try {
      items.push(JSON.parse(raw));
    } catch {
      // Ignore a damaged record and keep the rest of the library usable.
    }
  }
  return items;
}

async function saveImport(item) {
  if (!blobStore) {
    memoryImports.set(`${item.ownerId}/${item.id}`, item);
    return;
  }
  await blobStore.set(importKey(item.ownerId, item.id), JSON.stringify(item));
}

async function deleteImport(item) {
  if (!blobStore) {
    memoryImports.delete(`${item.ownerId}/${item.id}`);
    return;
  }
  await blobStore.delete(importKey(item.ownerId, item.id));
}

async function findImport(ownerId, id) {
  if (!blobStore) return memoryImports.get(`${ownerId}/${id}`) || null;
  const raw = await blobStore.get(importKey(ownerId, id));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cleanBookText(raw) {
  let text = String(raw || "").replace(/\r\n?/g, "\n").replace(/\ufeff/g, "");
  const start = text.match(/\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/i);
  if (start) text = text.slice(start.index + start[0].length);
  const end = text.match(/\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/i);
  if (end) text = text.slice(0, end.index);

  const chapters = [...text.matchAll(/^(?:chapter|book|part)\s+(?:[IVXLCDM]+|\d+)\b.*$/gim)];
  if (chapters.length) {
    for (let index = 0; index < chapters.length; index += 1) {
      const startAt = chapters[index].index || 0;
      const nextAt = index + 1 < chapters.length ? chapters[index + 1].index || text.length : text.length;
      if (nextAt - startAt > 1500) {
        if (startAt > 0) text = text.slice(startAt);
        break;
      }
    }
  }
  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/^\s*\[illustration[^\]]*\]\s*$/gim, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

async function getBookText(book) {
  const id = String(book.gutenbergId);
  if (textCache.has(id)) return textCache.get(id);
  const localPath = join(process.cwd(), "app", "data", "texts", `${id}.txt`);
  try {
    const local = await readFile(localPath, "utf8");
    const cleaned = cleanBookText(local);
    textCache.set(id, cleaned);
    return cleaned;
  } catch {
    // Fall through to the public Project Gutenberg mirrors.
  }

  const urls = [
    `https://gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://gutenberg.pglaf.org/cache/epub/${id}/pg${id}.txt`,
    `https://mirror.csclub.uwaterloo.ca/gutenberg/cache/epub/${id}/pg${id}.txt`,
  ];
  let lastError;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(18000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const raw = await response.text();
      if (raw.length < 2000) throw new Error("Empty book response");
      const cleaned = cleanBookText(raw);
      textCache.set(id, cleaned);
      return cleaned;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Book text unavailable");
}

async function fetchJson(url, options = {}, timeout = 15000) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(timeout) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function normalizeDictionary(payload, query) {
  const simple = first((payload.simple || {}).word) || {};
  const ec = first((payload.ec || {}).word) || {};
  const ee = (payload.ee || {}).word || {};
  const phrasesPayload = payload.phrs || {};
  const synonymsPayload = payload.syno || {};
  const etymologyPayload = payload.etym || {};
  const picturePayload = payload.pic_dict || {};
  const sentencePayload = payload.blng_sents_part || {};
  const collinsPayload = payload.collins || {};

  const meanings = [];
  for (const group of ec.trs || []) {
    for (const item of group.tr || []) {
      for (const definition of collectI((((item || {}).l || {}).i))) {
        const match = definition.match(/^([a-zA-Z.]+)\s+(.*)$/);
        meanings.push(match ? { pos: match[1], text: match[2] } : { pos: "", text: definition });
      }
    }
  }

  const forms = [];
  for (const item of ec.wfs || []) {
    const form = item.wf || {};
    if (form.name && form.value) forms.push({ name: form.name, value: form.value });
  }

  const englishDefinitions = [];
  for (const group of ee.trs || []) {
    for (const item of group.tr || []) {
      const text = collectI((((item || {}).l || {}).i));
      if (text.length) {
        englishDefinitions.push({ pos: group.pos || "", text: text.join(" ") });
      }
    }
  }

  const phrases = [];
  for (const phraseGroup of phrasesPayload.phrs || []) {
    const phrase = phraseGroup.phr || {};
    const headword = stripTags((((phrase.headword || {}).l || {}).i) || "");
    const translations = [];
    for (const tr of phrase.trs || []) {
      translations.push(...collectI(((tr || {}).tr || {}).l?.i));
    }
    if (headword) {
      phrases.push({ text: headword, meaning: [...new Set(translations)].join("；") });
    }
  }

  const synonyms = [];
  for (const synGroup of synonymsPayload.synos || []) {
    const syn = synGroup.syno || {};
    const words = (syn.ws || []).map((item) => item.w).filter(Boolean);
    if (words.length) synonyms.push({ pos: syn.pos || "", words, meaning: syn.tran || "" });
  }

  const examples = [];
  for (const pair of sentencePayload["sentence-pair"] || []) {
    const en = stripTags(pair["sentence-eng"] || pair.sentence || "");
    const zh = stripTags(pair["sentence-translation"] || "");
    if (en) examples.push({ en, zh });
  }

  let preview = "";
  try {
    preview = stripTags(
      collinsPayload.collins_entries[0].entries.entry[0].tran_entry[0].tran,
    );
  } catch {
    if (englishDefinitions.length) preview = englishDefinitions[0].text;
  }

  const images = [];
  for (const image of picturePayload.pic || []) {
    const url = image.image || image.url;
    if (url) images.push(url);
  }

  const etymology = [];
  for (const [lang, entries] of Object.entries(etymologyPayload.etyms || {})) {
    for (const entry of entries || []) {
      if (entry.value) {
        etymology.push({ lang, text: stripTags(entry.value), source: entry.source || "" });
      }
    }
  }

  let word = ec["return-phrase"] || simple["return-phrase"] || query;
  if (word && typeof word === "object") {
    word = first(collectI((word.l || {}).i)) || query;
  }

  return {
    query,
    word: stripTags(String(word || "")) || query,
    phonetic: {
      uk: simple.ukphone || ec.ukphone || "",
      us: simple.usphone || ec.usphone || "",
    },
    audio: {
      uk: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(query)}&type=1`,
      us: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(query)}&type=2`,
    },
    meanings,
    forms,
    examTags: (payload.ec || {}).exam_type || ec.exam_type || [],
    preview,
    englishDefinitions,
    phrases: phrases.slice(0, 8),
    synonyms: synonyms.slice(0, 6),
    examples: examples.slice(0, 4),
    etymology: etymology.slice(0, 4),
    images: images.slice(0, 2),
    source: {
      name: "有道词典",
      url: `https://dict.youdao.com/result?word=${encodeURIComponent(query)}&lang=en`,
    },
    fetchedAt: Math.floor(Date.now() / 1000),
  };
}

async function dictionaryFallback(query) {
  const local = fallbackDictionary[query.toLowerCase()];
  if (local) {
    return {
      ...local,
      query,
      word: query,
      source: { name: "本地简释", url: "https://dict.youdao.com/" },
      fetchedAt: Math.floor(Date.now() / 1000),
      fallback: true,
      notice: "有道词典暂时不可用，当前显示本地简释。",
    };
  }
  try {
    const payload = await fetchJson(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`,
      { headers: { "User-Agent": USER_AGENT } },
      12000,
    );
    const entry = first(payload) || {};
    const meanings = [];
    const englishDefinitions = [];
    for (const group of entry.meanings || []) {
      for (const definition of group.definitions || []) {
        englishDefinitions.push({ pos: group.partOfSpeech || "", text: definition.definition || "" });
        if (meanings.length < 6) {
          meanings.push({ pos: group.partOfSpeech || "", text: definition.definition || "" });
        }
      }
    }
    if (meanings.length) {
      return {
        query,
        word: entry.word || query,
        phonetic: {
          uk: (entry.phonetics || []).find((item) => item.text)?.text || "",
          us: (entry.phonetics || []).find((item) => item.text)?.text || "",
        },
        audio: { uk: "", us: "" },
        meanings,
        forms: [],
        examTags: [],
        preview: meanings[0].text,
        englishDefinitions,
        phrases: [],
        synonyms: [],
        examples: [],
        etymology: [],
        images: [],
        source: { name: "Free Dictionary", url: entry.sourceUrls?.[0] || "https://dictionaryapi.dev/" },
        fetchedAt: Math.floor(Date.now() / 1000),
        fallback: true,
        notice: "有道词典暂时不可用，当前显示英文释义。",
      };
    }
  } catch {
    // Fall through to the standard error below.
  }
  return null;
}

async function getDictionary(query) {
  const key = query.toLowerCase();
  const cached = dictionaryCache.get(key);
  if (cached && Date.now() - cached.fetchedAt * 1000 < 30 * 24 * 60 * 60 * 1000) {
    return { ...cached, cached: true };
  }
  const payload = await fetchJson(
    `https://dict.youdao.com/jsonapi?q=${encodeURIComponent(query)}`,
    {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://dict.youdao.com/",
        Accept: "application/json,text/plain,*/*",
      },
    },
    18000,
  );
  const result = normalizeDictionary(payload, query);
  if (!result.meanings.length && !result.englishDefinitions.length && !result.phrases.length) {
    throw new Error("No dictionary entry");
  }
  dictionaryCache.set(key, result);
  return result;
}

async function googleTranslate(texts) {
  const body = new URLSearchParams();
  for (const text of texts) body.append("q", text);
  const payload = await fetchJson(
    "https://translate.googleapis.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=zh-CN",
    {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json,text/plain,*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body,
    },
    15000,
  );
  let list = payload;
  if (!Array.isArray(list) && list && typeof list === "object") {
    list = list.sentences || list.translation || [];
  }
  if (!Array.isArray(list) || list.length !== texts.length) {
    throw new Error("Translation response size mismatch");
  }
  return list.map((item) => {
    if (Array.isArray(item)) {
      return item
        .map((piece) => (Array.isArray(piece) ? String(piece[0] || "") : String(piece || "")))
        .join("")
        .trim();
    }
    return String(item || "").trim();
  });
}

async function youdaoTranslate(text) {
  const body = new URLSearchParams({ q: text, from: "Auto", to: "Auto" });
  const payload = await fetchJson(
    "https://aidemo.youdao.com/trans",
    {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://aidemo.youdao.com/",
        Accept: "application/json,text/plain,*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body,
    },
    12000,
  );
  if (String(payload.errorCode) !== "0") throw new Error("Youdao translation error");
  return Array.isArray(payload.translation)
    ? payload.translation.join("").trim()
    : String(payload.translation || "").trim();
}

async function myMemoryTranslate(text) {
  const pieces = [];
  let remaining = text;
  while (remaining) {
    let piece;
    if (remaining.length <= 420) {
      piece = remaining;
      remaining = "";
    } else {
      let cut = remaining.lastIndexOf(" ", 420);
      if (cut < 200) cut = 420;
      piece = remaining.slice(0, cut);
      remaining = remaining.slice(cut).replace(/^\s+/, "");
    }
    const payload = await fetchJson(
      `https://api.mymemory.translated.net/get?${new URLSearchParams({
        q: piece,
        langpair: "en|zh-CN",
      })}`,
      { headers: { "User-Agent": USER_AGENT } },
      10000,
    );
    pieces.push(String((payload.responseData || {}).translatedText || "").trim());
  }
  return pieces.join("");
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

async function translateTexts(texts) {
  const results = texts.map(() => "");
  const chunks = [];
  let chunk = [];
  let size = 0;
  texts.forEach((text, index) => {
    if (chunk.length && (chunk.length >= 40 || size + text.length > 12000)) {
      chunks.push(chunk);
      chunk = [];
      size = 0;
    }
    chunk.push({ index, text });
    size += text.length;
  });
  if (chunk.length) chunks.push(chunk);

  await Promise.all(
    chunks.map(async (items) => {
      try {
        const values = await googleTranslate(items.map((item) => item.text));
        items.forEach((item, offset) => {
          results[item.index] = values[offset] || "";
        });
      } catch {
        const values = await mapLimit(items, 4, async (item) => {
          try {
            return await youdaoTranslate(item.text);
          } catch {
            try {
              return await myMemoryTranslate(item.text);
            } catch {
              return "";
            }
          }
        });
        items.forEach((item, offset) => {
          results[item.index] = values[offset] || "";
        });
      }
    }),
  );
  return results;
}

async function handleImports(request, url, owner, method) {
  const headers = owner.setCookie ? { "Set-Cookie": owner.setCookie } : {};
  if (method === "GET" && url.pathname === "/api/imports") {
    const includeDeleted = url.searchParams.get("include_deleted") === "1";
    let items = await loadImports(owner.ownerId);
    if (!includeDeleted) items = items.filter((item) => !item.deletedAt);
    items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return json({ items: items.map(summary) }, 200, headers);
  }

  if (method === "POST" && url.pathname === "/api/imports") {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "请求格式不正确。" }, 400, headers);
    }
    const text = String(payload.text || "").trim();
    if (!text) return json({ error: "文章正文不能为空。" }, 400, headers);
    let title = cleanField(payload.title);
    if (!title) {
      title = (text.split(/\r?\n/).find((line) => line.trim()) || "未命名文章").trim().slice(0, 120);
    }
    const now = Date.now();
    const id = cleanField(payload.id, 100) || `import-${Math.floor(now / 1000)}-${randomUUID().slice(0, 6)}`;
    const existing = await findImport(owner.ownerId, id);
    const item = {
      id,
      title,
      titleZh: cleanField(payload.titleZh),
      source: cleanField(payload.source || "截图导入"),
      sourceBookId: cleanField(payload.sourceBookId, 120),
      notes: cleanField(payload.notes, 2000),
      deletedAt: Number(payload.deletedAt || 0),
      text,
      createdAt: Number(payload.createdAt || existing?.createdAt || now),
      updatedAt: now,
      ownerId: owner.ownerId,
    };
    try {
      await saveImport(item);
    } catch (error) {
      return json({ error: `文章保存失败：${error.message}` }, 500, headers);
    }
    return json({ ...item, ...summary(item) }, 200, headers);
  }

  const prefix = "/api/imports/";
  if (!url.pathname.startsWith(prefix)) return json({ error: "接口不存在。" }, 404, headers);
  const id = decodeURIComponent(url.pathname.slice(prefix.length));
  const item = await findImport(owner.ownerId, id);
  if (!item) return json({ error: "没有找到这篇文章。" }, 404, headers);

  if (method === "GET") return json(item, 200, headers);

  if (method === "PATCH") {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "请求格式不正确。" }, 400, headers);
    }
    if ("title" in payload) item.title = cleanField(payload.title) || item.title || "";
    if ("titleZh" in payload) item.titleZh = cleanField(payload.titleZh);
    if ("source" in payload) item.source = cleanField(payload.source || "我的导入");
    if ("sourceBookId" in payload) item.sourceBookId = cleanField(payload.sourceBookId, 120);
    if ("notes" in payload) item.notes = cleanField(payload.notes, 2000);
    if (payload.restore) item.deletedAt = 0;
    if ("appendText" in payload) {
      const addition = String(payload.appendText || "").trim();
      if (!addition) return json({ error: "追加内容不能为空。" }, 400, headers);
      const existingText = String(item.text || "");
      item.text = existingText.trim() ? `${existingText.replace(/\s+$/, "")}\n\n${addition}` : addition;
    }
    item.updatedAt = Date.now();
    try {
      await saveImport(item);
    } catch (error) {
      return json({ error: `文章更新失败：${error.message}` }, 500, headers);
    }
    return json(item, 200, headers);
  }

  if (method === "DELETE") {
    const permanent = url.searchParams.get("permanent") === "1";
    if (permanent) {
      await deleteImport(item);
    } else {
      item.deletedAt = Date.now();
      item.updatedAt = Date.now();
      await saveImport(item);
    }
    return json({ ok: true, id, permanent }, 200, headers);
  }

  return json({ error: "接口不存在。" }, 404, headers);
}

export default async (request) => {
  const url = new URL(request.url);
  const path = url.pathname.startsWith("/.netlify/functions/api")
    ? `/${url.pathname.split("/.netlify/functions/api")[1] || ""}`.replace(/\/+$/, "") || "/"
    : url.pathname;
  const owner = ownerContext(request);
  const method = request.method.toUpperCase();

  try {
    if (method === "GET" && path === "/api/health") {
      return json({ ok: true, books: booksPayload.count || 0, time: Math.floor(Date.now() / 1000) });
    }
    if (method === "GET" && path === "/api/books") return json(booksPayload);

    if (method === "GET" && path.startsWith("/api/text/")) {
      const bookId = decodeURIComponent(path.slice("/api/text/".length));
      const book = (booksPayload.books || []).find((item) => item.id === bookId);
      if (!book) return json({ error: "没有找到这本书。" }, 404);
      if (!book.gutenbergId) return json({ error: "这本书没有可用的全文。" }, 409);
      try {
        const text = await getBookText(book);
        return json({
          bookId,
          title: book.title,
          author: book.author,
          gutenbergId: book.gutenbergId,
          text,
          chars: text.length,
        });
      } catch (error) {
        return json(
          {
            error: "全文下载失败。请稍后重试；已缓存的公版书不受影响。",
            detail: String(error.message || error).slice(0, 160),
          },
          502,
        );
      }
    }

    if (method === "GET" && path === "/api/dictionary") {
      const query = (url.searchParams.get("word") || "").trim();
      if (!query || query.length > 80 || !/^[A-Za-z][A-Za-z'’ .-]{0,79}$/.test(query)) {
        return json({ error: "请输入 1–80 个英文字母、撇号或连字符。" }, 400);
      }
      try {
        return json(await getDictionary(query));
      } catch (error) {
        const fallback = await dictionaryFallback(query);
        if (fallback) return json(fallback);
        return json(
          {
            error: "词典服务暂时没有响应。请检查网络后重试。",
            detail: String(error.message || error).slice(0, 160),
            query,
          },
          502,
        );
      }
    }

    if (method === "POST" && path === "/api/translate") {
      let payload;
      try {
        payload = await request.json();
      } catch {
        return json({ error: "请求格式不正确。" }, 400);
      }
      const texts = payload?.texts;
      if (!Array.isArray(texts) || !texts.length) return json({ error: "需要提供要翻译的段落。" }, 400);
      if (texts.length > 120) return json({ error: "一次最多翻译 120 段。" }, 400);
      const cleaned = texts.map((text) => String(text || "").trim());
      if (cleaned.some((text) => text.length > 6000)) {
        return json({ error: "单个段落不能超过 6000 个字符。" }, 400);
      }
      const translations = await translateTexts(cleaned);
      return json({
        translations,
        source: { name: "Google 翻译 · 有道备用", url: "https://translate.google.com/" },
      });
    }

    if (path.startsWith("/api/imports")) {
      const routedUrl = new URL(request.url);
      routedUrl.pathname = path;
      return await handleImports(request, routedUrl, owner, method);
    }

    return json({ error: "接口不存在。" }, 404);
  } catch (error) {
    return json({ error: "服务暂时不可用。", detail: String(error.message || error).slice(0, 160) }, 500);
  }
};

