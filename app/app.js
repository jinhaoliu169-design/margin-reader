const STORAGE = {
  progress: "margin_progress_v1",
  highlights: "margin_highlights_v1",
  wordbook: "margin_wordbook_v1",
  imports: "margin_imports_v1",
  recentWords: "margin_recent_words_v1",
  readerSize: "margin_reader_size_v1",
  selectedColor: "margin_selected_color_v1",
  noiseFilter: "margin_noise_filter_v1",
  magazineLinks: "margin_magazine_links_v1",
};

const PAGE_SIZE = 55;
const CATEGORIES = ["全部", "经典", "奇幻", "科幻", "悬疑", "爱情", "历史", "成长", "惊悚", "恐怖", "文学"];
const MAGAZINE_PUBLICATIONS = [
  {
    name: "The Economist",
    zh: "经济学人",
    aliases: ["economist", "经济学人"],
    url: "https://www.economist.com",
    freeUrl: "https://www.economist.com/latest",
    access: "paid",
    note: "多数深度文章需要订阅；首页、播客和部分栏目可以先免费看。",
    level: "雅思 / 六级",
  },
  {
    name: "The Guardian",
    zh: "卫报",
    aliases: ["guardian", "卫报"],
    url: "https://www.theguardian.com/international",
    freeUrl: "https://www.theguardian.com/international",
    access: "free",
    note: "新闻与评论通常可以直接阅读；部分内容会邀请注册或捐助。",
    level: "雅思 / 六级",
  },
  {
    name: "New Scientist",
    zh: "新科学家",
    aliases: ["new scientist", "newscientist", "新科学家"],
    url: "https://www.newscientist.com",
    freeUrl: "https://www.newscientist.com/",
    access: "metered",
    note: "部分文章免费，深度内容通常需要订阅。",
    level: "雅思 / 六级",
  },
  {
    name: "National Geographic",
    zh: "国家地理",
    aliases: ["national geographic", "natgeo", "国家地理"],
    url: "https://www.nationalgeographic.com",
    freeUrl: "https://www.nationalgeographic.com/",
    access: "metered",
    note: "部分图文免费，完整杂志内容通常需要订阅。",
    level: "雅思 / 六级",
  },
  {
    name: "The Atlantic",
    zh: "大西洋月刊",
    aliases: ["atlantic", "大西洋月刊"],
    url: "https://www.theatlantic.com",
    freeUrl: "https://www.theatlantic.com/",
    access: "metered",
    note: "每月有免费文章额度，超过后需要订阅。",
    level: "雅思 / 六级",
  },
  {
    name: "TIME",
    zh: "时代周刊",
    aliases: ["time", "时代周刊", "时代"],
    url: "https://time.com",
    freeUrl: "https://time.com/",
    access: "metered",
    note: "新闻和部分榜单可免费看，长文可能有订阅限制。",
    level: "六级 / 雅思",
  },
  {
    name: "TIME for Kids",
    zh: "时代周刊少儿版",
    aliases: ["time for kids", "timeforkids", "时代少儿"],
    url: "https://www.timeforkids.com",
    freeUrl: "https://www.timeforkids.com/",
    access: "free",
    note: "面向青少年的新闻与科普，通常可以直接阅读。",
    level: "四级",
  },
  {
    name: "Scientific American",
    zh: "科学美国人",
    aliases: ["scientific american", "scientificamerican", "科学美国人"],
    url: "https://www.scientificamerican.com",
    freeUrl: "https://www.scientificamerican.com/",
    access: "metered",
    note: "部分文章免费，完整专题和过刊通常需要订阅。",
    level: "六级 / 雅思",
  },
  {
    name: "The Daily Telegraph",
    zh: "每日电讯报",
    aliases: ["telegraph", "daily telegraph", "每日电讯报"],
    url: "https://www.telegraph.co.uk",
    freeUrl: "https://www.telegraph.co.uk/",
    access: "paid",
    note: "多数文章有订阅墙，首页部分新闻可以先看。",
    level: "六级 / 雅思",
  },
  {
    name: "Christian Science Monitor",
    zh: "基督教科学箴言报",
    aliases: ["christian science monitor", "csmonitor", "箴言报"],
    url: "https://www.csmonitor.com",
    freeUrl: "https://www.csmonitor.com/",
    access: "metered",
    note: "部分内容免费，深度报道可能要求订阅。",
    level: "六级 / 雅思",
  },
  {
    name: "BBC Learning English",
    zh: "BBC 英语学习",
    aliases: ["bbc learning english", "bbc", "bbc英语"],
    url: "https://www.bbc.co.uk/learningenglish",
    freeUrl: "https://www.bbc.co.uk/learningenglish",
    access: "free",
    note: "专门面向英语学习者，课程、音频和文本通常免费。",
    level: "四级 / 六级",
  },
  {
    name: "USA Today",
    zh: "今日美国",
    aliases: ["usa today", "usatoday", "今日美国"],
    url: "https://www.usatoday.com",
    freeUrl: "https://www.usatoday.com",
    access: "free",
    note: "多数新闻可以直接阅读；部分栏目可能要求注册。",
    level: "四级",
  },
  {
    name: "Reader's Digest",
    zh: "读者文摘",
    aliases: ["reader's digest", "readers digest", "rd.com", "读者文摘"],
    url: "https://www.rd.com",
    freeUrl: "https://www.rd.com",
    access: "free",
    note: "大量生活、健康与趣味文章可免费阅读。",
    level: "四级",
  },
  {
    name: "The Conversation",
    zh: "对话",
    aliases: ["the conversation", "theconversation", "对话"],
    url: "https://theconversation.com",
    freeUrl: "https://theconversation.com",
    access: "free",
    note: "学者撰写的解释性文章，通常采用开放许可，可免费阅读。",
    level: "六级 / 雅思",
  },
  {
    name: "NPR",
    zh: "美国国家公共电台",
    aliases: ["npr", "美国国家公共电台"],
    url: "https://www.npr.org",
    freeUrl: "https://www.npr.org",
    access: "free",
    note: "新闻、文化与时事报道通常可以免费阅读和收听。",
    level: "六级 / 雅思",
  },
  {
    name: "BBC News",
    zh: "BBC 新闻",
    aliases: ["bbc news", "bbc新闻"],
    url: "https://www.bbc.com/news",
    freeUrl: "https://www.bbc.com/news",
    access: "free",
    note: "多数国际新闻可免费阅读，部分地区可能受访问限制。",
    level: "四级 / 六级",
  },
  {
    name: "The New York Times",
    zh: "纽约时报",
    aliases: ["new york times", "nytimes", "纽约时报"],
    url: "https://www.nytimes.com",
    freeUrl: "https://www.nytimes.com/",
    access: "paid",
    note: "有少量免费文章额度，长期阅读通常需要订阅。",
    level: "雅思 / 六级",
  },
  {
    name: "The Washington Post",
    zh: "华盛顿邮报",
    aliases: ["washington post", "washingtonpost", "华盛顿邮报"],
    url: "https://www.washingtonpost.com",
    freeUrl: "https://www.washingtonpost.com/",
    access: "paid",
    note: "部分文章免费，完整访问通常需要订阅。",
    level: "雅思 / 六级",
  },
  {
    name: "Wired",
    zh: "连线",
    aliases: ["wired", "连线"],
    url: "https://www.wired.com",
    freeUrl: "https://www.wired.com/",
    access: "metered",
    note: "科技与商业文章部分免费，深度内容可能收费。",
    level: "六级 / 雅思",
  },
  {
    name: "Smithsonian Magazine",
    zh: "史密森尼杂志",
    aliases: ["smithsonian", "史密森尼"],
    url: "https://www.smithsonianmag.com",
    freeUrl: "https://www.smithsonianmag.com/",
    access: "free",
    note: "历史、科学、艺术与文化文章通常可以免费阅读。",
    level: "六级 / 雅思",
  },
];
const COVER_PALETTES = [
  ["#435f50", "#fff8e8"],
  ["#2f3e53", "#f4e4b2"],
  ["#7d3f32", "#fbf1df"],
  ["#6f6641", "#fff8e5"],
  ["#3d3430", "#f4c95d"],
  ["#53606a", "#f6eee0"],
  ["#8a6a42", "#f8eedb"],
  ["#4c4857", "#f8efa6"],
];

const state = {
  books: [],
  view: "library",
  category: "全部",
  era: "all",
  readableOnly: false,
  sort: "recommended",
  query: "",
  visible: 30,
  selectedColor: safeRead(STORAGE.selectedColor, "yellow"),
  selection: null,
  currentBook: null,
  currentText: "",
  paragraphs: [],
  translations: {},
  translationLoading: new Set(),
  translationFailed: new Set(),
  expandedTranslations: new Set(),
  page: 0,
  totalPages: 1,
  visibleParagraphs: [],
  paragraphNoise: [],
  hiddenParagraphCount: 0,
  noiseFilter: Math.max(
    0,
    Math.min(100, Number(safeRead(STORAGE.noiseFilter, 60)) || 0),
  ),
  pageTranslationBusy: false,
  readerLoading: false,
  readerError: "",
  dictionary: null,
  dictionaryTab: "simple",
  wordbookQuery: "",
  wordSession: null,
  wordSessionConfig: { count: 20, mode: "mixed" },
  magazines: [],
  magazineQuery: "",
  magazineLevel: "all",
  magazineVisible: 24,
  magazineLookup: null,
  magazineLinkDraft: null,
  magazineLinks: safeRead(STORAGE.magazineLinks, []),
  pendingMagazine: null,
  metadataTarget: null,
  imports: safeRead(STORAGE.imports, []),
  pendingBookTitle: "",
  pendingBookSource: null,
  appendMode: null,
  pendingDictQuery: "",
  pendingDictMeta: null,
  pendingPageByBook: {},
  startContentForBookId: "",
  readerToken: 0,
  ocr: {
    status: "idle",
    files: [],
    progress: 0,
    message: "",
    text: "",
    title: "",
    titleZh: "",
    source: "",
    sourceBookId: "",
    notes: "",
    targetArticleId: "",
    error: "",
  },
};

const els = {
  main: document.querySelector("#app-main"),
  toolbar: document.querySelector("#selection-toolbar"),
  selectionHint: document.querySelector("#selection-hint"),
  dropOverlay: document.querySelector("#drop-overlay"),
  fileInput: document.querySelector("#global-import-file"),
  toastRegion: document.querySelector("#toast-region"),
  bookDialog: document.querySelector("#book-dialog"),
  bookDialogContent: document.querySelector("#book-dialog-content"),
  pasteDialog: document.querySelector("#paste-dialog"),
  pasteTextarea: document.querySelector("#paste-textarea"),
  metadataDialog: document.querySelector("#metadata-dialog"),
  searchForm: document.querySelector("#global-search"),
  searchInput: document.querySelector("#global-search-input"),
  topbarCount: document.querySelector("#topbar-count"),
  topbarContext: document.querySelector("#topbar-context"),
};

let dragDepth = 0;
let selectionTimer = 0;
let ocrWorker = null;

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeWord(value = "") {
  return value
    .trim()
    .replaceAll("’", "'")
    .replace(/^[^A-Za-z]+/, "")
    .replace(/[^A-Za-z' -]+$/, "")
    .replace(/\s+/g, " ");
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function coverPalette(book) {
  return COVER_PALETTES[hashString(book.id || book.title) % COVER_PALETTES.length];
}

function coverFallbackHtml(book, extraClass = "") {
  const [background, ink] = coverPalette(book);
  const series = book.available ? "ELEVEN · FULL TEXT" : book.id.startsWith("import-") ? "IMPORTED TEXT" : "ELEVEN · CATALOG";
  return `
    <div class="typographic-cover ${extraClass}" style="--cover-bg:${background};--cover-ink:${ink}">
      <span class="cover-series">${escapeHtml(series)}</span>
      <span class="cover-title">${escapeHtml(book.title || "Untitled")}</span>
      <span class="cover-author">${escapeHtml(book.author || "Unknown")}</span>
    </div>
  `;
}

function coverImageHtml(book) {
  if (!book.cover) return "";
  return `<img src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.title)} 封面" loading="lazy" referrerpolicy="no-referrer" onerror="this.classList.add('is-broken')" />`;
}

function findBook(bookId) {
  return (
    state.books.find((book) => book.id === bookId) ||
    state.imports.find((book) => book.id === bookId) ||
    state.magazines.find((book) => book.id === bookId) ||
    null
  );
}

function activeImports() {
  return state.imports.filter((item) => !item.deletedAt);
}

function latestProgress() {
  const progress = safeRead(STORAGE.progress, {});
  return Object.values(progress)
    .filter((item) => {
      const book = item?.bookId ? findBook(item.bookId) : null;
      return Boolean(book && !book.deletedAt);
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0] || null;
}

function defaultContinueBook() {
  return state.books.find((book) => book.gutenbergId === 11) || state.books.find((book) => book.available);
}

function continueTarget() {
  const progress = latestProgress();
  return progress ? findBook(progress.bookId) : defaultContinueBook();
}

function bookPageLabel(book) {
  const tags = [book.primary || "小说", book.year || "", book.available ? "可读全文" : "书目"].filter(Boolean);
  return tags.join(" · ");
}

function formatShortDate(value) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function formatLongDate(value) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function showToast(message, options = {}) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg aria-hidden="true"><use href="#${options.icon || "i-check"}"></use></svg>
    <span>${escapeHtml(message)}</span>
    ${options.actionLabel ? `<button type="button">${escapeHtml(options.actionLabel)}</button>` : ""}
  `;
  const action = toast.querySelector("button");
  if (action && options.onAction) {
    action.addEventListener("click", () => {
      options.onAction();
      toast.remove();
    });
  }
  els.toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), options.duration || 5000);
}

function setView(view) {
  state.view = view;
  document.body.dataset.view = view;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active =
      link.dataset.nav === view ||
      (view === "reading" && link.dataset.nav === "reading");
    link.classList.toggle("is-active", active);
  });
}

function updateTopbar(context) {
  if (context) els.topbarContext.textContent = context;
  els.topbarCount.textContent =
    state.view === "magazines"
      ? `${state.magazines.length || 120} 篇`
      : `${state.books.length || 620} 本`;
}

function navigate(route) {
  if (location.hash === route) {
    handleRoute();
  } else {
    location.hash = route;
  }
}

async function init() {
  bindEvents();
  try {
    const response = await fetch("data/books.json");
    if (!response.ok) throw new Error("Book catalog unavailable");
    const payload = await response.json();
    state.books = payload.books || [];
    const magazinePayload = await fetch("data/magazines.json")
      .then((result) => (result.ok ? result.json() : { articles: [] }))
      .catch(() => ({ articles: [] }));
    state.magazines = (magazinePayload.articles || []).map((article) => ({
      ...article,
      kind: "magazine",
      available: true,
      primary: "外刊精读",
      author: article.source || "Eleven 精读编辑部",
      tags: [article.levelZh || "", article.topic || ""].filter(Boolean),
      cover: "",
    }));
    const localImports = sanitizeImports(safeRead(STORAGE.imports, []));
    state.imports = localImports;
    syncImportsFromServer(localImports)
      .then((imports) => {
        state.imports = imports;
        if (state.view === "import") renderImport();
        else if (state.view === "me") renderMyPage();
      })
      .catch(() => {});
    updateTopbar();
    if (!location.hash) {
      history.replaceState(null, "", "#/library");
    }
    await handleRoute();
  } catch (error) {
    els.main.innerHTML = `
      <section class="library-view">
        <div class="empty-state">
          <div>
            <div class="empty-state-mark"><svg><use href="#i-books"></use></svg></div>
            <h3>书库没有载入</h3>
            <p>请确认你是通过本项目的启动器打开网站，而不是直接双击 HTML 文件。</p>
            <button class="button-primary" type="button" data-action="reload">重新载入</button>
          </div>
        </div>
      </section>
    `;
  }
}

function sanitizeImports(imports) {
  if (!Array.isArray(imports)) return [];
  return imports
    .filter((item) => item && item.id)
    .map((item) => ({
      ...item,
      available: true,
      primary: "我的导入",
      tags: ["我的导入"],
      author: item.author || item.source || "截图识别",
      cover: "",
      source: item.source || "我的导入",
      titleZh: item.titleZh || "",
      sourceBookId: item.sourceBookId || "",
      notes: item.notes || "",
      deletedAt: Number(item.deletedAt || 0),
    }));
}

async function syncImportsFromServer(localImports = []) {
  const response = await fetch("/api/imports?include_deleted=1");
  if (!response.ok) throw new Error("文章列表读取失败。");
  const payload = await response.json();
  let remote = Array.isArray(payload.items) ? payload.items : [];
  const localById = new Map(localImports.map((item) => [item.id, item]));
  const remoteIds = new Set(remote.map((item) => item.id));

  const migrated = [];
  for (const item of localImports) {
    if (remoteIds.has(item.id) || !item.text) continue;
    try {
      const saved = await saveImportToServer(item);
      migrated.push(saved);
    } catch {
      migrated.push(item);
    }
  }

  const mergedById = new Map();
  for (const item of remote) {
    const local = localById.get(item.id);
    mergedById.set(item.id, {
      ...item,
      text: local?.text || item.text || "",
      available: true,
      primary: "我的导入",
      tags: ["我的导入"],
      author: item.source || "截图识别",
      cover: "",
    });
  }
  for (const item of migrated) {
    mergedById.set(item.id, sanitizeImports([item])[0]);
  }
  for (const item of localImports) {
    if (!mergedById.has(item.id)) mergedById.set(item.id, item);
  }
  const merged = [...mergedById.values()].sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
  safeWrite(STORAGE.imports, merged);
  return merged;
}

async function saveImportToServer(item) {
  const response = await fetch("/api/imports", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      id: item.id,
      title: item.title,
      titleZh: item.titleZh || "",
      source: item.source || "截图导入",
      sourceBookId: item.sourceBookId || "",
      notes: item.notes || "",
      text: item.text || "",
      createdAt: item.createdAt || Date.now(),
      deletedAt: item.deletedAt || 0,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "文章保存失败。");
  return {
    ...payload,
    available: true,
    primary: "我的导入",
    tags: ["我的导入"],
    author: payload.source || "截图识别",
    cover: "",
  };
}

async function handleRoute() {
  hideSelectionToolbar();
  els.toastRegion.replaceChildren();
  document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
  const hash = location.hash || "#/library";
  if (hash !== "#/import" && state.appendMode) {
    state.appendMode = null;
  }
  if (!state.books.length) return;

  if (hash === "#/library") {
    state.view = "library";
    setView("library");
    updateTopbar(`Eleven 精读书库 · ${state.books.length} 本英语小说`);
    renderLibrary();
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  if (hash === "#/reading") {
    const book = continueTarget();
    if (book) {
      state.startContentForBookId = book.id;
      navigate(`#/read/${encodeURIComponent(book.id)}`);
    } else {
      navigate("#/library");
    }
    return;
  }

  if (hash === "#/magazines") {
    state.view = "magazines";
    setView("magazines");
    updateTopbar("Eleven 外刊精读 · 四级 / 六级 / 雅思");
    renderMagazines();
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  if (hash.startsWith("#/read/")) {
    const bookId = decodeURIComponent(hash.replace("#/read/", ""));
    await openReader(bookId);
    return;
  }

  if (hash === "#/import") {
    state.view = "import";
    setView("import");
    updateTopbar("截图精读 · OCR");
    renderImport();
    return;
  }

  if (hash === "#/wordbook") {
    state.view = "wordbook";
    setView("wordbook");
    updateTopbar("我的生词");
    renderWordbook();
    return;
  }

  if (hash === "#/me") {
    state.view = "me";
    setView("me");
    updateTopbar("我的阅读档案");
    renderMyPage();
    return;
  }

  navigate("#/library");
}

/* Library */

function renderLibrary() {
  const continueBook = continueTarget();
  const progress = latestProgress();
  const progressPercent = progress
    ? Math.max(2, Math.round(((progress.page + 1) / Math.max(1, progress.totalPages)) * 100))
    : 0;
  const readableCount = state.books.filter((book) => book.available).length;
  const highlightCount = Object.values(safeRead(STORAGE.highlights, {})).reduce(
    (sum, items) => sum + (Array.isArray(items) ? items.length : 0),
    0,
  );
  const savedWordCount = getWordbook().length;
  const categories = CATEGORIES.map(
    (category) => `
      <button class="filter-chip ${state.category === category ? "is-active" : ""}" type="button" data-genre="${category}">
        ${category}
      </button>
    `,
  ).join("");

  els.main.innerHTML = `
    <section class="library-view">
      <div class="library-hero">
        <div class="hero-copy">
          <div class="hero-kicker">The weekly reading edition</div>
          <h1 class="hero-title">Eleven<br /><span class="marked-word">精读书库。</span></h1>
          <p class="hero-motto">把小说，读成自己的。</p>
          <p class="hero-lede">
            <strong>${state.books.length} 本公版英语小说</strong>，全部可以在站内免费读全文。
            选中一个词，标记它，也留住它；拖进一页文章截图，文字也会回到同一个阅读器。
          </p>
          <div class="hero-actions">
            <button class="button-primary" type="button" data-action="continue-reading">
              <svg><use href="#i-reader"></use></svg>
              ${progress ? "继续上次阅读" : "从爱丽丝开始"}
            </button>
            <button class="button-secondary" type="button" data-action="open-import">
              <svg><use href="#i-image"></use></svg>
              导入一页文章
            </button>
          </div>
          <div class="hero-note">
            <div class="note-avatars" aria-hidden="true"><span>A</span><span>M</span><span>J</span></div>
            <span>全部公版 · 免费阅读全文 · 支持标记、逐段译文与生词本</span>
          </div>
        </div>

        <div class="reading-preview-wrap">
          <article class="reading-preview" aria-label="标记与查词示例">
            <div class="preview-topline">
              <span>精读示例 · ①</span>
              <span>Pride and Prejudice</span>
            </div>
            <h2 class="preview-book-title">Pride and Prejudice</h2>
            <div class="preview-byline">傲慢与偏见 · Jane Austen · 1813</div>
            <div class="preview-rule"></div>
            <p class="preview-text">
              It is a truth universally
              <span class="demo-mark">acknowledged</span>, that a single man in
              possession of a good fortune, must be in want of a wife.
            </p>
            <div class="preview-definition">
              <div class="preview-def-word">
                <span>acknowledged</span>
                <small>/əkˈnɒlɪdʒd/</small>
              </div>
              <p><span>adj.</span> 公认的；被普遍承认的。</p>
            </div>
            <div class="preview-footer">
              <span>选中 → 标记 → 释义</span>
              <div class="preview-progress">
                <div class="preview-progress-track"><span style="width:${progressPercent || 38}%"></span></div>
                <span>${progressPercent ? `${progressPercent}%` : "示例"}</span>
              </div>
            </div>
          </article>
        </div>

        <button class="hero-drop" type="button" data-action="choose-import">
          <span class="hero-drop-main">
            <span class="hero-drop-icon"><svg><use href="#i-image"></use></svg></span>
            <span>
              <strong>把文章截图拖进来</strong>
              <small>自动识别英文 → 进入同一套标记和查词流程</small>
            </span>
          </span>
          <span class="button-secondary">选择图片</span>
        </button>
      </div>

      <div class="library-overview" aria-label="阅读数据概览">
        <div class="overview-cell">
          <span>书库规模</span>
          <strong>${state.books.length}</strong>
          <small>本英语小说</small>
        </div>
        <div class="overview-cell">
          <span>可直接阅读</span>
          <strong>${readableCount}</strong>
          <small>本公版全文</small>
        </div>
        <div class="overview-cell">
          <span>原文标记</span>
          <strong>${highlightCount}</strong>
          <small>处彩色高亮</small>
        </div>
        <div class="overview-cell">
          <span>生词积累</span>
          <strong>${savedWordCount}</strong>
          <small>个上下文单词</small>
        </div>
      </div>

      <div class="library-section">
        <div class="section-heading">
          <div>
            <h2>书架</h2>
            <p>经典、类型小说与文学名著，全部可免费阅读全文。</p>
          </div>
          <div class="section-count"><strong id="catalog-result-count">${state.books.length}</strong> 本可见</div>
        </div>

        <div class="catalog-toolbar">
          <div class="genre-filters" aria-label="按类型筛选">${categories}</div>
          <div class="catalog-tools">
            <select id="era-filter" aria-label="按年代筛选">
              <option value="all">全部年代</option>
              <option value="pre1900">1900 年前</option>
              <option value="1900s">1900–1949</option>
              <option value="1950s">1950–1999</option>
              <option value="2000s">2000 年后</option>
            </select>
            <select id="sort-select" aria-label="排序方式">
              <option value="recommended">推荐顺序</option>
              <option value="recent">出版时间</option>
              <option value="title">书名 A–Z</option>
            </select>
            <label class="readable-toggle">
              <input id="readable-only" type="checkbox" ${state.readableOnly ? "checked" : ""} />
              仅看全文
            </label>
          </div>
        </div>

        <div class="book-grid" id="book-grid"></div>
        <div id="catalog-empty"></div>
        <div class="load-more-wrap" id="load-more-wrap"></div>
      </div>
    </section>
  `;

  els.searchInput.value = state.query;
  document.querySelector("#era-filter").value = state.era;
  document.querySelector("#sort-select").value = state.sort;
  refreshCatalog();
  if (continueBook && progress) {
    updateTopbar(`正在读 · ${continueBook.title}`);
  }
}

function filteredBooks() {
  const query = state.query.trim().toLowerCase();
  let books = state.books.filter((book) => {
    if (state.readableOnly && !book.available) return false;
    if (state.category !== "全部") {
      const inCategory = book.primary === state.category || (book.tags || []).includes(state.category);
      if (!inCategory) return false;
    }
    if (state.era !== "all") {
      const year = Number(book.year) || 0;
      if (state.era === "pre1900" && year >= 1900) return false;
      if (state.era === "1900s" && (year < 1900 || year > 1949)) return false;
      if (state.era === "1950s" && (year < 1950 || year > 1999)) return false;
      if (state.era === "2000s" && year < 2000) return false;
    }
    if (query) {
      const haystack = `${book.title} ${book.titleZh || ""} ${book.author}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  books = [...books].sort((a, b) => {
    if (state.sort === "recent") return (b.year || 0) - (a.year || 0);
    if (state.sort === "title") return a.title.localeCompare(b.title, "en");
    return (a.featuredRank || 99999) - (b.featuredRank || 99999);
  });
  return books;
}

function renderBookCard(book, index) {
  return `
    <article class="book-card" style="animation-delay:${Math.min(index, 18) * 12}ms">
      <button class="book-cover-button" type="button" data-book-id="${escapeHtml(book.id)}" aria-label="打开 ${escapeHtml(book.title)}">
        <span class="book-cover-wrap">
          ${coverFallbackHtml(book)}
          ${coverImageHtml(book)}
          ${book.available ? '<span class="book-availability">全文</span>' : ""}
        </span>
      </button>
      <div class="book-meta">
        <button class="book-cover-button" type="button" data-book-id="${escapeHtml(book.id)}">
          <h3 class="book-title">${escapeHtml(book.title)}</h3>
        </button>
        ${book.titleZh && book.titleZh !== book.title ? `<div class="book-title-zh">${escapeHtml(book.titleZh)}</div>` : ""}
        <div class="book-byline">
          <span>${escapeHtml(book.author)}</span>
          <i></i>
          <span>${book.year || "—"}</span>
        </div>
        <div class="book-tagline">
          <span>${escapeHtml(book.primary || "小说")}</span>
          ${(book.tags || []).slice(1, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
    </article>
  `;
}

function refreshCatalog() {
  const grid = document.querySelector("#book-grid");
  if (!grid) return;
  const books = filteredBooks();
  const visible = books.slice(0, state.visible);
  grid.innerHTML = visible.map(renderBookCard).join("");
  const count = document.querySelector("#catalog-result-count");
  if (count) count.textContent = books.length;
  const empty = document.querySelector("#catalog-empty");
  empty.innerHTML = books.length
    ? ""
    : `
      <div class="empty-state">
        <div>
          <div class="empty-state-mark"><svg><use href="#i-search"></use></svg></div>
          <h3>这一格还没有书</h3>
          <p>换一个类型、年代或搜索词试试。也可以清空筛选，回到完整书库。</p>
          <button class="button-secondary" type="button" data-action="clear-filters">清空筛选</button>
        </div>
      </div>
    `;
  const loadMore = document.querySelector("#load-more-wrap");
  loadMore.innerHTML =
    books.length > visible.length
      ? `<button class="button-secondary" type="button" data-action="load-more">再看 ${Math.min(30, books.length - visible.length)} 本</button>`
      : "";
  document.querySelectorAll("[data-genre]").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.genre === state.category);
  });
}

/* Magazines */

function magazineAccessMeta(access) {
  const map = {
    free: { label: "免费", className: "is-free" },
    metered: { label: "部分免费", className: "is-metered" },
    paid: { label: "付费", className: "is-paid" },
    unknown: { label: "以官网为准", className: "is-unknown" },
  };
  return map[access] || map.unknown;
}

function findPublication(query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return null;
  return (
    MAGAZINE_PUBLICATIONS.find((item) => {
      const names = [item.name, item.zh, ...(item.aliases || [])].map((name) =>
        String(name).toLowerCase(),
      );
      return names.some((name) => name === needle || name.includes(needle) || needle.includes(name));
    }) || null
  );
}

function magazineHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "外部链接";
  }
}

function magazineSearchLinks(query, publication) {
  const encoded = encodeURIComponent(query);
  const links = [
    { label: "百度搜索", url: `https://www.baidu.com/s?wd=${encoded}` },
    { label: "Bing 搜索", url: `https://www.bing.com/search?q=${encoded}` },
    { label: "Google 搜索", url: `https://www.google.com/search?q=${encoded}` },
  ];
  if (publication) {
    links.unshift({ label: "打开官网", url: publication.url });
    if (publication.freeUrl) links.splice(1, 0, { label: "免费入口", url: publication.freeUrl });
    links.push({
      label: "站内搜这篇",
      url: `https://www.google.com/search?q=${encodeURIComponent(`site:${magazineHost(publication.url)} ${query}`)}`,
    });
  }
  return links;
}

function runMagazineLookup(query) {
  const cleaned = String(query || "").trim();
  if (!cleaned) {
    state.magazineLookup = null;
    renderMagazines();
    return;
  }
  const needle = cleaned.toLowerCase();
  const publication = findPublication(cleaned);
  const articles = state.magazines
    .filter((article) =>
      [article.title, article.titleZh, article.reference, article.topic, article.summary]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle)),
    )
    .slice(0, 6);
  state.magazineLookup = {
    query: cleaned,
    publication,
    articles,
    links: magazineSearchLinks(cleaned, publication),
  };
  state.magazineQuery = cleaned;
  state.magazineVisible = 24;
  renderMagazines();
}

function magazineLookupMarkup(lookup) {
  if (!lookup) {
    return `
      <div class="magazine-lookup-empty">
        <span>搜索提示</span>
        <p>可以输入刊名（如 The Economist / 经济学人），也可以输入文章标题。找不到时会给官网和搜索引擎入口，不会假装有全文。</p>
      </div>
    `;
  }
  const publication = lookup.publication;
  const access = magazineAccessMeta(publication?.access || "unknown");
  return `
    <div class="magazine-lookup-results">
      ${
        publication
          ? `
            <div class="magazine-pub-result">
              <div class="magazine-pub-head">
                <div>
                  <span class="magazine-result-kicker">MATCHED PUBLICATION</span>
                  <h3>${escapeHtml(publication.name)}</h3>
                  <p>${escapeHtml(publication.zh)} · ${escapeHtml(publication.level)}</p>
                </div>
                <span class="magazine-access ${access.className}">${access.label}</span>
              </div>
              <p class="magazine-pub-note">${escapeHtml(publication.note)}</p>
              <div class="magazine-search-actions">
                ${lookup.links
                  .map(
                    (link) =>
                      `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}<svg><use href="#i-external"></use></svg></a>`,
                  )
                  .join("")}
              </div>
            </div>
          `
          : ""
      }
      ${
        lookup.articles.length
          ? `<div class="magazine-lookup-articles"><h3>站内马上能读的精读</h3><div class="magazine-mini-grid">${lookup.articles
              .map((article) => magazineCardMarkup(article, true))
              .join("")}</div></div>`
          : ""
      }
      ${
        !publication && !lookup.articles.length
          ? `<div class="magazine-no-result">
              <strong>还没有直接匹配到这本刊或这篇文章。</strong>
              <p>可以先打开搜索链接确认来源；找到能访问的页面后，把链接和备注存到「我的外刊链接」，再用截图精读导入正文。</p>
            </div>`
          : ""
      }
      <div class="magazine-lookup-footer">
        <div class="magazine-search-actions">
          ${lookup.links
            .map(
              (link) =>
                `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}<svg><use href="#i-external"></use></svg></a>`,
            )
            .join("")}
        </div>
        <button class="button-secondary" type="button" data-action="open-magazine-link-dialog" data-prefill-query="${escapeHtml(lookup.query)}" data-prefill-source="${escapeHtml(publication?.name || "")}" data-prefill-level="${escapeHtml(publication?.level || "")}">
          把这篇存为我的外刊
        </button>
      </div>
      <p class="magazine-lookup-note">付费状态按刊物常规政策标注，具体以官网当前页面为准；站内不会绕过付费墙。</p>
    </div>
  `;
}

function magazineCardMarkup(article, compact = false) {
  return `
    <article class="magazine-card ${compact ? "is-compact" : ""}">
      <div class="magazine-card-top">
        <span class="magazine-level ${article.level.toLowerCase()}">${escapeHtml(article.levelZh)}</span>
        <span>${escapeHtml(article.reference)}</span>
      </div>
      <h2>${escapeHtml(article.title)}</h2>
      <p class="magazine-card-zh">${escapeHtml(article.titleZh)}</p>
      <p class="magazine-card-summary">${escapeHtml(article.summary)}</p>
      <div class="magazine-card-meta">
        <span>${escapeHtml(article.topic)}</span>
        <span>${article.wordCount || 0} words</span>
        <span>原创分级</span>
      </div>
      <div class="magazine-card-actions">
        <button type="button" data-action="open-magazine" data-magazine-id="${escapeHtml(article.id)}">
          开始精读
          <svg><use href="#i-arrow"></use></svg>
        </button>
        <a href="${escapeHtml(article.sourceUrl)}" target="_blank" rel="noreferrer">参考官网<svg><use href="#i-external"></use></svg></a>
      </div>
    </article>
  `;
}

function magazineLinkMarkup(link) {
  const access = magazineAccessMeta(link.access);
  return `
    <article class="magazine-link-card">
      <div class="magazine-link-top">
        <span class="magazine-access ${access.className}">${access.label}</span>
        <span>${escapeHtml(link.level || "未标注难度")}</span>
      </div>
      <h3>${escapeHtml(link.title || "未命名外刊")}</h3>
      ${link.titleZh ? `<p class="magazine-link-zh">${escapeHtml(link.titleZh)}</p>` : ""}
      <div class="magazine-link-meta">${escapeHtml(link.source || "我的外刊")} · ${escapeHtml(magazineHost(link.url))}</div>
      ${link.notes ? `<p class="magazine-link-notes">${escapeHtml(link.notes)}</p>` : ""}
      <div class="magazine-link-actions">
        <a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">打开链接<svg><use href="#i-external"></use></svg></a>
        <button type="button" data-action="start-magazine-screenshot" data-link-id="${escapeHtml(link.id)}">截图精读</button>
        <button class="magazine-link-delete" type="button" data-action="delete-magazine-link" data-link-id="${escapeHtml(link.id)}" aria-label="删除这个外刊链接"><svg><use href="#i-trash"></use></svg></button>
      </div>
    </article>
  `;
}

function renderMagazines() {
  const query = state.magazineLookup ? "" : state.magazineQuery.trim().toLowerCase();
  const filtered = state.magazines.filter((article) => {
    const levelMatch = state.magazineLevel === "all" || article.level === state.magazineLevel;
    const queryMatch =
      !query ||
      [article.title, article.titleZh, article.reference, article.topic, article.summary]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    return levelMatch && queryMatch;
  });
  const visible = filtered.slice(0, state.magazineVisible);
  const links = state.magazineLinks || [];
  els.main.innerHTML = `
    <section class="magazine-view">
      <header class="magazine-hero">
        <span class="magazine-kicker">THE WEEKLY READING EDITION</span>
        <h1><span class="magazine-wordmark">Eleven</span> 外刊书库</h1>
        <p class="magazine-motto">跟着 Eleven 外刊，看世界。</p>
        <div class="magazine-hero-actions">
          <button class="button-primary" type="button" data-action="focus-magazine-search">
            <svg><use href="#i-search"></use></svg>
            查一本外刊
          </button>
          <button class="button-secondary" type="button" data-action="open-magazine-link-dialog">
            <svg><use href="#i-plus"></use></svg>
            添加外刊链接
          </button>
        </div>
      </header>

      <section class="magazine-lookup-card">
        <div class="magazine-lookup-head">
          <div>
            <span class="magazine-result-kicker">FIND A MAGAZINE</span>
            <h2>在抖音、小红书看到一本外刊？</h2>
            <p>输入刊名或文章名，先确认它在哪本外刊、官网在哪、通常免费还是付费，再决定怎么读。</p>
          </div>
        </div>
        <form class="magazine-lookup-form" id="magazine-lookup-form">
          <svg><use href="#i-search"></use></svg>
          <input id="magazine-lookup-input" type="search" value="${escapeHtml(state.magazineLookup?.query || state.magazineQuery)}" placeholder="例如：The Economist / 经济学人 / AI and work" autocomplete="off" />
          <button class="button-primary" type="submit">查找链接</button>
        </form>
        ${magazineLookupMarkup(state.magazineLookup)}
      </section>

      <div class="magazine-filter-row">
        <div class="magazine-level-filters">
          ${[
            ["all", "全部"],
            ["CET4", "四级"],
            ["CET6", "六级"],
            ["IELTS", "雅思"],
          ]
            .map(
              ([value, label]) =>
                `<button class="filter-chip ${state.magazineLevel === value ? "is-active" : ""}" type="button" data-magazine-level="${value}">${label}</button>`,
            )
            .join("")}
        </div>
        <span class="magazine-count">${filtered.length} 篇 · 原创分级精读</span>
      </div>
      <div class="magazine-grid">
        ${visible.map((article) => magazineCardMarkup(article)).join("")}
      </div>
      ${
        filtered.length > visible.length
          ? `<div class="magazine-load-more"><button class="button-secondary" type="button" data-action="load-more-magazines">再看 ${Math.min(24, filtered.length - visible.length)} 篇</button></div>`
          : ""
      }

      <section class="my-magazine-links">
        <div class="magazine-section-head">
          <div>
            <span class="magazine-result-kicker">MY MAGAZINE LINKS</span>
            <h2>我的外刊链接</h2>
            <p>把官网、文章链接和备注存在一起；点「截图精读」会把标题和来源带到导入页。</p>
          </div>
          <button class="button-secondary" type="button" data-action="open-magazine-link-dialog">
            <svg><use href="#i-plus"></use></svg>
            添加链接
          </button>
        </div>
        ${
          links.length
            ? `<div class="magazine-link-grid">${links.map(magazineLinkMarkup).join("")}</div>`
            : `<div class="magazine-links-empty"><p>还没有保存外刊链接。搜到一篇想读的文章后，点「把这篇存为我的外刊」。</p></div>`
        }
      </section>

      <p class="magazine-copyright-note">
        站内 120 篇为原创分级精读，主题参考公开刊物，不是原文转载。受版权保护的原文请通过官网阅读；需要精读时，用截图或粘贴你自己能访问的片段。
      </p>
    </section>
  `;
  els.searchInput.value = "";
}

function openMagazineLinkDialog(draft = {}) {
  const dialog = document.querySelector("#magazine-link-dialog");
  if (!dialog) return;
  const set = (id, value) => {
    const field = dialog.querySelector(id);
    if (field) field.value = value || "";
  };
  const title = draft.title || draft.query || "";
  const source = draft.source || findPublication(draft.query || "")?.name || "";
  set("#mag-link-url", draft.url || "");
  set("#mag-link-title", title);
  set("#mag-link-title-zh", draft.titleZh || "");
  set("#mag-link-source", source);
  set("#mag-link-level", draft.level || "");
  set("#mag-link-access", draft.access || "unknown");
  set("#mag-link-notes", draft.notes || "");
  state.magazineLinkDraft = draft;
  dialog.showModal();
}

function saveMagazineLink() {
  const dialog = document.querySelector("#magazine-link-dialog");
  if (!dialog) return;
  let url = dialog.querySelector("#mag-link-url")?.value.trim() || "";
  if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    new URL(url);
  } catch {
    showToast("请填写一个有效的网页链接。", { icon: "i-x" });
    return;
  }
  const title = dialog.querySelector("#mag-link-title")?.value.trim() || magazineHost(url);
  const link = {
    id: `maglink-${Date.now().toString(36)}`,
    url,
    title,
    titleZh: dialog.querySelector("#mag-link-title-zh")?.value.trim() || "",
    source: dialog.querySelector("#mag-link-source")?.value.trim() || "我的外刊",
    level: dialog.querySelector("#mag-link-level")?.value || "",
    access: dialog.querySelector("#mag-link-access")?.value || "unknown",
    notes: dialog.querySelector("#mag-link-notes")?.value.trim() || "",
    createdAt: Date.now(),
  };
  state.magazineLinks = [link, ...(state.magazineLinks || [])];
  safeWrite(STORAGE.magazineLinks, state.magazineLinks);
  dialog.close();
  renderMagazines();
  showToast("外刊链接已保存。", { icon: "i-check" });
}

function deleteMagazineLink(id) {
  state.magazineLinks = (state.magazineLinks || []).filter((item) => item.id !== id);
  safeWrite(STORAGE.magazineLinks, state.magazineLinks);
  renderMagazines();
  showToast("已删除这个外刊链接。", { icon: "i-trash" });
}

function startMagazineScreenshot(linkId) {
  const link = (state.magazineLinks || []).find((item) => item.id === linkId);
  if (!link) return;
  state.pendingMagazine = link;
  state.pendingBookTitle = link.title;
  state.pendingBookSource = null;
  state.ocr.status = "idle";
  state.ocr.text = "";
  state.ocr.files = [];
  state.ocr.progress = 0;
  state.ocr.error = "";
  state.ocr.title = link.title;
  state.ocr.titleZh = link.titleZh || "";
  state.ocr.source = `${link.source}${link.level ? ` · ${link.level}` : ""}`;
  state.ocr.notes = link.notes || "";
  state.ocr.sourceBookId = "";
  navigate("#/import");
}

/* Reader */

async function openReader(bookId, options = {}) {
  let book = findBook(bookId);
  if (!book && bookId.startsWith("import-")) {
    try {
      const response = await fetch(`/api/imports/${encodeURIComponent(bookId)}`);
      const payload = await response.json().catch(() => ({}));
      if (response.ok && payload.id) {
        book = sanitizeImports([payload])[0];
        state.imports = [book, ...state.imports.filter((item) => item.id !== book.id)];
        safeWrite(STORAGE.imports, state.imports);
      }
    } catch {
      // Fall through to the normal not-found message.
    }
  }
  if (!book) {
    showToast("没有找到这本书。", { icon: "i-x" });
    navigate("#/library");
    return;
  }
  if (book.deletedAt) {
    showToast("这篇文章在回收站里，请先到「我的」恢复。", { icon: "i-trash" });
    navigate("#/me");
    return;
  }

  state.view = "reading";
  setView("reading");
  state.currentBook = book;
  if (state.startContentForBookId === book.id) {
    state.startContentForBookId = "";
    options.startContent = true;
  }
  state.translations = {};
  state.translationLoading.clear();
  state.translationFailed.clear();
  state.expandedTranslations.clear();
  state.visibleParagraphs = [];
  state.paragraphNoise = [];
  state.hiddenParagraphCount = 0;
  state.readerError = "";
  state.readerLoading = true;
  state.dictionary = null;
  state.dictionaryTab = "simple";
  state.pendingDictQuery = options.query || "";
  state.pendingDictMeta = options.query
    ? { bookId: book.id, bookTitle: book.title, paragraph: options.paragraph ?? null, origin: "lookup" }
    : null;
  const readerToken = Date.now() + Math.random();
  state.readerToken = readerToken;
  updateTopbar(book.title);
  const canReadDirectly = book.available || book.id.startsWith("import-") || book.kind === "magazine";
  if (!options.startContent && !canReadDirectly) {
    state.readerLoading = false;
    state.readerError = "";
    renderReaderCover();
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }
  renderReaderShell();
  window.scrollTo({ top: 0, behavior: "instant" });

  try {
    let text = "";
    if (book.kind === "magazine") {
      text = (book.paragraphs || []).join("\n\n");
    } else if (book.id.startsWith("import-")) {
      text = book.text || "";
      if (!text) {
        const response = await fetch(`/api/imports/${encodeURIComponent(book.id)}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "这篇文章的正文读取失败。");
        Object.assign(book, payload, {
          available: true,
          primary: "我的导入",
          tags: ["我的导入"],
          author: payload.source || "截图识别",
          cover: "",
        });
        text = payload.text || "";
        safeWrite(STORAGE.imports, state.imports);
      }
    } else {
      const response = await fetch(`/api/text/${encodeURIComponent(book.id)}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "全文载入失败。");
      text = payload.text || "";
    }
    if (state.readerToken !== readerToken) return;
    if (!text.trim()) throw new Error("这本书暂时没有可读取的正文。");

    state.currentText = text;
    state.paragraphs = parseParagraphs(text);
    state.paragraphNoise = analyzeParagraphNoise(state.paragraphs, book);
    rebuildParagraphView();
    remapHighlights(book.id, state.paragraphs);
    const saved = safeRead(STORAGE.progress, {})[book.id];
    const pendingParagraph = state.pendingPageByBook[book.id];
    delete state.pendingPageByBook[book.id];
    let requestedPage = Number.isFinite(options.page) ? options.page : null;
    if (requestedPage === null && Number.isFinite(pendingParagraph)) {
      const position = state.visibleParagraphs.findIndex((index) => index >= pendingParagraph);
      requestedPage = Math.floor(Math.max(0, position) / PAGE_SIZE);
    }
    if (requestedPage === null) {
      if (saved?.layout === 2 && Number.isFinite(Number(saved?.paragraph))) {
        const position = state.visibleParagraphs.findIndex(
          (index) => index >= Number(saved.paragraph),
        );
        requestedPage = Math.floor(Math.max(0, position) / PAGE_SIZE);
      } else {
        requestedPage = Number(saved?.page || 0);
      }
      if (saved?.layout !== 2 && requestedPage > 0) {
        const legacyCount = String(text)
          .replace(/\r\n?/g, "\n")
          .split(/\n\s*\n+/)
          .filter((block) => block.trim()).length;
        const legacyPages = Math.max(1, Math.ceil(legacyCount / PAGE_SIZE));
        requestedPage = Math.round(
          (requestedPage / Math.max(1, legacyPages - 1)) * Math.max(0, state.totalPages - 1),
        );
      }
    }
    state.page = Math.max(0, Math.min(state.totalPages - 1, requestedPage));
    state.readerLoading = false;
    renderReaderShell();
    saveProgress();
    prefetchCurrentPageTranslations();
    if (book.id.startsWith("import-")) {
      prefetchAllImportedTranslations();
    }
    if (state.pendingDictQuery) {
      const query = state.pendingDictQuery;
      const meta = state.pendingDictMeta;
      state.pendingDictQuery = "";
      state.pendingDictMeta = null;
      openDictionary(query, meta);
    }
  } catch (error) {
    if (state.readerToken !== readerToken) return;
    state.readerLoading = false;
    state.readerError = error.message || "全文载入失败。";
    renderReaderShell();
  }
}

function renderReaderCover() {
  const book = state.currentBook;
  if (!book) return;
  const progress = safeRead(STORAGE.progress, {})[book.id];
  const savedPage = Math.max(0, Number(progress?.page || 0));
  const alternatives = state.books
    .filter(
      (item) =>
        item.available &&
        item.id !== book.id &&
        (item.primary === book.primary || (item.tags || []).some((tag) => (book.tags || []).includes(tag))),
    )
    .slice(0, 4);
  const canRead = book.available || book.id.startsWith("import-") || book.kind === "magazine";
  const isMagazine = book.kind === "magazine";
  els.main.innerHTML = `
    <section class="book-landing">
      <button class="landing-back" type="button" data-action="back-library">
        <svg><use href="#i-chevron-left"></use></svg>
        返回书库
      </button>
      <div class="book-landing-main">
        <div class="landing-cover-wrap">
          <div class="landing-cover">
            ${coverFallbackHtml(book)}
            ${coverImageHtml(book)}
          </div>
          <span class="landing-cover-caption">${canRead ? (book.id.startsWith("import-") ? "我的文章" : "全文可读") : "版权书目"}</span>
        </div>
        <div class="landing-copy">
          <div class="reader-eyebrow">
            <span>${book.id.startsWith("import-") ? "Imported reading" : "English novel"}</span>
            <span>${book.year || ""}</span>
          </div>
          <h1 class="landing-title">${escapeHtml(book.title)}</h1>
          ${book.titleZh && book.titleZh !== book.title ? `<div class="landing-title-zh">${escapeHtml(book.titleZh)}</div>` : ""}
          <div class="landing-author">${escapeHtml(book.author)}</div>
          <div class="landing-tags">${(book.tags || [book.primary]).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          ${
            book.notes
              ? `<div class="landing-notes">备注 · ${escapeHtml(book.notes)}</div>`
              : book.subjects?.length
                ? `<p class="landing-subjects">${escapeHtml(book.subjects.slice(0, 3).join(" · "))}</p>`
                : ""
          }
          ${
            progress && canRead
              ? `<div class="landing-progress"><span>上次读到第 ${savedPage + 1} 页</span><strong>${Math.max(1, Math.round(((savedPage + 1) / Math.max(1, progress.totalPages || 1)) * 100))}%</strong></div>`
              : ""
          }
          <div class="landing-actions">
            ${
              canRead
                ? `<button class="button-primary landing-start" type="button" data-action="start-book-reading" data-page="${progress ? savedPage : 0}">
                    <svg><use href="#i-reader"></use></svg>
                    ${progress ? "继续阅读" : "开始阅读"}
                  </button>
                  ${progress && savedPage > 0 ? `<button class="button-secondary" type="button" data-action="start-book-reading" data-page="0">从头开始</button>` : ""}`
                : `<button class="button-primary landing-start" type="button" data-action="import-for-book" data-book-id="${escapeHtml(book.id)}">
                    <svg><use href="#i-upload"></use></svg>
                    导入本书文本或截图
                  </button>
                  <span class="borrow-slot" data-borrow-slot>
                    <span class="button-secondary borrow-loading">正在查找完整借阅版…</span>
                  </span>`
            }
          </div>
          ${
            !canRead
              ? `<p class="landing-copyright">这本书仍在版权保护期，站点不内置全文。你可以导入自己合法拥有的内容，或先读下方可直接打开全文的书。</p>`
              : ""
          }
        </div>
      </div>
      ${
        !canRead && alternatives.length
          ? `<div class="landing-alternatives">
              <div class="landing-alternatives-head">
                <h2>可直接阅读全文</h2>
                <p>点任意一本，直接进入正文阅读。</p>
              </div>
              <div class="landing-alternative-grid">
                ${alternatives.map(landingAlternativeMarkup).join("")}
              </div>
            </div>`
          : ""
      }
    </section>
  `;
  if (!canRead) loadBorrowLink(book);
}

function landingAlternativeMarkup(book) {
  return `
    <button class="landing-alternative" type="button" data-book-id="${escapeHtml(book.id)}">
      <span class="landing-alternative-cover">
        ${coverFallbackHtml(book)}
        ${coverImageHtml(book)}
      </span>
      <span class="landing-alternative-copy">
        <strong>${escapeHtml(book.titleZh || book.title)}</strong>
        <small>${escapeHtml(book.title)}</small>
        <em>${escapeHtml(book.author)}</em>
      </span>
      <svg><use href="#i-arrow"></use></svg>
    </button>
  `;
}

async function loadBorrowLink(book) {
  const slot = document.querySelector("[data-borrow-slot]");
  if (!slot) return;
  try {
    const response = await fetch(
      `/api/borrow?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`,
    );
    const payload = await response.json().catch(() => ({}));
    if (state.currentBook?.id !== book.id) return;
    if (!response.ok) throw new Error(payload.error || "暂未找到可借阅完整版。");
    slot.innerHTML = `
      <a class="button-secondary borrow-link" href="${escapeHtml(payload.url)}" target="_blank" rel="noreferrer">
        <svg><use href="#i-reader"></use></svg>
        在线借阅完整版
      </a>
      <small>Internet Archive · 可能需要登录或等待借阅</small>
    `;
  } catch (error) {
    if (state.currentBook?.id !== book.id) return;
    slot.innerHTML = `<span class="borrow-unavailable">${escapeHtml(error.message)}</span>`;
  }
}

function parseParagraphs(text) {
  const normalized = String(text)
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/\t/g, " ")
    .trim();
  const paragraphs = [];

  const splitLines = (block) =>
    block
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean);

  const blankSeparated = normalized.split(/\n\s*\n+/).filter((block) => block.trim());
  const lineSpaced =
    blankSeparated.length > 30 &&
    (normalized.match(/\n{3,}/g) || []).length > 20 &&
    blankSeparated.filter((block) => {
      const value = block.trim();
      return value.length < 110 && !/[.!?…]["'”’]?$/.test(value);
    }).length /
      blankSeparated.length >
      0.35;

  const blocks = lineSpaced ? normalized.split(/\n{3,}/) : normalized.split(/\n\s*\n+/);
  let bodyStarted = !lineSpaced;

  for (const rawBlock of blocks) {
    const lines = splitLines(rawBlock);
    if (!lines.length) continue;
    const joined = lines
      .join(" ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/([—–])\s+/g, "$1");
    if (
      lineSpaced &&
      !bodyStarted &&
      lines.length >= 2 &&
      joined.length >= 260 &&
      /[a-z]{3}/.test(joined)
    ) {
      bodyStarted = true;
    }
    if (lineSpaced && !bodyStarted) {
      // 版权页、书名清单等前置内容通常每组只有几行，逐行保留，便于按强度隐藏。
      paragraphs.push(...lines);
      continue;
    }
    if (lines.length === 1 && lines[0].length < 140) {
      paragraphs.push(lines[0]);
      continue;
    }
    const paragraph = joined;
    if (paragraph.length > 3000) {
      const sentences = paragraph.split(/(?<=[.!?])\s+(?=[A-Z“"'])/);
      let chunk = "";
      for (const sentence of sentences) {
        if ((chunk + " " + sentence).trim().length > 2200 && chunk) {
          paragraphs.push(chunk.trim());
          chunk = sentence;
        } else {
          chunk = `${chunk} ${sentence}`.trim();
        }
      }
      if (chunk) paragraphs.push(chunk.trim());
    } else {
      paragraphs.push(paragraph);
    }
  }

  return paragraphs.filter(Boolean);
}

function noiseWordSet(value) {
  return new Set(
    String(value || "")
      .toLowerCase()
      .match(/[a-z][a-z'’-]{2,}/g) || [],
  );
}

function analyzeParagraphNoise(paragraphs, book) {
  const total = paragraphs.length;
  const scores = new Array(total).fill(0);
  if (!total) return scores;

  const findBodyFrom = (start, end, step) => {
    for (let index = start; step > 0 ? index < end : index >= end; index += step) {
      const value = paragraphs[index] || "";
      const words = (value.match(/[A-Za-z][A-Za-z'’-]*/g) || []).length;
      const stops = (value.match(/[.!?…]["'”’]?(\s|$)/g) || []).length;
      if (value.length >= 170 && words >= 28 && stops >= 2) return index;
    }
    return step > 0 ? Math.min(total - 1, end) : 0;
  };

  const firstBody = findBodyFrom(0, Math.min(total, 140), 1);
  const lastBody = findBodyFrom(total - 1, Math.max(firstBody, 0), -1);
  const importedBook = Boolean(book?.id?.startsWith("import-"));
  const usePosition =
    !importedBook && firstBody < total - 1 && lastBody > firstBody;
  const titleWords = noiseWordSet(`${book?.title || ""} ${book?.titleZh || ""}`);
  const authorWords = noiseWordSet(book?.author || "");
  const seen = new Map();

  paragraphs.forEach((paragraph) => {
    const value = paragraph.trim();
    if (value.length > 140) return;
    const key = value.toLowerCase().replace(/\s+/g, " ");
    seen.set(key, (seen.get(key) || 0) + 1);
  });

  paragraphs.forEach((paragraph, index) => {
    const value = paragraph.trim();
    if (!value) {
      scores[index] = 100;
      return;
    }
    if (
      /^(chapter|book|part)\s+(?:[ivxlcdm]+|\d+)\b/i.test(value) ||
      /^(prologue|epilogue|introduction|preface)$/i.test(value)
    ) {
      scores[index] = 0;
      return;
    }

    let score = 0;
    const words = (value.match(/[A-Za-z][A-Za-z'’-]*/g) || []).length;
    const letters = (value.match(/[A-Za-z]/g) || []).length;
    const allCaps = /^[A-Z0-9 ,.'’&:;!?—-]+$/.test(value) && words >= 1 && words <= 12;
    const upper = value === value.toUpperCase() && /[A-Z]/.test(value);
    const frontMatter = usePosition && index < firstBody;
    const backMatter = usePosition && index > lastBody;
    const key = value.toLowerCase().replace(/\s+/g, " ");

    if (letters < 2 && !importedBook) score += 90;
    if (
      /^(?:\d{1,4}|[ivxlcdm]{1,7})[.)]?$/i.test(value) &&
      (!importedBook || frontMatter || backMatter)
    ) {
      score += 85;
    }
    if (value.length < 2 && !importedBook) score += 60;
    if (
      /(copyright|all rights reserved|printed in|isbn|library of congress|transcriber|proofread|produced by|project gutenberg|table of contents|list of illustrations|acknowledg|dedicat|also by|books by|published by|publisher|typeset|manufactured in|www\.|https?:)/i.test(
        value,
      )
    ) {
      score += 95;
    }
    if (/^(the end|end|finis|conclusion)[.!]?$/i.test(value)) score += 70;
    if ((seen.get(key) || 0) > 1 && value.length < 130 && (frontMatter || backMatter)) {
      score += 28;
    }
    if (upper && value.length < 96 && words <= 10 && !importedBook) score += 22;
    if (letters / value.length < 0.55 && !importedBook) score += 25;

    if (frontMatter) {
      score += 48;
      if (allCaps) score += 22;
      if (words < 10) score += 10;
      const tokens = noiseWordSet(value);
      if ([...tokens].some((word) => titleWords.has(word))) score += 20;
      if ([...tokens].some((word) => authorWords.has(word))) score += 20;
    }
    if (backMatter) {
      score += 34;
      if (allCaps) score += 18;
    }
    if (frontMatter || backMatter) {
      if (value.length < 30 && !/[.!?…]$/.test(value) && !/^["'“”‘’—]/.test(value)) score += 12;
    }

    scores[index] = Math.max(0, Math.min(100, score));
  });

  return scores;
}

function noiseCutoff(value = state.noiseFilter) {
  if (value <= 0) return 101;
  return Math.max(1, Math.round(101 - value));
}

function rebuildParagraphView() {
  if (!state.paragraphNoise.length || state.paragraphNoise.length !== state.paragraphs.length) {
    state.paragraphNoise = analyzeParagraphNoise(state.paragraphs, state.currentBook);
  }
  const cutoff = noiseCutoff();
  state.visibleParagraphs = state.paragraphs
    .map((_, index) => index)
    .filter((index) => (state.paragraphNoise[index] || 0) < cutoff);
  if (!state.visibleParagraphs.length && state.paragraphs.length) {
    state.visibleParagraphs = state.paragraphs.map((_, index) => index);
  }
  state.hiddenParagraphCount = state.paragraphs.length - state.visibleParagraphs.length;
  state.totalPages = Math.max(1, Math.ceil(state.visibleParagraphs.length / PAGE_SIZE));
}

function currentPageParagraphIndices() {
  const start = state.page * PAGE_SIZE;
  return state.visibleParagraphs.slice(start, start + PAGE_SIZE);
}

function isChapterHeading(text) {
  const clean = text.trim();
  if (!clean || clean.length > 100) return false;
  return (
    /^(chapter|book|part|canto|act|scene)\s+(?:[ivxlcdm]+|\d+)\b/i.test(clean) ||
    /^(prologue|epilogue|introduction|preface|contents|title page)$/i.test(clean) ||
    /^[IVXLCDM]+\.?$/.test(clean)
  );
}

function renderReaderShell() {
  const book = state.currentBook;
  if (!book) return;
  const progressPercent = state.totalPages ? Math.round(((state.page + 1) / state.totalPages) * 100) : 0;
  const savedSize = Number(safeRead(STORAGE.readerSize, 19.5)) || 19.5;
  const canRead = book.available || book.id.startsWith("import-") || book.kind === "magazine";
  const isMagazine = book.kind === "magazine";
  const pageTranslationIndices = state.readerLoading ? [] : currentPageTranslationIndices();
  const pageTranslationsExpanded =
    pageTranslationIndices.length > 0 &&
    pageTranslationIndices.every((index) => state.expandedTranslations.has(translationKey(index)));
  const pageText = state.readerLoading
    ? readerLoadingMarkup()
    : state.readerError
      ? readerErrorMarkup(state.readerError)
      : readerTextMarkup();

  els.main.innerHTML = `
    <section class="reading-view">
      <div class="reader-progress-global" aria-hidden="true"><span style="width:${progressPercent}%"></span></div>
      <div class="reader-layout">
        <aside class="reader-rail">
          <div class="reader-rail-cover">
            ${coverFallbackHtml(book)}
            ${coverImageHtml(book)}
          </div>
          <h2 class="reader-rail-title">${escapeHtml(book.title)}</h2>
          ${book.titleZh && book.titleZh !== book.title ? `<div class="reader-rail-title-zh">${escapeHtml(book.titleZh)}</div>` : ""}
          <div class="reader-rail-author">${escapeHtml(book.author)}</div>
          <div class="reader-rail-meta">
            ${(book.tags || [book.primary]).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            <span>${book.year || "—"}</span>
          </div>
          <div class="reader-progress-block">
            <div class="reader-progress-labels">
              <span>阅读进度</span>
              <strong>${state.readerLoading ? "读取中" : `${progressPercent}%`}</strong>
            </div>
            <div class="reader-progress-track"><span style="width:${progressPercent}%"></span></div>
          </div>
          <div class="reader-rail-note">
            <strong>查词，或留下标记</strong>
            选中词后可先「查词」听发音；想记住再点「标记」。颜色留在原文，释义出现在右侧。
          </div>
        </aside>

        <article class="reader-sheet" style="--reader-size:${savedSize}px;--reader-size-mobile:${Math.max(16.5, savedSize - 1.5)}px">
          <header class="reader-book-head">
            <div class="reader-eyebrow">
              <span>${isMagazine ? "Weekly reading edition" : book.id.startsWith("import-") ? "Imported reading" : "English novel"}</span>
              <span>${isMagazine ? `${escapeHtml(book.levelZh || "精读")} · 原创分级精读` : canRead ? (book.id.startsWith("import-") ? "已保存到后台" : "Project Gutenberg · 公版全文") : "Catalog only"}</span>
            </div>
            <h1 class="reader-title">${escapeHtml(book.title)}</h1>
            ${book.titleZh ? `<div class="reader-title-zh">${escapeHtml(book.titleZh)}</div>` : ""}
            <div class="reader-byline">${
              isMagazine
                ? `参考 · ${escapeHtml(book.reference || "")} · ${escapeHtml(book.author || "Eleven 精读编辑部")}`
                : book.id.startsWith("import-")
                  ? `来源 · ${escapeHtml(book.source || book.author || "我的导入")}`
                  : `${escapeHtml(book.author)}${book.year ? ` · ${book.year}` : ""}`
            }</div>
            ${
              isMagazine
                ? `<div class="reader-magazine-note">${escapeHtml(book.note || "原创分级精读，不是原文转载。")} <a href="${escapeHtml(book.sourceUrl || "#")}" target="_blank" rel="noreferrer">访问官网</a></div>`
                : ""
            }
            ${
              isMagazine && (book.vocab || []).length
                ? `<div class="reader-magazine-vocab">
                    <span>本篇重点词</span>
                    ${book.vocab
                      .map(
                        (item) =>
                          `<button type="button" data-action="lookup-magazine-word" data-word="${escapeHtml(item.word)}"><strong>${escapeHtml(item.word)}</strong><small>${escapeHtml(item.meaning)}</small></button>`,
                      )
                      .join("")}
                  </div>`
                : ""
            }
            ${
              book.id.startsWith("import-")
                ? `<button class="reader-append-inline" type="button" data-action="append-article"><svg><use href="#i-plus"></use></svg>继续添加内容</button>`
                : ""
            }
            ${book.notes ? `<div class="reader-notes">备注 · ${escapeHtml(book.notes)}</div>` : ""}
          </header>
          <div class="reader-tools">
            <div class="reader-tools-left">
              <button class="reader-tool-button" type="button" data-action="back-library" aria-label="返回书库">
                <svg><use href="#i-chevron-left"></use></svg>
              </button>
              <span>选中英文，查看释义</span>
              ${
                canRead && !state.readerLoading
                  ? `<button class="reader-page-translation" type="button" data-action="toggle-page-translation" aria-label="${pageTranslationsExpanded ? "收起本页译文" : "显示本页译文"}">
                      <svg><use href="#i-translate"></use></svg>
                      <span>${pageTranslationsExpanded ? "收起本页译文" : "显示本页译文"}</span>
                    </button>`
                  : ""
              }
            </div>
            <div class="reader-tools-right">
              <div class="reader-filter-wrap">
                <button class="reader-tool-button ${state.hiddenParagraphCount ? "has-filter" : ""}" type="button" data-action="toggle-noise-filter" aria-label="调整无关文字过滤" aria-expanded="false" title="无关文字过滤">
                  <svg><use href="#i-sliders"></use></svg>
                </button>
                <div class="reader-filter-popover" id="reader-filter-popover" hidden>
                  <div class="reader-filter-head">
                    <span>无关文字过滤</span>
                    <strong>${Math.round(state.noiseFilter)}%</strong>
                  </div>
                  <input id="noise-filter-range" type="range" min="0" max="100" step="5" value="${Math.round(state.noiseFilter)}" aria-label="无关文字过滤强度" />
                  <div class="reader-filter-scale"><span>全部保留</span><span>只留正文</span></div>
                  <p class="reader-filter-count">已隐藏 <strong>${state.hiddenParagraphCount}</strong> 段 · 本页显示 ${currentPageParagraphIndices().length} 段</p>
                  <button class="reader-filter-reset" type="button" data-action="reset-noise-filter">全部显示</button>
                </div>
              </div>
              <button class="reader-tool-button" type="button" data-action="font-down" aria-label="缩小字号">A−</button>
              <button class="reader-tool-button" type="button" data-action="font-up" aria-label="放大字号">A+</button>
              <button class="reader-tool-button" type="button" data-action="toggle-dict" aria-label="打开词典">
                <svg><use href="#i-search"></use></svg>
              </button>
              ${
                book.id.startsWith("import-")
                  ? `<button class="reader-tool-button" type="button" data-action="append-article" aria-label="向这篇文章添加内容" title="添加内容"><svg><use href="#i-plus"></use></svg></button>
                     <button class="reader-tool-button" type="button" data-action="edit-import-meta" aria-label="编辑文章标题和来源" title="编辑文章信息"><svg><use href="#i-sliders"></use></svg></button>`
                  : ""
              }
            </div>
          </div>
          <div id="reader-content">${pageText}</div>
        </article>

        <aside class="dictionary-panel ${state.dictionary ? "is-open" : ""}" id="dictionary-panel" aria-live="polite">
          ${dictionaryPanelMarkup()}
        </aside>
      </div>
    </section>
  `;
  updateReaderProgressUi();
}

function readerLoadingMarkup() {
  return `
    <div class="reader-loading">
      <div class="reader-loading-inner">
        <div class="loading-quill"><span></span></div>
        <h3>正在把书页铺开</h3>
        <p>全文从 Project Gutenberg 读取，首次打开后会缓存在本机。</p>
      </div>
    </div>
  `;
}

function readerErrorMarkup(message) {
  return `
    <div class="reader-error">
      <h3>这一页暂时没有打开</h3>
      <p>${escapeHtml(message)}</p>
      <div class="reader-error-actions">
        <button class="button-secondary" type="button" data-action="back-library">回到书架</button>
        <button class="button-primary" type="button" data-action="open-import">导入自己的文本</button>
      </div>
    </div>
  `;
}

function readerTextMarkup() {
  const indices = currentPageParagraphIndices();
  const highlights = getHighlights(state.currentBook.id);
  const body = indices
    .map((index) => {
      const text = state.paragraphs[index] || "";
      const heading = isChapterHeading(text);
      const classes = ["reader-paragraph"];
      if (heading) classes.push("chapter-heading");
      const paragraph = `<p class="${classes.join(" ")}" data-paragraph="${index}">${highlightedParagraphHtml(
        text,
        highlights.filter((item) => Number(item.paragraph) === index),
      )}</p>`;
      if (heading) return paragraph;
      const key = translationKey(index);
      const translation = state.translations[key];
      const expanded = state.expandedTranslations.has(key);
      const loading = state.translationLoading.has(key);
      const failed = state.translationFailed.has(key);
      return `
        <div class="translation-block" data-translation-index="${index}">
          ${paragraph}
          <div class="translation-controls">
            <button class="translation-toggle ${expanded ? "is-open" : ""}" type="button" data-action="toggle-translation" data-paragraph-index="${index}" aria-expanded="${expanded}">
              <svg><use href="#i-translate"></use></svg>
              ${expanded ? "收起译文" : "查看译文"}
            </button>
          </div>
          ${
            expanded
              ? `<div class="paragraph-translation">${
                  translation
                    ? escapeHtml(translation)
                    : loading
                      ? "正在翻译…"
                      : failed
                        ? `<button class="translation-retry" type="button" data-action="retry-translation" data-paragraph-index="${index}">翻译服务暂时没有响应，点此重试。</button>`
                        : "正在准备译文…"
                }</div>`
              : ""
          }
        </div>
      `;
    })
    .join("");
  return `
    <div class="reader-text" id="reader-text">${body}</div>
    <div class="reader-pagination">
      <span>PAGE ${state.page + 1} / ${state.totalPages}</span>
      <div class="page-buttons">
        <button class="page-button" type="button" data-action="page-prev" ${state.page === 0 ? "disabled" : ""} aria-label="上一页">
          <svg><use href="#i-chevron-left"></use></svg>
        </button>
        <span class="page-number">${state.page + 1} / ${state.totalPages}</span>
        <button class="page-button" type="button" data-action="page-next" ${state.page >= state.totalPages - 1 ? "disabled" : ""} aria-label="下一页">
          <svg><use href="#i-chevron-right"></use></svg>
        </button>
      </div>
    </div>
  `;
}

function highlightedParagraphHtml(text, highlights) {
  const valid = highlights
    .filter((item) => Number.isInteger(Number(item.start)) && Number(item.end) > Number(item.start))
    .map((item) => ({
      ...item,
      start: Math.max(0, Number(item.start)),
      end: Math.min(text.length, Number(item.end)),
    }))
    .filter((item) => item.start < item.end)
    .sort((a, b) => a.start - b.start);
  if (!valid.length) return escapeHtml(text);

  const pieces = [];
  let cursor = 0;
  for (const highlight of valid) {
    if (highlight.start < cursor) continue;
    pieces.push(escapeHtml(text.slice(cursor, highlight.start)));
    pieces.push(
      `<mark class="hl-${escapeHtml(highlight.color || "yellow")}" data-highlight-id="${escapeHtml(highlight.id)}">${escapeHtml(
        text.slice(highlight.start, highlight.end),
      )}</mark>`,
    );
    cursor = highlight.end;
  }
  pieces.push(escapeHtml(text.slice(cursor)));
  return pieces.join("");
}

function translationKey(index) {
  return `${state.currentBook?.id || "book"}::${index}`;
}

function currentPageTranslationIndices() {
  return currentPageParagraphIndices().filter((index) => !isChapterHeading(state.paragraphs[index]));
}

async function ensureTranslations(indices, options = {}) {
  if (!state.currentBook) return;
  const bookId = state.currentBook.id;
  const uniqueIndices = [...new Set(indices.filter((index) => Number.isInteger(index)))];
  const keys = uniqueIndices.map((index) => translationKey(index));
  const waitForPending = async () => {
    const started = Date.now();
    while (
      Date.now() - started < 15000 &&
      state.currentBook?.id === bookId &&
      keys.some((key) => state.translationLoading.has(key))
    ) {
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
  };
  const missing = uniqueIndices.filter((index) => {
    const key = translationKey(index);
    return !state.translations[key] && !state.translationLoading.has(key);
  });
  if (!missing.length) {
    await waitForPending();
    return;
  }
  missing.forEach((index) => state.translationLoading.add(translationKey(index)));

  const requestChunk = async (chunk) => {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ texts: chunk.map((index) => state.paragraphs[index]) }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "翻译失败。");
    if (state.currentBook?.id !== bookId) return false;
    (payload.translations || []).forEach((translation, offset) => {
      const index = chunk[offset];
      if (!Number.isInteger(index)) return;
      const key = translationKey(index);
      if (translation) {
        state.translations[key] = translation;
        state.translationFailed.delete(key);
      }
    });
    return true;
  };

  try {
    for (let start = 0; start < missing.length; start += 120) {
      const chunk = missing.slice(start, start + 120);
      if (!(await requestChunk(chunk))) return;
    }

    const stillEmpty = missing.filter((index) => !state.translations[translationKey(index)]);
    if (stillEmpty.length) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      if (state.currentBook?.id !== bookId) return;
      for (let start = 0; start < stillEmpty.length; start += 120) {
        const chunk = stillEmpty.slice(start, start + 120);
        if (!(await requestChunk(chunk))) return;
      }
    }
    missing.forEach((index) => {
      const key = translationKey(index);
      if (state.translations[key]) state.translationFailed.delete(key);
      else state.translationFailed.add(key);
    });
  } catch (error) {
    missing.forEach((index) => state.translationFailed.add(translationKey(index)));
    if (!options.silent) showToast(`译文暂时没有生成：${error.message}`, { icon: "i-x", duration: 6000 });
  } finally {
    missing.forEach((index) => state.translationLoading.delete(translationKey(index)));
  }
  await waitForPending();
}

async function prefetchCurrentPageTranslations() {
  if (!state.currentBook || state.readerLoading) return;
  const bookId = state.currentBook.id;
  const page = state.page;
  const indices = currentPageTranslationIndices();
  await ensureTranslations(indices, { silent: true });
  if (indices.some((index) => state.expandedTranslations.has(translationKey(index)))) {
    renderReaderPage();
  }
  window.setTimeout(() => {
    if (
      state.view === "reading" &&
      state.currentBook?.id === bookId &&
      state.page === page
    ) {
      prefetchNextPageTranslations();
    }
  }, 700);
}

async function prefetchNextPageTranslations() {
  if (!state.currentBook || state.page >= state.totalPages - 1) return;
  const start = (state.page + 1) * PAGE_SIZE;
  const indices = state.visibleParagraphs
    .slice(start, start + PAGE_SIZE)
    .filter((index) => !isChapterHeading(state.paragraphs[index]));
  if (indices.length) await ensureTranslations(indices, { silent: true });
}

async function prefetchAllImportedTranslations() {
  if (!state.currentBook?.id.startsWith("import-")) return;
  const indices = state.visibleParagraphs
    .filter((index) => !isChapterHeading(state.paragraphs[index]))
    .slice(0, 200);
  await ensureTranslations(indices, { silent: true });
  if (indices.some((index) => state.expandedTranslations.has(translationKey(index)))) {
    renderReaderPage();
  }
}

async function toggleParagraphTranslation(index) {
  const key = translationKey(index);
  if (state.expandedTranslations.has(key)) {
    state.expandedTranslations.delete(key);
    renderReaderPage();
    return;
  }
  state.expandedTranslations.add(key);
  renderReaderPage();
  if (!state.translations[key]) {
    await ensureTranslations([index]);
    renderReaderPage();
    if (!state.translations[key]) {
      showToast("翻译服务暂时没有响应，已自动重试一次。", { icon: "i-x", duration: 4200 });
    }
  }
}

async function togglePageTranslation() {
  const indices = currentPageTranslationIndices();
  if (!indices.length) return;
  const keys = indices.map((index) => translationKey(index));
  const allExpanded = keys.every((key) => state.expandedTranslations.has(key));
  if (allExpanded) {
    keys.forEach((key) => state.expandedTranslations.delete(key));
    renderReaderPage();
    return;
  }
  keys.forEach((key) => state.expandedTranslations.add(key));
  renderReaderPage();
  state.pageTranslationBusy = true;
  updatePageTranslationButton();
  try {
    await ensureTranslations(indices);
  } finally {
    state.pageTranslationBusy = false;
    renderReaderPage();
  }
}

function updateReaderProgressUi() {
  if (state.view !== "reading" || !state.currentBook) return;
  const progress = state.totalPages ? Math.round(((state.page + 1) / state.totalPages) * 100) : 0;
  const top = document.querySelector(".reader-progress-global span");
  const rail = document.querySelector(".reader-progress-track span");
  const label = document.querySelector(".reader-progress-labels strong");
  if (top) top.style.width = `${progress}%`;
  if (rail) rail.style.width = `${progress}%`;
  if (label) label.textContent = state.readerLoading ? "读取中" : `${progress}%`;
}

function renderReaderPage() {
  const content = document.querySelector("#reader-content");
  if (!content) return;
  content.innerHTML = readerTextMarkup();
  const pageNumber = document.querySelector(".reader-pagination .page-number");
  if (pageNumber) pageNumber.textContent = `${state.page + 1} / ${state.totalPages}`;
  updateReaderProgressUi();
  updatePageTranslationButton();
  saveProgress();
  hideSelectionToolbar();
}

function updatePageTranslationButton() {
  const button = document.querySelector("[data-action=toggle-page-translation]");
  if (!button) return;
  const indices = currentPageTranslationIndices();
  const expanded =
    indices.length > 0 &&
    indices.every((index) => state.expandedTranslations.has(translationKey(index)));
  const label = button.querySelector("span");
  const text = state.pageTranslationBusy
    ? "正在翻译…"
    : expanded
      ? "收起本页译文"
      : "显示本页译文";
  if (label) label.textContent = text;
  button.setAttribute("aria-label", text);
  button.classList.toggle("is-busy", state.pageTranslationBusy);
}

function saveProgress() {
  if (!state.currentBook || state.readerLoading) return;
  const progress = safeRead(STORAGE.progress, {});
  progress[state.currentBook.id] = {
    bookId: state.currentBook.id,
    title: state.currentBook.title,
    author: state.currentBook.author,
    page: state.page,
    paragraph: currentPageParagraphIndices()[0] ?? 0,
    layout: 2,
    totalPages: state.totalPages,
    updatedAt: Date.now(),
  };
  safeWrite(STORAGE.progress, progress);
}

function goToPage(page) {
  if (!state.visibleParagraphs.length) return;
  const next = Math.max(0, Math.min(state.totalPages - 1, page));
  if (next === state.page) return;
  state.page = next;
  state.expandedTranslations.clear();
  renderReaderPage();
  prefetchCurrentPageTranslations();
  const sheet = document.querySelector(".reader-sheet");
  if (sheet) {
    const top = sheet.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function changeReaderFont(delta) {
  const current = Number(safeRead(STORAGE.readerSize, 19.5)) || 19.5;
  const next = Math.max(16.5, Math.min(27, current + delta));
  safeWrite(STORAGE.readerSize, next);
  const sheet = document.querySelector(".reader-sheet");
  if (sheet) {
    sheet.style.setProperty("--reader-size", `${next}px`);
    sheet.style.setProperty("--reader-size-mobile", `${Math.max(16.5, next - 1.5)}px`);
  }
  showToast(`正文字号 ${next.toFixed(1)} px`, { icon: "i-sliders", duration: 1600 });
}

let noiseFilterTimer = 0;

function applyNoiseFilter(value, options = {}) {
  const anchor = currentPageParagraphIndices()[0] ?? 0;
  state.noiseFilter = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  safeWrite(STORAGE.noiseFilter, state.noiseFilter);
  rebuildParagraphView();
  let position = state.visibleParagraphs.findIndex((index) => index >= anchor);
  if (position < 0) position = Math.max(0, state.visibleParagraphs.length - 1);
  state.page = Math.max(0, Math.min(state.totalPages - 1, Math.floor(position / PAGE_SIZE)));
  state.expandedTranslations.clear();
  updateNoiseFilterUi();
  if (options.render !== false) {
    renderReaderPage();
    prefetchCurrentPageTranslations();
  }
}

function updateNoiseFilterUi() {
  const popover = document.querySelector("#reader-filter-popover");
  if (!popover) return;
  const range = popover.querySelector("#noise-filter-range");
  if (range) range.value = String(state.noiseFilter);
  const strength = popover.querySelector(".reader-filter-head strong");
  if (strength) strength.textContent = `${state.noiseFilter}%`;
  const count = popover.querySelector(".reader-filter-count");
  if (count) {
    count.innerHTML = `已隐藏 <strong>${state.hiddenParagraphCount}</strong> 段 · 本页显示 ${currentPageParagraphIndices().length} 段`;
  }
  const button = document.querySelector("[data-action=toggle-noise-filter]");
  if (button) button.classList.toggle("has-filter", state.hiddenParagraphCount > 0);
}

/* Highlights */

function getHighlights(bookId) {
  const all = safeRead(STORAGE.highlights, {});
  return Array.isArray(all[bookId]) ? all[bookId] : [];
}

function saveHighlights(bookId, highlights) {
  const all = safeRead(STORAGE.highlights, {});
  all[bookId] = highlights;
  safeWrite(STORAGE.highlights, all);
}

function remapHighlights(bookId, paragraphs) {
  const highlights = getHighlights(bookId);
  if (!highlights.length) return;
  let changed = false;
  const updated = highlights.map((item) => {
    const text = String(item.text || "");
    const index = Number(item.paragraph);
    const start = Number(item.start);
    const end = Number(item.end);
    const current = paragraphs[index] || "";
    if (Number.isInteger(index) && current.slice(start, end) === text) return item;
    if (!text) return item;
    const foundIndex = paragraphs.findIndex((paragraph, paragraphIndex) => {
      if (paragraphIndex === index) return false;
      return paragraph.includes(text);
    });
    if (foundIndex < 0) return item;
    const foundStart = paragraphs[foundIndex].indexOf(text);
    changed = true;
    return { ...item, paragraph: foundIndex, start: foundStart, end: foundStart + text.length };
  });
  if (changed) saveHighlights(bookId, updated);
}

function addHighlight(highlight) {
  if (!state.currentBook) return false;
  const all = getHighlights(state.currentBook.id);
  const overlaps = all.some(
    (item) =>
      Number(item.paragraph) === Number(highlight.paragraph) &&
      Number(highlight.start) < Number(item.end) &&
      Number(highlight.end) > Number(item.start),
  );
  if (overlaps) {
    showToast("这里已经有标记了。", { icon: "i-highlight" });
    return false;
  }
  all.push(highlight);
  saveHighlights(state.currentBook.id, all);
  renderReaderPage();
  return true;
}

function removeHighlightById(bookId, highlightId) {
  const all = getHighlights(bookId).filter((item) => item.id !== highlightId);
  saveHighlights(bookId, all);
  if (state.currentBook?.id === bookId) renderReaderPage();
}

function handleSelectionChange() {
  window.clearTimeout(selectionTimer);
  selectionTimer = window.setTimeout(inspectSelection, 100);
}

function inspectSelection() {
  if (state.view !== "reading" || state.readerLoading) {
    hideSelectionToolbar();
    return;
  }
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) {
    hideSelectionToolbar();
    return;
  }
  const range = selection.getRangeAt(0);
  const startParagraph = closestParagraph(range.startContainer);
  const endParagraph = closestParagraph(range.endContainer);
  if (!startParagraph || !endParagraph || startParagraph !== endParagraph) {
    hideSelectionToolbar();
    if (!selection.isCollapsed && selection.toString().trim().length > 3) {
      els.selectionHint.textContent = "请在同一段内选中一个词";
    }
    return;
  }

  const text = selection.toString().replace(/\s+/g, " ").trim();
  const query = normalizeWord(text);
  if (!query || text.length > 90 || query.split(/\s+/).length > 8) {
    hideSelectionToolbar();
    return;
  }

  const paragraphIndex = Number(startParagraph.dataset.paragraph);
  const fullText = state.paragraphs[paragraphIndex] || startParagraph.textContent || "";
  const start = offsetWithin(startParagraph, range.startContainer, range.startOffset);
  const end = offsetWithin(startParagraph, range.endContainer, range.endOffset);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    hideSelectionToolbar();
    return;
  }

  const rect = range.getBoundingClientRect();
  state.selection = {
    paragraph: paragraphIndex,
    start,
    end,
    rawText: text,
    query,
    text: fullText.slice(start, end),
  };
  state.selection.text = state.selection.text || text;
  positionSelectionToolbar(rect);
}

function closestParagraph(node) {
  const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
  return element?.closest?.(".reader-paragraph") || null;
}

function offsetWithin(paragraph, node, offset) {
  try {
    const range = document.createRange();
    range.setStart(paragraph, 0);
    range.setEnd(node, offset);
    return range.toString().length;
  } catch {
    return null;
  }
}

function positionSelectionToolbar(rect) {
  els.toolbar.hidden = false;
  const width = els.toolbar.offsetWidth || 310;
  const estimatedHeight = 66;
  const left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.left + rect.width / 2 - width / 2));
  let top = rect.top - estimatedHeight - 10;
  if (top < 76) top = rect.bottom + 12;
  els.toolbar.style.left = `${left}px`;
  els.toolbar.style.top = `${top}px`;
  els.selectionHint.textContent = `查词或标记「${truncate(state.selection?.query || "", 22)}」`;
}

function hideSelectionToolbar() {
  els.toolbar.hidden = true;
  state.selection = null;
}

function setHighlightColor(color) {
  state.selectedColor = color;
  safeWrite(STORAGE.selectedColor, color);
  document.querySelectorAll("[data-highlight-color]").forEach((dot) => {
    const active = dot.dataset.highlightColor === color;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-checked", String(active));
  });
}

async function confirmHighlight() {
  if (!state.selection || !state.currentBook) return;
  const current = state.selection;
  const selection = window.getSelection();
  if (selection) selection.removeAllRanges();
  const highlight = {
    id: `hl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    paragraph: current.paragraph,
    start: current.start,
    end: current.end,
    text: current.text,
    color: state.selectedColor || "yellow",
    createdAt: Date.now(),
  };
  const added = addHighlight(highlight);
  hideSelectionToolbar();
  if (!added) return;

  showToast(`已标记「${current.query}」`, {
    icon: "i-highlight",
    actionLabel: "撤销",
    onAction: () => removeHighlightById(state.currentBook.id, highlight.id),
  });

  openDictionary(current.query, {
    bookId: state.currentBook.id,
    bookTitle: state.currentBook.title,
    paragraph: current.paragraph,
    highlightId: highlight.id,
    origin: "highlight",
  });
}

function readSelectionAction() {
  const current = state.selection;
  if (!current) return null;
  const selection = window.getSelection();
  if (selection) selection.removeAllRanges();
  hideSelectionToolbar();
  return current;
}

function dictionaryAudioUrl(word, type = 2) {
  return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`;
}

function lookupSelection() {
  const current = readSelectionAction();
  if (!current || !state.currentBook) return;
  openDictionary(current.query, {
    bookId: state.currentBook.id,
    bookTitle: state.currentBook.title,
    paragraph: current.paragraph,
    origin: "lookup",
  });
}

function pronounceSelection() {
  const current = readSelectionAction();
  if (!current || !state.currentBook) return;
  playAudio(dictionaryAudioUrl(current.query, 2), current.query);
  openDictionary(current.query, {
    bookId: state.currentBook.id,
    bookTitle: state.currentBook.title,
    paragraph: current.paragraph,
    origin: "lookup",
  });
}

/* Dictionary */

function getRecentWords() {
  const words = safeRead(STORAGE.recentWords, []);
  return Array.isArray(words) ? words.slice(0, 8) : [];
}

function addRecentWord(word) {
  const normalized = word.toLowerCase();
  const words = getRecentWords().filter((item) => item.toLowerCase() !== normalized);
  words.unshift(word);
  safeWrite(STORAGE.recentWords, words.slice(0, 20));
}

function dictionaryPanelMarkup() {
  if (!state.dictionary) return dictionaryHomeMarkup();
  if (state.dictionary.status === "loading") return dictionaryLoadingMarkup();
  if (state.dictionary.status === "error") return dictionaryErrorMarkup();
  return dictionaryEntryMarkup(state.dictionary.data);
}

function dictionaryHomeMarkup() {
  const recent = getRecentWords();
  return `
    <div class="dict-home">
      <div class="dict-home-mark"><svg><use href="#i-highlight"></use></svg></div>
      <h3>选一个词，<br />看清它的来路。</h3>
      <p>在正文中选中英文单词或短语，点「查词」只看释义和发音；点「标记」会同时把颜色留在原文。</p>
      <form class="dict-search-form" id="dict-search-form">
        <svg><use href="#i-search"></use></svg>
        <input name="word" type="search" placeholder="也可以直接查词" autocomplete="off" aria-label="直接查词" />
      </form>
      ${
        recent.length
          ? `
            <div class="dict-recent">
              <div class="dict-recent-label">最近查过</div>
              <div class="recent-word-list">
                ${recent.map((word) => `<button class="recent-word" type="button" data-recent-word="${escapeHtml(word)}">${escapeHtml(word)}</button>`).join("")}
              </div>
            </div>
          `
          : ""
      }
      <div class="dict-hint">
        <strong>快捷操作</strong>
        选中一个词后可点「查词」或「标记」；喇叭按钮会直接播放发音。手机端释义从底部展开。
      </div>
    </div>
  `;
}

function dictionaryLoadingMarkup() {
  return `
    <div class="dict-loading" aria-label="正在查询词典">
      <div class="dict-loading-head"></div>
      <div class="dict-loading-line"></div>
      <div class="dict-loading-line"></div>
      <div class="dict-loading-block"></div>
      <div class="dict-loading-line"></div>
      <div class="dict-loading-line"></div>
      <p class="dict-loading-note">正在查询「${escapeHtml(state.dictionary?.query || "")}」…</p>
      ${dictionaryHighlightCancelMarkup()}
    </div>
  `;
}

function dictionaryErrorMarkup() {
  return `
    <div class="dict-error">
      <h3>词典没有回应</h3>
      <p>${escapeHtml(state.dictionary?.error || "请检查网络后再试。")}</p>
      <div class="reader-error-actions">
        <button class="button-primary" type="button" data-action="retry-dict">重新查询</button>
        <button class="button-secondary" type="button" data-action="close-dict">先继续阅读</button>
      </div>
      ${dictionaryHighlightCancelMarkup()}
    </div>
  `;
}

function dictionaryHighlightCancelMarkup() {
  if (!state.dictionary?.meta?.highlightId) return "";
  return `
    <button class="dict-cancel-highlight" type="button" data-action="remove-current-highlight">
      <svg><use href="#i-trash"></use></svg>
      取消这个原文标记
    </button>
  `;
}

function dictionaryEntryMarkup(data) {
  if (!data) return dictionaryErrorMarkup();
  const saved = isWordSaved(data.word);
  const uk = data.phonetic?.uk || "";
  const us = data.phonetic?.us || "";
  const tab = state.dictionaryTab;
  const meanings = data.meanings || [];
  const examples = data.examples || [];
  const phrases = data.phrases || [];
  const etymology = data.etymology || [];
  const image = (data.images || [])[0];
  const linkedHighlight = state.dictionary?.meta?.highlightId;
  return `
    <div class="dictionary-entry">
      <div class="dict-head">
        <div class="dict-head-top">
          <h2 class="dict-word">${escapeHtml(data.word || state.dictionary.query)}</h2>
          <div class="dict-head-actions">
            ${
              linkedHighlight
                ? `<button class="dict-icon-btn" type="button" data-action="remove-current-highlight" aria-label="取消这个标记" title="取消这个标记"><svg><use href="#i-trash"></use></svg></button>`
                : ""
            }
            <button class="dict-icon-btn dict-mobile-close" type="button" data-action="close-dict" aria-label="关闭词典">
              <svg><use href="#i-x"></use></svg>
            </button>
            <a class="dict-icon-btn" href="${escapeHtml(data.source?.url || "#")}" target="_blank" rel="noreferrer" aria-label="在有道词典打开">
              <svg><use href="#i-external"></use></svg>
            </a>
          </div>
        </div>
        ${
          uk || us
            ? `
              <div class="dict-phonetics">
                ${uk ? `<span class="phonetic"><strong>UK</strong>/${escapeHtml(uk)}/<button class="pronounce-button" type="button" data-audio="${escapeHtml(data.audio?.uk || "")}" data-audio-text="${escapeHtml(data.word)}" aria-label="播放英式发音"><svg><use href="#i-volume"></use></svg></button></span>` : ""}
                ${us ? `<span class="phonetic"><strong>US</strong>/${escapeHtml(us)}/<button class="pronounce-button" type="button" data-audio="${escapeHtml(data.audio?.us || "")}" data-audio-text="${escapeHtml(data.word)}" aria-label="播放美式发音"><svg><use href="#i-volume"></use></svg></button></span>` : ""}
              </div>
            `
            : data.audio?.us
              ? `<div class="dict-phonetics dict-phonetics-audio"><button class="pronounce-button dict-pronounce-wide" type="button" data-audio="${escapeHtml(data.audio.us)}" data-audio-text="${escapeHtml(data.word)}" aria-label="播放发音"><svg><use href="#i-volume"></use></svg>播放发音</button></div>`
              : ""
        }
      </div>
      ${dictionarySaveMarkup(data, saved, linkedHighlight)}
      <div class="dict-tabs" role="tablist" aria-label="词典内容">
        ${dictionaryTab("simple", "简明", tab)}
        ${dictionaryTab("examples", `例句${examples.length ? ` ${examples.length}` : ""}`, tab)}
        ${dictionaryTab("phrases", "短语", tab)}
        ${dictionaryTab("origin", "词源", tab)}
      </div>
      <div class="dict-body" role="tabpanel">
        ${
          tab === "simple"
            ? `
              ${
                data.fallbackTranslation
                  ? `<p class="dict-fallback-note">词典暂时没有返回这个词条，先显示整词翻译。标记仍然可以取消。</p>`
                  : ""
              }
              ${
                data.preview
                  ? `<p class="dict-preview">${escapeHtml(data.preview)}</p>`
                  : ""
              }
              ${image ? `<img class="dict-image" src="${escapeHtml(image)}" alt="${escapeHtml(data.word)} 相关图片" referrerpolicy="no-referrer" />` : ""}
              <div class="dict-section">
                <div class="dict-label">释义</div>
                <ul class="meaning-list">
                  ${meanings.length ? meanings.map((item) => `<li class="meaning"><span class="meaning-pos">${escapeHtml(item.pos || "—")}</span><span>${escapeHtml(item.text)}</span></li>`).join("") : `<li class="meaning"><span class="meaning-pos">—</span><span>暂无可用的简明释义。</span></li>`}
                </ul>
                ${(data.examTags || []).length ? `<div class="exam-tags">${data.examTags.map((tag) => `<span class="exam-tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
                ${(data.forms || []).length ? `<div class="word-forms">${data.forms.map((form) => `${escapeHtml(form.name)} <span>${escapeHtml(form.value)}</span>`).join(" ")}</div>` : ""}
              </div>
              ${
                (data.englishDefinitions || []).length
                  ? `
                    <div class="dict-section">
                      <div class="dict-label">English definition</div>
                      <div class="example-list">
                        ${data.englishDefinitions.map((item) => `<p class="example-en"><span class="meaning-pos">${escapeHtml(item.pos || "")}</span> ${escapeHtml(item.text)}</p>`).join("")}
                      </div>
                    </div>
                  `
                  : ""
              }
            `
            : ""
        }
        ${
          tab === "examples"
            ? `
              <div class="dict-section">
                <div class="dict-label">Example sentences</div>
                ${
                  examples.length
                    ? `<div class="example-list">${examples.map((item) => `<figure class="example"><p class="example-en">${escapeHtml(item.en)}</p>${item.zh ? `<figcaption class="example-zh">${escapeHtml(item.zh)}</figcaption>` : ""}</figure>`).join("")}</div>`
                    : `<p class="example-zh">这个词暂时没有可用例句。</p>`
                }
              </div>
            `
            : ""
        }
        ${
          tab === "phrases"
            ? `
              <div class="dict-section">
                <div class="dict-label">词组短语</div>
                ${
                  phrases.length
                    ? `<ul class="phrase-list">${phrases.map((item) => `<li class="phrase-row"><strong>${escapeHtml(item.text)}</strong><span>${escapeHtml(item.meaning || "")}</span></li>`).join("")}</ul>`
                    : `<p class="example-zh">暂无相关短语。</p>`
                }
              </div>
              ${
                (data.synonyms || []).length
                  ? `
                    <div class="dict-section">
                      <div class="dict-label">近义词</div>
                      <ul class="synonym-list">
                        ${data.synonyms.map((item) => `<li class="synonym-row"><strong>${escapeHtml(item.words.join(", "))}</strong><span>${escapeHtml(item.meaning || item.pos || "")}</span></li>`).join("")}
                      </ul>
                    </div>
                  `
                  : ""
              }
            `
            : ""
        }
        ${
          tab === "origin"
            ? `
              <div class="dict-section">
                <div class="dict-label">词源与构词</div>
                ${
                  etymology.length
                    ? `<div class="etymology-list">${etymology.map((item) => `<p class="etymology-item"><strong>${escapeHtml(item.lang === "zh" ? "中文" : "EN")}</strong>${escapeHtml(item.text)}</p>`).join("")}</div>`
                    : `<p class="example-zh">这个词暂时没有返回词源信息。</p>`
                }
              </div>
            `
            : ""
        }
        ${
          linkedHighlight
            ? `<button class="dict-remove-highlight" type="button" data-action="remove-current-highlight"><svg><use href="#i-trash"></use></svg>取消这个原文标记</button>`
            : ""
        }
        <div class="dict-source">
          <span>${data.fallbackTranslation ? "词典未收录 · 以下为整词翻译" : data.fallback ? "本地简释 · 网络恢复后会重新查询" : "释义与发音来自有道词典"}</span>
          ${
            data.source?.url
              ? `<a href="${escapeHtml(data.source.url)}" target="_blank" rel="noreferrer">查看原页 <svg><use href="#i-external"></use></svg></a>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

function dictionarySaveMarkup(data, saved, linkedHighlight) {
  return `
    <div class="dict-save-row">
      <button class="dict-save-word ${saved ? "is-saved" : ""}" type="button" data-action="save-word">
        <svg><use href="#${saved ? "i-check" : "i-bookmark"}"></use></svg>
        <span>${saved ? "已在生词本 · 点击移出" : "加入生词本"}</span>
      </button>
      ${
        linkedHighlight && !saved
          ? `<span class="dict-save-note">这个标记只保留颜色，手动加入后才会进入生词本和背单词。</span>`
          : ""
      }
    </div>
  `;
}

function dictionaryTab(id, label, active) {
  return `<button class="dict-tab ${active === id ? "is-active" : ""}" type="button" role="tab" aria-selected="${active === id}" data-dict-tab="${id}">${escapeHtml(label)}</button>`;
}

async function translateDictionaryFallback(query) {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ texts: [query] }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return "";
    return String((payload.translations || [])[0] || "").trim();
  } catch {
    return "";
  }
}

async function openDictionary(query, meta = {}) {
  const cleaned = normalizeWord(query);
  if (!cleaned) return;
  state.dictionaryTab = "simple";
  const request = {
    query: cleaned,
    status: "loading",
    data: null,
    meta,
    error: "",
  };
  state.dictionary = request;
  renderDictionaryPanel();
  const panel = document.querySelector("#dictionary-panel");
  if (panel) panel.classList.add("is-open");
  try {
    const response = await fetch(`/api/dictionary?word=${encodeURIComponent(cleaned)}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "词典服务暂时不可用。");
    if (state.dictionary !== request) return;
    request.status = "loaded";
    request.data = data;
    addRecentWord(data.word || cleaned);
    renderDictionaryPanel();
  } catch (error) {
    if (state.dictionary !== request) return;
    const translated = await translateDictionaryFallback(cleaned);
    if (state.dictionary !== request) return;
    if (translated) {
      request.status = "loaded";
      request.data = {
        query: cleaned,
        word: cleaned,
        phonetic: { uk: "", us: "" },
        audio: {
          uk: dictionaryAudioUrl(cleaned, 1),
          us: dictionaryAudioUrl(cleaned, 2),
        },
        meanings: [{ pos: "翻译", text: translated }],
        examples: [],
        phrases: [],
        etymology: [],
        englishDefinitions: [],
        source: { name: "整词翻译备用", url: "https://translate.google.com/" },
        fallbackTranslation: true,
      };
      addRecentWord(cleaned);
      renderDictionaryPanel();
      return;
    }
    request.status = "error";
    request.error = error.message || "词典服务暂时不可用。";
    renderDictionaryPanel();
  }
}

function renderDictionaryPanel() {
  const panel = document.querySelector("#dictionary-panel");
  if (!panel) return;
  panel.classList.toggle("is-open", Boolean(state.dictionary));
  panel.innerHTML = dictionaryPanelMarkup();
}

function switchDictionaryTab(tab) {
  state.dictionaryTab = tab;
  renderDictionaryPanel();
}

let activePronunciationAudio = null;

function audioTextFromUrl(url) {
  try {
    return new URL(url, location.href).searchParams.get("audio") || "";
  } catch {
    return "";
  }
}

function tryPlayAudioSource(url) {
  return new Promise((resolve) => {
    const audio = new Audio();
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (!ok) {
        audio.pause();
        audio.removeAttribute("src");
      }
      resolve(ok);
    };
    const timeout = window.setTimeout(() => finish(false), 3600);
    audio.preload = "auto";
    audio.addEventListener("playing", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });
    audio.src = url;
    audio
      .play()
      .then(() => {
        window.setTimeout(() => {
          if (!settled && !audio.paused && audio.currentTime > 0) finish(true);
        }, 420);
      })
      .catch(() => finish(false));
  });
}

function speakWithBrowser(text) {
  return new Promise((resolve) => {
    if (!text || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      resolve(false);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(
      String(text)
        .replace(/[_*#]+/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    );
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    utterance.pitch = 1;
    const voices = synth.getVoices();
    const preferred =
      voices.find((voice) => /en[-_]US/i.test(voice.lang)) ||
      voices.find((voice) => /en[-_]GB/i.test(voice.lang)) ||
      voices.find((voice) => /^en/i.test(voice.lang));
    if (preferred) utterance.voice = preferred;
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(ok);
    };
    const timeout = window.setTimeout(() => finish(true), Math.max(4500, String(text).length * 140));
    utterance.onend = () => finish(true);
    utterance.onerror = () => finish(false);
    synth.speak(utterance);
  });
}

async function playAudio(url, text = "") {
  const spokenText = (
    text ||
    audioTextFromUrl(url) ||
    state.dictionary?.data?.word ||
    state.wordSession?.questions?.[state.wordSession.index]?.word ||
    ""
  ).trim();
  if (!spokenText) {
    showToast("这个词暂时没有可用发音。", { icon: "i-volume" });
    return false;
  }
  if (activePronunciationAudio) {
    activePronunciationAudio.pause();
    activePronunciationAudio.removeAttribute("src");
    activePronunciationAudio = null;
  }
  window.speechSynthesis?.cancel();

  // Numbers and longer phrases are often missing from the dictionary audio
  // service. Use the device voice first so "19th century" is never silent.
  if (/[0-9]/.test(spokenText) || spokenText.split(/\s+/).length > 2) {
    if (await speakWithBrowser(spokenText)) return true;
  }

  const sources = [
    url,
    dictionaryAudioUrl(spokenText, 1),
    dictionaryAudioUrl(spokenText, 2),
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(spokenText)}`,
  ].filter(Boolean);

  for (const source of [...new Set(sources)]) {
    if (await tryPlayAudioSource(source)) {
      activePronunciationAudio = null;
      return true;
    }
  }

  if (await speakWithBrowser(spokenText)) return true;
  showToast("发音暂时没有播放出来，请检查设备音量后再试。", { icon: "i-volume", duration: 6000 });
  return false;
}

/* Wordbook */

function getWordbook() {
  const words = safeRead(STORAGE.wordbook, []);
  return Array.isArray(words) ? words : [];
}

function saveWordEntry(data, meta = {}) {
  const word = (data.word || state.dictionary?.query || "").trim();
  if (!word) return;
  const entries = getWordbook();
  const key = word.toLowerCase();
  const existing = entries.find((item) => item.word.toLowerCase() === key);
  const entry = {
    id: existing?.id || `word-${slug(word)}-${Date.now().toString(36)}`,
    word,
    phonetic: data.phonetic?.us || data.phonetic?.uk || "",
    meaning:
      (data.meanings || [])
        .slice(0, 2)
        .map((item) => `${item.pos ? item.pos + " " : ""}${item.text}`)
        .join("；") || data.preview || "",
    sourceBookId: meta.bookId || existing?.sourceBookId || "",
    sourceTitle: meta.bookTitle || existing?.sourceTitle || "",
    page: Number.isFinite(meta.page) ? meta.page : state.page,
    paragraph: Number.isFinite(meta.paragraph) ? meta.paragraph : null,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
    reviewCount: existing?.reviewCount || 0,
    correctCount: existing?.correctCount || 0,
    wrongCount: existing?.wrongCount || 0,
    intervalDays: existing?.intervalDays || 0,
    ease: existing?.ease || 2.5,
    nextReviewAt: existing?.nextReviewAt || 0,
    lastReviewedAt: existing?.lastReviewedAt || 0,
  };
  const next = existing ? entries.filter((item) => item.id !== existing.id) : entries;
  next.unshift(entry);
  safeWrite(STORAGE.wordbook, next.slice(0, 2000));
  return entry;
}

function isWordSaved(word) {
  return getWordbook().some((item) => item.word.toLowerCase() === String(word || "").toLowerCase());
}

function saveCurrentWord() {
  if (!state.dictionary?.data) return;
  if (isWordSaved(state.dictionary.data.word)) {
    const word = state.dictionary.data.word;
    const next = getWordbook().filter((item) => item.word.toLowerCase() !== word.toLowerCase());
    safeWrite(STORAGE.wordbook, next);
    renderDictionaryPanel();
    showToast(`已从生词本移出「${word}」`, { icon: "i-notebook" });
    return;
  }
  saveWordEntry(state.dictionary.data, state.dictionary.meta || {});
  renderDictionaryPanel();
  showToast(`已加入生词本「${state.dictionary.data.word}」`, { icon: "i-bookmark" });
}

function renderWordbook() {
  const words = getWordbook();
  if (state.wordSession) {
    els.main.innerHTML = wordSessionMarkup();
    els.searchInput.value = "";
    return;
  }
  const query = state.wordbookQuery.trim().toLowerCase();
  const visible = words.filter((item) => !query || item.word.toLowerCase().includes(query) || item.meaning.toLowerCase().includes(query));
  const highlightRecords = allHighlightRecords();
  const now = Date.now();
  const freshCount = words.filter((item) => !item.reviewCount).length;
  const dueCount = words.filter((item) => item.reviewCount && (item.nextReviewAt || 0) <= now).length;
  els.main.innerHTML = `
    <section class="wordbook-view">
      <div class="wordbook-head">
        <div>
          <h1 class="wordbook-title">生词，<br />背了才算数。</h1>
          <p class="wordbook-sub">标记只保留颜色；在右侧词典点「加入生词本」，单词才会带着出处留在这里。</p>
        </div>
        <div class="wordbook-count"><strong>${words.length}</strong> words</div>
      </div>
      ${wordbookTrainerMarkup(words, freshCount, dueCount)}
      <div class="wordbook-toolbar">
        <label class="wordbook-search">
          <svg><use href="#i-search"></use></svg>
          <input id="wordbook-search-input" type="search" value="${escapeHtml(state.wordbookQuery)}" placeholder="搜索生词或释义" aria-label="搜索生词" />
        </label>
        <div class="wordbook-toolbar-right">
          <span class="wordbook-sort">按加入时间排序</span>
          <button class="button-quiet" type="button" data-action="export-data">
            <svg><use href="#i-upload"></use></svg>
            导出备份
          </button>
        </div>
      </div>
      <div class="word-list">
        ${visible.length ? visible.map(wordRowMarkup).join("") : wordbookEmptyMarkup(words.length > 0)}
      </div>
      <section class="highlight-records">
        <div class="records-heading">
          <div>
            <h2>原文标记</h2>
            <p>颜色留在书页里，也在这里留一条可回到上下文的记录。</p>
          </div>
          <span>${highlightRecords.length} highlights</span>
        </div>
        ${
          highlightRecords.length
            ? `<div class="highlight-record-list">${highlightRecords.map(highlightRowMarkup).join("")}</div>`
            : `<div class="highlight-record-empty">还没有原文标记。打开一本书，选中一个词并点「标记」。</div>`
        }
      </section>
    </section>
  `;
}

function wordbookTrainerMarkup(words, freshCount, dueCount) {
  const { count, mode } = state.wordSessionConfig;
  const counts = [10, 20, 30, 50];
  const modes = [
    ["mixed", "混合", "先复习到期词，再学新词"],
    ["new", "新词", "只学还没背过的词"],
    ["review", "复习", "只背到期和易错的词"],
  ];
  const ready = words.length > 0;
  return `
    <section class="wordbook-trainer">
      <div class="trainer-copy">
        <span class="trainer-kicker">BAICIZHAN MODE · 选择题记忆</span>
        <h2>今天，背几个？</h2>
        <p>看英文、听发音、选中文释义。答错的词会自动进入下一轮复习，不用另外整理。</p>
        <div class="trainer-stats">
          <span><strong>${freshCount}</strong> 个新词</span>
          <span><strong>${dueCount}</strong> 个待复习</span>
          <span><strong>${words.length}</strong> 个总词数</span>
        </div>
      </div>
      <div class="trainer-config">
        <div class="trainer-row">
          <span class="trainer-label">每次数量</span>
          <div class="trainer-chips">
            ${counts
              .map(
                (value) =>
                  `<button class="trainer-chip ${count === value ? "is-active" : ""}" type="button" data-word-count="${value}">${value}</button>`,
              )
              .join("")}
          </div>
        </div>
        <div class="trainer-row">
          <span class="trainer-label">背诵模式</span>
          <div class="trainer-chips trainer-modes">
            ${modes
              .map(
                ([value, label, hint]) =>
                  `<button class="trainer-chip ${mode === value ? "is-active" : ""}" type="button" data-word-mode="${value}" title="${hint}">${label}</button>`,
              )
              .join("")}
          </div>
        </div>
        <button class="trainer-start" type="button" data-action="start-word-session" ${ready ? "" : "disabled"}>
          <svg><use href="#i-highlight"></use></svg>
          ${ready ? "开启，开始背单词" : "先加入几个生词"}
        </button>
        <p class="trainer-footnote">${ready ? "答对会拉长复习间隔；答错会在 10 分钟后重新出现。" : "在阅读页选中单词，点右侧「加入生词本」后再来。"}</p>
      </div>
    </section>
  `;
}

function wordSessionMarkup() {
  const session = state.wordSession;
  if (!session) return "";
  if (session.finished) return wordSessionSummaryMarkup(session);
  const question = session.questions[session.index];
  if (!question) return wordSessionSummaryMarkup(session);
  const progress = Math.round(((session.index + (question.answered ? 1 : 0)) / session.questions.length) * 100);
  const chosen = question.chosen;
  return `
    <section class="word-session-view">
      <div class="word-session-top">
        <button class="word-session-exit" type="button" data-action="end-word-session">
          <svg><use href="#i-x"></use></svg>
          退出
        </button>
        <div class="word-session-progress"><span style="width:${progress}%"></span></div>
        <span class="word-session-index">${session.index + 1} / ${session.questions.length}</span>
      </div>
      <div class="word-session-stage">
        <span class="word-session-mode">${escapeHtml(session.modeLabel)}</span>
        <h1 class="word-session-word">${escapeHtml(question.word)}</h1>
        <div class="word-session-phonetic">
          ${question.phonetic ? `<span>/${escapeHtml(question.phonetic)}/</span>` : ""}
          <button type="button" data-audio="${escapeHtml(dictionaryAudioUrl(question.word, 2))}" data-audio-text="${escapeHtml(question.word)}" aria-label="播放发音">
            <svg><use href="#i-volume"></use></svg>
          </button>
        </div>
        <p class="word-session-prompt">${question.binary ? "这个词你认识吗？" : "选出正确的中文释义"}</p>
        <div class="word-options">
          ${question.options
            .map((option, index) => {
              const stateClass = question.answered
                ? option.correct
                  ? "is-correct"
                  : index === chosen
                    ? "is-wrong"
                    : "is-muted"
                : "";
              return `<button class="word-option ${stateClass}" type="button" data-action="answer-word" data-option-index="${index}" ${question.answered ? "disabled" : ""}>
                <span>${String.fromCharCode(65 + index)}</span>
                ${escapeHtml(option.text)}
              </button>`;
            })
            .join("")}
        </div>
        ${
          question.answered
            ? `
              <div class="word-feedback ${question.correct ? "is-correct" : "is-wrong"}">
                <strong>${question.correct ? "记住了" : "再记一次"}</strong>
                <p>${escapeHtml(question.meaning || "")}</p>
                ${question.sourceTitle ? `<span>来自《${escapeHtml(question.sourceTitle)}》</span>` : ""}
              </div>
              <button class="word-next" type="button" data-action="next-word">
                ${session.index + 1 >= session.questions.length ? "看本轮结果" : "下一个"}
                <svg><use href="#i-arrow"></use></svg>
              </button>
            `
            : `
              <button class="word-reveal" type="button" data-action="reveal-word">不认识，直接看答案</button>
            `
        }
      </div>
      <p class="word-session-tip">空格键也可以选择「不认识」 · 答题后会显示出处</p>
    </section>
  `;
}

function wordSessionSummaryMarkup(session) {
  const total = session.questions.length;
  const correct = session.questions.filter((item) => item.correct).length;
  const wrong = session.questions.filter((item) => item.correct === false);
  const rate = total ? Math.round((correct / total) * 100) : 0;
  return `
    <section class="word-session-view word-session-summary">
      <div class="session-summary-mark"><svg><use href="#i-check"></use></svg></div>
      <span class="word-session-mode">本轮结束</span>
      <h1>这一轮，<br />收下 <em>${correct}</em> 个词。</h1>
      <p class="session-summary-rate">正确率 ${rate}% · 共 ${total} 个词 · 错词 ${wrong.length} 个</p>
      ${
        wrong.length
          ? `<div class="session-wrong-list">${wrong
              .map(
                (item) => `<div><strong>${escapeHtml(item.word)}</strong><span>${escapeHtml(item.meaning || "")}</span></div>`,
              )
              .join("")}</div>`
          : `<p class="session-perfect">这一轮没有错词。可以加大数量，或者去读一段新的文章。</p>`
      }
      <div class="session-summary-actions">
        ${
          wrong.length
            ? `<button class="button-primary" type="button" data-action="review-wrong">复习 ${wrong.length} 个错词</button>`
            : ""
        }
        <button class="button-secondary" type="button" data-action="restart-word-session">再来一轮</button>
        <button class="button-quiet" type="button" data-action="end-word-session">回到生词本</button>
      </div>
    </section>
  `;
}

function shuffled(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function buildWordQuestion(entry, allWords) {
  const candidates = allWords.filter(
    (item) => item.id !== entry.id && item.meaning && item.meaning !== entry.meaning,
  );
  const binary = candidates.length < 3;
  const options = binary
    ? [
        { text: "我认识这个词", correct: true },
        { text: "还不认识，需要复习", correct: false },
      ]
    : shuffled([
        { text: entry.meaning || "暂无释义", correct: true },
        ...shuffled(candidates)
          .slice(0, 3)
          .map((item) => ({ text: item.meaning, correct: false })),
      ]);
  return {
    wordId: entry.id,
    word: entry.word,
    phonetic: entry.phonetic || "",
    meaning: entry.meaning || "",
    sourceTitle: entry.sourceTitle || "",
    options,
    binary,
    chosen: null,
    answered: false,
    correct: null,
  };
}

function startWordSession(mode = state.wordSessionConfig.mode, count = state.wordSessionConfig.count, ids = null) {
  const allWords = getWordbook();
  if (!allWords.length) {
    showToast("生词本还是空的，先在阅读页手动加入几个词。", { icon: "i-notebook" });
    return;
  }
  const now = Date.now();
  let pool;
  if (Array.isArray(ids) && ids.length) {
    const selected = new Set(ids);
    pool = allWords.filter((item) => selected.has(item.id));
    mode = "wrong";
  } else if (mode === "review") {
    pool = allWords.filter((item) => item.reviewCount && (item.nextReviewAt || 0) <= now);
    if (!pool.length) {
      pool = allWords.filter((item) => (item.wrongCount || 0) > (item.correctCount || 0) || item.intervalDays === 0);
    }
    if (!pool.length) pool = allWords.filter((item) => item.reviewCount);
  } else if (mode === "new") {
    pool = allWords.filter((item) => !item.reviewCount);
  } else {
    const due = allWords.filter((item) => item.reviewCount && (item.nextReviewAt || 0) <= now);
    const fresh = allWords.filter((item) => !item.reviewCount);
    pool = [...due, ...fresh, ...allWords];
  }
  const unique = [...new Map(pool.map((item) => [item.id, item])).values()];
  if (!unique.length) {
    showToast(mode === "new" ? "没有新词了，可以切换到复习模式。" : "现在没有到期的复习词，先学几个新词吧。", {
      icon: "i-notebook",
    });
    return;
  }
  const questions = shuffled(unique)
    .slice(0, Math.max(1, Math.min(Number(count) || 20, unique.length)))
    .map((item) => buildWordQuestion(item, allWords));
  const labels = {
    new: "新词",
    review: "复习",
    mixed: "混合模式",
    wrong: "错词复习",
  };
  state.wordSession = {
    questions,
    index: 0,
    correctCount: 0,
    wrongIds: [],
    finished: false,
    mode,
    modeLabel: labels[mode] || "背单词",
    startedAt: Date.now(),
  };
  renderWordbook();
}

function updateWordReview(wordId, correct) {
  const words = getWordbook();
  const target = words.find((item) => item.id === wordId);
  if (!target) return;
  const now = Date.now();
  target.reviewCount = (target.reviewCount || 0) + 1;
  target.lastReviewedAt = now;
  if (correct) {
    target.correctCount = (target.correctCount || 0) + 1;
    target.intervalDays = target.intervalDays ? Math.min(60, target.intervalDays * 2) : 1;
    target.ease = Math.min(3.2, (target.ease || 2.5) + 0.04);
    target.nextReviewAt = now + target.intervalDays * 86400000;
  } else {
    target.wrongCount = (target.wrongCount || 0) + 1;
    target.intervalDays = 0;
    target.ease = Math.max(1.5, (target.ease || 2.5) - 0.12);
    target.nextReviewAt = now + 10 * 60000;
  }
  target.updatedAt = now;
  safeWrite(STORAGE.wordbook, words);
}

function answerWordQuestion(optionIndex) {
  const session = state.wordSession;
  if (!session || session.finished) return;
  const question = session.questions[session.index];
  if (!question || question.answered) return;
  const chosen = question.options[optionIndex];
  if (!chosen) return;
  question.chosen = optionIndex;
  question.answered = true;
  question.correct = Boolean(chosen.correct);
  updateWordReview(question.wordId, question.correct);
  renderWordbook();
}

function revealWordAnswer() {
  const session = state.wordSession;
  if (!session || session.finished) return;
  const question = session.questions[session.index];
  if (!question || question.answered) return;
  question.answered = true;
  question.correct = false;
  question.chosen = -1;
  updateWordReview(question.wordId, false);
  renderWordbook();
}

function nextWordQuestion() {
  const session = state.wordSession;
  if (!session) return;
  if (session.index + 1 >= session.questions.length) {
    session.finished = true;
  } else {
    session.index += 1;
  }
  renderWordbook();
}

function endWordSession() {
  state.wordSession = null;
  renderWordbook();
}

function reviewWrongWords() {
  const session = state.wordSession;
  if (!session) return;
  const ids = session.questions.filter((item) => item.correct === false).map((item) => item.wordId);
  if (!ids.length) {
    showToast("这一轮没有错词。", { icon: "i-check" });
    return;
  }
  startWordSession("wrong", ids.length, ids);
}

function allHighlightRecords() {
  const all = safeRead(STORAGE.highlights, {});
  return Object.entries(all)
    .flatMap(([bookId, items]) =>
      (Array.isArray(items) ? items : []).map((item) => ({ ...item, bookId })),
    )
    .filter((item) => item.text)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

function highlightRowMarkup(item) {
  const book = findBook(item.bookId);
  const page = Number.isFinite(Number(item.paragraph))
    ? Math.floor(Number(item.paragraph) / PAGE_SIZE) + 1
    : 1;
  const bookLabel = book?.titleZh ? `${book.titleZh} / ${book.title}` : book?.title || "已移除的书";
  return `
    <article class="highlight-record">
      <span class="highlight-record-swatch hl-${escapeHtml(item.color || "yellow")}" aria-hidden="true"></span>
      <div class="highlight-record-quote">
        <strong>${escapeHtml(item.text)}</strong>
        <span>${escapeHtml(bookLabel)} · 第 ${page} 页</span>
      </div>
      <div class="highlight-record-date">${formatShortDate(item.createdAt)}</div>
      <div class="highlight-record-actions">
        ${
          book
            ? `<button type="button" data-action="open-highlight-source" data-highlight-id="${escapeHtml(item.id)}" aria-label="回到标记原文"><svg><use href="#i-reader"></use></svg></button>`
            : ""
        }
        <button type="button" data-action="remove-highlight" data-book-id="${escapeHtml(item.bookId)}" data-highlight-id="${escapeHtml(item.id)}" aria-label="删除标记"><svg><use href="#i-trash"></use></svg></button>
      </div>
    </article>
  `;
}

function openHighlightSource(highlightId) {
  const item = allHighlightRecords().find((highlight) => highlight.id === highlightId);
  if (!item) return;
  const book = findBook(item.bookId);
  if (!book) {
    showToast("这本书的正文已经不在这台设备上。", { icon: "i-x" });
    return;
  }
  state.pendingPageByBook[item.bookId] = Number(item.paragraph || 0);
  state.startContentForBookId = item.bookId;
  navigate(`#/read/${encodeURIComponent(item.bookId)}`);
}

function wordRowMarkup(item) {
  const sourceBook = item.sourceBookId ? findBook(item.sourceBookId) : null;
  const sourceLabel = sourceBook?.titleZh
    ? `${sourceBook.titleZh} / ${sourceBook.title}`
    : item.sourceTitle || "手动查词";
  return `
    <article class="word-row">
      <div class="word-main">
        <strong>${escapeHtml(item.word)}</strong>
        <span>${escapeHtml(item.phonetic || "")}</span>
      </div>
      <div class="word-meaning">${escapeHtml(item.meaning || "暂无简明释义")}</div>
      <div class="word-source">
        ${escapeHtml(sourceLabel)}
        <span>${formatShortDate(item.updatedAt || item.createdAt)}</span>
      </div>
      <div class="word-actions">
        ${
          item.sourceBookId
            ? `<button type="button" data-action="open-word-source" data-word-id="${escapeHtml(item.id)}" aria-label="回到原文"><svg><use href="#i-reader"></use></svg></button>`
            : ""
        }
        <button type="button" data-action="remove-word" data-word-id="${escapeHtml(item.id)}" aria-label="移除生词"><svg><use href="#i-trash"></use></svg></button>
      </div>
    </article>
  `;
}

function wordbookEmptyMarkup(filtered = false) {
  return `
    <div class="empty-state">
      <div>
        <div class="empty-state-mark"><svg><use href="#i-notebook"></use></svg></div>
        <h3>${filtered ? "没有匹配的生词" : "生词本还空着"}</h3>
        <p>${filtered ? "换一个词再搜索，或清空搜索条件。" : "打开一本书，选中一个词，在右侧词典点「加入生词本」。释义与出处会留在这里，等你来背。"}</p>
        <button class="button-primary" type="button" data-action="go-library">去书库读一段</button>
      </div>
    </div>
  `;
}

function removeWord(wordId) {
  const words = getWordbook();
  const target = words.find((item) => item.id === wordId);
  safeWrite(
    STORAGE.wordbook,
    words.filter((item) => item.id !== wordId),
  );
  renderWordbook();
  if (target) showToast(`已移除「${target.word}」`, { icon: "i-trash" });
}

function exportUserData() {
  const payload = {
    product: "Eleven 精读书库",
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: safeRead(STORAGE.progress, {}),
    highlights: safeRead(STORAGE.highlights, {}),
    wordbook: safeRead(STORAGE.wordbook, []),
    imports: safeRead(STORAGE.imports, []),
    recentWords: safeRead(STORAGE.recentWords, []),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `eleven-library-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("阅读记录、标记、生词和导入已导出。", { icon: "i-check" });
}

/* My page */

function renderMyPage() {
  const progress = safeRead(STORAGE.progress, {});
  const readingRows = Object.values(progress)
    .map((item) => ({ ...item, book: findBook(item.bookId) }))
    .filter((item) => item.book && !item.book.deletedAt)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const active = activeImports();
  const deleted = state.imports
    .filter((item) => item.deletedAt)
    .sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));
  const highlightRecords = allHighlightRecords();
  const words = getWordbook();
  const pagesRead = readingRows.reduce(
    (sum, item) => sum + Math.min(Number(item.page || 0) + 1, Number(item.totalPages || 1)),
    0,
  );

  els.main.innerHTML = `
    <section class="me-view">
      <header class="me-head">
        <div>
          <div class="hero-kicker">My reading desk</div>
          <h1 class="me-title">我的，<br />阅读留下的痕迹。</h1>
          <p>你的阅读进度、截图文章、原文标记、生词和回收站都在这里。</p>
        </div>
        <div class="me-signature">
          <span>记录保存在这台设备</span>
          <strong>${active.length + readingRows.length + words.length}</strong>
          <small>条个人阅读记录</small>
        </div>
      </header>

      <div class="me-stats" aria-label="我的阅读数据">
        <div><span>在读书目</span><strong>${readingRows.length}</strong><small>本</small></div>
        <div><span>已读页数</span><strong>${pagesRead}</strong><small>页</small></div>
        <div><span>原文标记</span><strong>${highlightRecords.length}</strong><small>处</small></div>
        <div><span>生词记录</span><strong>${words.length}</strong><small>个</small></div>
        <div><span>我的文章</span><strong>${active.length}</strong><small>篇</small></div>
      </div>

      <div class="me-columns">
        <section class="me-panel">
          <div class="me-panel-head">
            <div><h2>我的文章</h2><p>截图识别或粘贴保存的文章，可继续追加、备注或删除。</p></div>
            <button class="button-secondary" type="button" data-action="open-import"><svg><use href="#i-plus"></use></svg>新建导入</button>
          </div>
          ${
            active.length
              ? `<div class="my-article-list">${active.map(myArticleRowMarkup).join("")}</div>`
              : myEmptyMarkup("还没有导入文章", "在截图精读中识别一页文字，保存后会出现在这里。", "去导入文章")
          }
        </section>

        <section class="me-panel">
          <div class="me-panel-head">
            <div><h2>阅读记录</h2><p>继续上次停下的书页，或回看原文标记。</p></div>
          </div>
          ${
            readingRows.length
              ? `<div class="my-reading-list">${readingRows
                  .slice(0, 7)
                  .map((item) => {
                    const percent = Math.max(
                      1,
                      Math.round(((Number(item.page || 0) + 1) / Math.max(1, Number(item.totalPages || 1))) * 100),
                    );
                    return `
                      <button class="my-reading-row" type="button" data-action="open-reading-record" data-book-id="${escapeHtml(item.bookId)}">
                        <span class="my-reading-copy">
                          <strong>${escapeHtml(item.book.title)}</strong>
                          <small>${escapeHtml(item.book.titleZh || item.book.author || "")}</small>
                        </span>
                        <span class="my-reading-progress"><i style="width:${percent}%"></i></span>
                        <b>${percent}%</b>
                        <svg><use href="#i-arrow"></use></svg>
                      </button>
                    `;
                  })
                  .join("")}</div>`
              : myEmptyMarkup("还没有阅读记录", "打开一本书读一页，进度会自动保存在这里。", "去书库看看")
          }
          <button class="me-wordbook-link" type="button" data-action="go-wordbook">
            <span><strong>生词本</strong><small>${words.length} 个带上下文的单词</small></span>
            <svg><use href="#i-arrow"></use></svg>
          </button>
        </section>
      </div>

      <section class="trash-panel">
        <div class="me-panel-head">
          <div><h2>回收站</h2><p>删除的文章会先放在这里，可以恢复或彻底删除。</p></div>
          <span class="trash-count">${deleted.length} items</span>
        </div>
        ${
          deleted.length
            ? `<div class="trash-list">${deleted.map(trashArticleRowMarkup).join("")}</div>
               <div class="trash-actions"><button class="button-quiet" type="button" data-action="empty-trash"><svg><use href="#i-trash"></use></svg>清空回收站</button></div>`
            : `<div class="trash-empty">回收站是空的。删除的文章会先来到这里，不会立刻消失。</div>`
        }
      </section>
    </section>
  `;
}

function myArticleRowMarkup(item) {
  return `
    <article class="my-article-row">
      <button class="my-article-main" type="button" data-action="open-my-article" data-import-id="${escapeHtml(item.id)}">
        <span class="my-article-title">${escapeHtml(item.title)}</span>
        ${item.titleZh ? `<span class="my-article-zh">${escapeHtml(item.titleZh)}</span>` : ""}
        <span class="my-article-meta">${escapeHtml(item.source || "我的导入")} · ${item.wordCount || wordCount(item.text)} 词 · ${formatShortDate(item.createdAt)}</span>
        ${item.notes ? `<span class="my-article-notes">备注 · ${escapeHtml(item.notes)}</span>` : ""}
      </button>
      <div class="my-article-actions">
        <button type="button" data-action="edit-import-meta" data-import-id="${escapeHtml(item.id)}" aria-label="编辑备注" title="编辑备注"><svg><use href="#i-sliders"></use></svg></button>
        <button type="button" data-action="append-article" data-import-id="${escapeHtml(item.id)}" aria-label="继续添加内容" title="继续添加内容"><svg><use href="#i-plus"></use></svg></button>
        <button type="button" data-action="trash-import" data-import-id="${escapeHtml(item.id)}" aria-label="移入回收站" title="移入回收站"><svg><use href="#i-trash"></use></svg></button>
      </div>
    </article>
  `;
}

function trashArticleRowMarkup(item) {
  return `
    <article class="trash-row">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.titleZh || item.source || "我的导入")} · 删除于 ${formatShortDate(item.deletedAt)}</span>
      </div>
      <div class="trash-row-actions">
        <button class="button-secondary" type="button" data-action="restore-import" data-import-id="${escapeHtml(item.id)}">恢复</button>
        <button class="button-quiet" type="button" data-action="purge-import" data-import-id="${escapeHtml(item.id)}">彻底删除</button>
      </div>
    </article>
  `;
}

function myEmptyMarkup(title, description, actionLabel) {
  return `
    <div class="my-empty">
      <div class="my-empty-mark"><svg><use href="#i-books"></use></svg></div>
      <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(description)}</p></div>
      <button class="button-secondary" type="button" data-action="${actionLabel === "去书库看看" ? "go-library" : "open-import"}">${escapeHtml(actionLabel)}</button>
    </div>
  `;
}

async function moveImportToTrash(importId) {
  const response = await fetch(`/api/imports/${encodeURIComponent(importId)}`, { method: "DELETE" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "删除失败。");
  const item = state.imports.find((entry) => entry.id === importId);
  if (item) {
    item.deletedAt = Date.now();
    item.updatedAt = Date.now();
  }
  safeWrite(STORAGE.imports, state.imports);
  renderMyPage();
  showToast("文章已移入回收站，可在这里恢复。", { icon: "i-trash" });
}

async function restoreImport(importId) {
  const response = await fetch(`/api/imports/${encodeURIComponent(importId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ restore: true }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "恢复失败。");
  const index = state.imports.findIndex((entry) => entry.id === importId);
  if (index >= 0) state.imports[index] = { ...state.imports[index], ...payload, deletedAt: 0 };
  safeWrite(STORAGE.imports, state.imports);
  renderMyPage();
  showToast("文章已从回收站恢复。", { icon: "i-check" });
}

async function purgeImport(importId, confirmFirst = true) {
  if (confirmFirst && !window.confirm("彻底删除后无法恢复，确定继续吗？")) return;
  const response = await fetch(`/api/imports/${encodeURIComponent(importId)}?permanent=1`, { method: "DELETE" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "彻底删除失败。");
  state.imports = state.imports.filter((entry) => entry.id !== importId);
  safeWrite(STORAGE.imports, state.imports);
  renderMyPage();
  showToast("文章已彻底删除。", { icon: "i-trash" });
}

async function emptyTrash() {
  const deleted = state.imports.filter((item) => item.deletedAt);
  if (!deleted.length) return;
  if (!window.confirm("清空回收站后无法恢复，确定继续吗？")) return;
  for (const item of deleted) {
    const response = await fetch(`/api/imports/${encodeURIComponent(item.id)}?permanent=1`, { method: "DELETE" });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || "清空回收站失败。");
    }
  }
  state.imports = state.imports.filter((item) => !item.deletedAt);
  safeWrite(STORAGE.imports, state.imports);
  renderMyPage();
  showToast("回收站已清空。", { icon: "i-trash" });
}

/* Import + OCR */

function renderImport() {
  const imports = activeImports();
  const ocr = state.ocr;
  const left =
    ocr.status === "idle"
      ? importDropMarkup()
      : importWorkspaceMarkup();
  els.main.innerHTML = `
    <section class="import-view">
      <div class="import-head">
        <div>
          <h1 class="import-title">${
            state.appendMode
              ? `继续往这篇文章里，<br />添加<em>内容</em>。`
              : `截图里的英文，<br />拖进来就能<em>读</em>。`
          }</h1>
          <p class="import-lede">
            ${
              state.appendMode
                ? `新识别或粘贴的文字会追加到《${escapeHtml(state.appendMode.title)}》末尾，原有正文、中文备注和来源都会保留。`
                : "从文章、PDF 或网页截一张图，放进这里。英文会自动识别成可编辑正文，再进入和小说完全相同的标记、查词与生词流程。"
            }
          </p>
        </div>
        <div class="import-steps" aria-label="导入步骤">
          <div class="import-step"><strong>拖入截图</strong><span>PNG / JPG / WebP，最多 6 张</span></div>
          <div class="import-step"><strong>核对文字</strong><span>识别结果可编辑、可合并</span></div>
          <div class="import-step"><strong>开始精读</strong><span>选中、标记、查词一如小说</span></div>
        </div>
      </div>
      <div class="import-grid">
        <div id="import-left">${state.appendMode ? appendTargetMarkup() : `${pendingMagazineMarkup()}${pendingSourceMarkup()}`}${left}</div>
        <aside class="import-side">
          <div class="import-side-block">
            <h3>最近的导入</h3>
            <p>标题、中文备注、来源和正文会保存在本机，并同步到站点后台，方便以后继续添加。</p>
            ${
              imports.length
                ? `<div class="recent-imports">${imports
                    .slice(0, 4)
                    .map(
                      (item) => `
                        <button class="recent-import" type="button" data-book-id="${escapeHtml(item.id)}">
                          <span>
                            <strong>${escapeHtml(item.title)}${item.titleZh ? ` <em>${escapeHtml(item.titleZh)}</em>` : ""}</strong>
                            <span>${formatShortDate(item.createdAt)} · 来源：${escapeHtml(item.source || "我的导入")} · ${item.wordCount || wordCount(item.text)} 词</span>
                          </span>
                          <svg><use href="#i-arrow"></use></svg>
                        </button>
                      `,
                    )
                    .join("")}</div>`
                : `<div class="empty-state" style="min-height:190px;padding:22px 0 8px"><div><div class="empty-state-mark"><svg><use href="#i-image"></use></svg></div><p style="margin-bottom:0">还没有导入内容。</p></div></div>`
            }
          </div>
          <div class="privacy-note">
            <svg><use href="#i-check"></use></svg>
            <span>图片只在浏览器内识别，不会上传；识别后的正文和备注会保存到本机，并同步到站点后台。词典查询只发送当前选中的英文单词。</span>
          </div>
        </aside>
      </div>
    </section>
  `;
  els.searchInput.value = "";
  if (state.ocr.status !== "idle") updateOcrActionLabels();
}

function importDropMarkup() {
  return `
    <div class="drop-zone" id="drop-zone" tabindex="0" role="button" aria-label="选择或拖入截图">
      <div class="drop-zone-icon"><svg><use href="#i-image"></use></svg></div>
      <h2>把这一页，<br />拖到这里。</h2>
      <p>也可以直接粘贴截图、选择图片，或拖入 TXT / Markdown 文本。英文识别模型首次加载需要几秒钟。</p>
      <div class="drop-zone-actions">
        <button class="button-primary" type="button" data-action="choose-import">
          <svg><use href="#i-image"></use></svg>
          选择截图
        </button>
        <button class="button-secondary" type="button" data-action="use-demo-ocr">试用示例</button>
        <button class="button-secondary" type="button" data-action="paste-text">粘贴文字</button>
      </div>
      <div class="paste-zone">支持 PNG、JPG、WebP、GIF · 最多 6 张图片</div>
    </div>
  `;
}

function pendingSourceMarkup() {
  if (!state.pendingBookSource) return "";
  return `
    <div class="pending-source">
      <div>
        <span>来源书架</span>
        <strong>${escapeHtml(state.pendingBookSource.titleZh || state.pendingBookSource.title)}</strong>
        <small>${escapeHtml(state.pendingBookSource.title)}${state.pendingBookSource.author ? ` · ${escapeHtml(state.pendingBookSource.author)}` : ""}</small>
      </div>
      <button class="button-quiet" type="button" data-action="clear-pending-source">不关联这本书</button>
    </div>
  `;
}

function pendingMagazineMarkup() {
  if (!state.pendingMagazine) return "";
  const link = state.pendingMagazine;
  return `
    <div class="pending-source magazine-pending">
      <div>
        <span>正在截图精读这篇外刊</span>
        <strong>${escapeHtml(link.title || "未命名外刊")}</strong>
        <small>${escapeHtml(link.source || "我的外刊")} · ${escapeHtml(link.level || "未标注难度")} · ${escapeHtml(magazineHost(link.url))}</small>
      </div>
      <button class="button-quiet" type="button" data-action="clear-pending-magazine">不关联这篇</button>
    </div>
  `;
}

function appendTargetMarkup() {
  if (!state.appendMode) return "";
  return `
    <div class="pending-source append-source">
      <div>
        <span>正在追加内容</span>
        <strong>${escapeHtml(state.appendMode.title)}</strong>
        <small>${escapeHtml(state.appendMode.titleZh || state.appendMode.source || "")}</small>
      </div>
      <button class="button-quiet" type="button" data-action="cancel-append">退出追加</button>
    </div>
  `;
}

function matchingImportsForOcr(ocr = state.ocr) {
  const source = String(ocr.source || "").trim().toLowerCase();
  const bookId = String(ocr.sourceBookId || "");
  if (!source && !bookId) return [];
  return activeImports().filter((item) => {
    if (bookId && item.sourceBookId === bookId) return true;
    return Boolean(source) && String(item.source || "").trim().toLowerCase() === source;
  });
}

function updateOcrTargetPicker() {
  const wrap = document.querySelector("#ocr-target-wrap");
  const select = document.querySelector("#ocr-target-select");
  if (!wrap || !select) return;
  const targets = matchingImportsForOcr();
  wrap.hidden = targets.length === 0;
  if (!targets.length) {
    state.ocr.targetArticleId = "";
    select.value = "";
  } else {
    select.innerHTML = `<option value="">保存为新文章</option>${targets
      .map(
        (item) =>
          `<option value="${escapeHtml(item.id)}">${escapeHtml(item.titleZh || item.title)}${item.titleZh ? ` / ${escapeHtml(item.title)}` : ""} · ${escapeHtml(item.source || "")}</option>`,
      )
      .join("")}`;
    select.value = targets.some((item) => item.id === state.ocr.targetArticleId)
      ? state.ocr.targetArticleId
      : "";
  }
  updateOcrActionLabels();
}

function updateOcrActionLabels() {
  const appendSelected = Boolean(state.appendMode || document.querySelector("#ocr-target-select")?.value);
  const onlyButton = document.querySelector("[data-action=save-ocr-only] .action-label");
  const readButton = document.querySelector("[data-action=open-ocr-reading] .action-label");
  if (onlyButton) onlyButton.textContent = appendSelected ? "只追加" : "只保存";
  if (readButton) readButton.textContent = appendSelected ? "追加并阅读" : "保存并阅读";
}

function importWorkspaceMarkup() {
  const ocr = state.ocr;
  const processing = ocr.status === "processing";
  const hasText = Boolean(ocr.text.trim());
  const targets = state.appendMode ? [] : matchingImportsForOcr(ocr);
  const targetOptions = targets
    .map(
      (item) =>
        `<option value="${escapeHtml(item.id)}" ${item.id === ocr.targetArticleId ? "selected" : ""}>${escapeHtml(item.titleZh || item.title)}${item.titleZh ? ` / ${escapeHtml(item.title)}` : ""} · ${escapeHtml(item.source || "")}</option>`,
    )
    .join("");
  const title =
    state.appendMode?.title ||
    ocr.title ||
    state.pendingBookTitle ||
    (ocr.text.trim() ? inferTitle(ocr.text) : "截图精读");
  return `
    <div class="ocr-workspace">
      <div class="ocr-progress-panel" id="ocr-progress-panel">
        <div class="ocr-progress-head">
          <div>
            <h3>${processing ? "正在认出这些字" : ocr.status === "error" ? "识别没有完成" : "文字已经就位"}</h3>
            <p id="ocr-status-text">${escapeHtml(ocr.message || (processing ? "准备英文识别模型…" : "可以在下方直接修改识别结果。"))}</p>
          </div>
          <span class="ocr-percent" id="ocr-percent">${Math.round(ocr.progress)}%</span>
        </div>
        <div class="ocr-progress-bar"><span id="ocr-progress-fill" style="width:${ocr.progress}%"></span></div>
        ${
          ocr.files.length
            ? `<div class="ocr-file-list" id="ocr-file-list">${ocr.files
                .map(
                  (item, index) => `
                    <div class="ocr-file" data-file-index="${index}">
                      <div class="ocr-file-thumb">${item.url ? `<img src="${escapeHtml(item.url)}" alt="" />` : ""}</div>
                      <div>
                        <div class="ocr-file-name">${escapeHtml(item.file?.name || item.name || "粘贴的截图")}</div>
                        <div class="ocr-file-state">${fileStateLabel(item.state)}</div>
                      </div>
                      <span class="ocr-file-state">${item.words ? `${item.words} words` : ""}</span>
                    </div>
                  `,
                )
                .join("")}</div>`
            : ""
        }
        ${ocr.error ? `<div class="ocr-error" style="margin-top:16px">${escapeHtml(ocr.error)}</div>` : ""}
        ${
          ocr.status === "error"
            ? `<div class="reader-error-actions" style="margin-top:14px"><button class="button-secondary" type="button" data-action="retry-ocr">重新识别</button><button class="button-secondary" type="button" data-action="paste-text">改为粘贴文字</button></div>`
            : ""
        }
      </div>

      ${
        hasText
          ? `
            <div class="ocr-editor-panel">
              <div class="ocr-editor-head">
                <h3>核对文字</h3>
                <span>${wordCount(ocr.text)} words · ${ocr.text.length} characters</span>
              </div>
              ${
                state.appendMode
                  ? `<div class="append-editor-note"><strong>${escapeHtml(state.appendMode.title)}</strong><span>下面只显示本次新增的文字，保存后会追加到原文末尾。</span></div>`
                  : `
                    <label class="ocr-field-label">
                      <span>英文标题</span>
                      <input class="ocr-title-input" id="ocr-title-input" value="${escapeHtml(title)}" placeholder="给这篇文字起一个英文名字" aria-label="英文标题" />
                    </label>
                    <div class="ocr-meta-grid">
                      <label class="ocr-field-label">
                        <span>中文备注</span>
                        <input class="ocr-meta-input" id="ocr-title-zh-input" value="${escapeHtml(ocr.titleZh || "")}" placeholder="例如：关于阅读与好奇心的文章" aria-label="中文备注" />
                      </label>
                      <label class="ocr-field-label">
                        <span>文章来源</span>
                        <input class="ocr-meta-input" id="ocr-source-input" value="${escapeHtml(ocr.source || state.pendingBookSource?.title || "")}" placeholder="例如：The New York Times / 书名" aria-label="文章来源" />
                      </label>
                    </div>
                    <label class="ocr-field-label">
                      <span>文章备注</span>
                      <textarea class="ocr-notes-input" id="ocr-notes-input" placeholder="记录文章重点、主题或自己的备注">${escapeHtml(ocr.notes || "")}</textarea>
                    </label>
                    <div class="ocr-target-wrap" id="ocr-target-wrap" ${targets.length ? "" : "hidden"}>
                      <label class="ocr-field-label">
                        <span>保存位置</span>
                        <select class="ocr-target-select" id="ocr-target-select">
                          <option value="">保存为新文章</option>
                          ${targetOptions}
                        </select>
                      </label>
                      <small>只列出与当前文章来源相同的已保存文章；选择后会追加到那篇文章。</small>
                    </div>
                  `
              }
              <textarea class="ocr-textarea" id="ocr-textarea" spellcheck="false" aria-label="识别出的文章正文">${escapeHtml(ocr.text)}</textarea>
              <div class="ocr-editor-actions">
                <div class="ocr-editor-actions-left">
                  <button class="button-secondary" type="button" data-action="add-more">
                    <svg><use href="#i-plus"></use></svg>
                    再加图片
                  </button>
                  <button class="button-quiet" type="button" data-action="clear-import">清空</button>
                </div>
                <div class="ocr-editor-actions-right">
                  <button class="button-secondary" type="button" data-action="save-ocr-only" ${processing ? "disabled" : ""}>
                    <span class="action-label">${state.appendMode ? "只追加" : "只保存"}</span>
                  </button>
                  <button class="button-primary" type="button" data-action="open-ocr-reading" ${processing ? "disabled" : ""}>
                    <span class="action-label">${state.appendMode ? "追加并阅读" : "保存并阅读"}</span>
                    <svg><use href="#i-arrow"></use></svg>
                  </button>
                </div>
              </div>
            </div>
          `
          : `
            <div class="drop-zone" id="drop-zone" tabindex="0" role="button" aria-label="添加截图">
              <div class="drop-zone-icon"><svg><use href="#i-upload"></use></svg></div>
              <h2>${processing ? "识别还在进行" : "再放一张截图"}</h2>
              <p>${processing ? "完成后文字会自动出现在这里。" : "也可以把识别失败的文字直接粘贴进来。"}</p>
              <div class="drop-zone-actions">
                <button class="button-secondary" type="button" data-action="choose-import">选择图片</button>
                <button class="button-secondary" type="button" data-action="paste-text">粘贴文字</button>
              </div>
            </div>
          `
      }
    </div>
  `;
}

function fileStateLabel(stateName) {
  return (
    {
      queued: "等待识别",
      processing: "正在识别",
      done: "识别完成",
      error: "识别失败",
    }[stateName] || "等待识别"
  );
}

function wordCount(text) {
  return (String(text || "").match(/[A-Za-z][A-Za-z'’-]*/g) || []).length;
}

function inferTitle(text) {
  const firstLine = String(text || "")
    .split(/\n/)
    .map((line) => line.trim())
    .find(Boolean);
  if (!firstLine) return "截图精读";
  return firstLine.length > 36 ? `${firstLine.slice(0, 34)}…` : firstLine;
}

async function handleIncomingFiles(files) {
  const list = Array.from(files || []).filter(Boolean);
  if (!list.length) return;
  if (state.view !== "import") {
    navigate("#/import");
    await nextFrame();
  }

  const textFiles = list.filter((file) => /\.(txt|md|markdown)$/i.test(file.name) || /^text\//.test(file.type));
  const imageFiles = list
    .filter((file) => /^image\//.test(file.type) || /\.(png|jpe?g|webp|gif)$/i.test(file.name))
    .slice(0, 6);

  for (const file of textFiles) {
    try {
      const text = await file.text();
      appendOcrText(text);
    } catch {
      showToast(`无法读取 ${file.name}`, { icon: "i-x" });
    }
  }

  if (imageFiles.length) {
    if (!state.ocr.source) {
      state.ocr.source = state.pendingBookSource?.title || "截图导入";
      state.ocr.sourceBookId = state.pendingBookSource?.bookId || "";
    }
    if (state.ocr.files.filter((item) => item.state !== "done").length + imageFiles.length > 6) {
      showToast("一次最多处理 6 张图片。", { icon: "i-image" });
    }
    for (const file of imageFiles) {
      state.ocr.files.push({
        file,
        name: file.name,
        url: URL.createObjectURL(file),
        state: "queued",
        words: 0,
      });
    }
    state.ocr.status = "processing";
    state.ocr.error = "";
    state.ocr.message = "准备英文识别模型…";
    state.ocr.progress = 0;
    renderImport();
    await runOcrQueue();
  } else if (textFiles.length) {
    state.ocr.status = "recognized";
    state.ocr.progress = 100;
    state.ocr.message = "文本已读入，可以直接开始精读。";
    renderImport();
  }
}

function appendOcrText(text) {
  const cleaned = cleanOcrText(text);
  if (!cleaned) return;
  state.ocr.text = [state.ocr.text.trim(), cleaned.trim()].filter(Boolean).join("\n\n");
  if (!state.ocr.title) state.ocr.title = inferTitle(state.ocr.text);
}

function cleanOcrText(text) {
  let value = String(text || "")
    .replace(/\r\n?/g, "\n")
    .replace(/-\s*\n\s*(?=[a-z])/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
  const lines = value.split("\n").map((line) => line.trim());
  const paragraphs = [];
  let current = [];
  const flush = () => {
    if (current.length) {
      paragraphs.push(current.join(" ").replace(/\s+([,.;:!?])/g, "$1"));
      current = [];
    }
  };
  for (const line of lines) {
    if (!line) {
      flush();
      continue;
    }
    if (/^(page\s*)?\d{1,3}$/i.test(line)) continue;
    current.push(line);
  }
  flush();
  return paragraphs.join("\n\n");
}

async function ensureTesseract() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (window.Tesseract) return window.Tesseract;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("英文识别组件未能载入。请检查网络，或把文字直接粘贴进来。");
}

async function runOcrQueue() {
  const queue = state.ocr.files.filter((item) => item.state === "queued" || item.state === "error");
  if (!queue.length) {
    state.ocr.status = "recognized";
    state.ocr.progress = 100;
    state.ocr.message = "识别完成，请核对文字。";
    renderImport();
    return;
  }

  try {
    const Tesseract = await ensureTesseract();
    if (ocrWorker) {
      try {
        await ocrWorker.terminate();
      } catch {}
      ocrWorker = null;
    }
    let activeIndex = 0;
    ocrWorker = await Tesseract.createWorker("eng", 1, {
      logger: (message) => {
        if (!message) return;
        const localProgress = Number(message.progress || 0);
        const overall = Math.min(99, ((activeIndex + localProgress) / queue.length) * 100);
        state.ocr.progress = overall;
        state.ocr.message =
          message.status === "loading language traineddata"
            ? "正在下载英文识别模型…"
            : message.status === "recognizing text"
              ? "正在识别英文文字…"
              : "正在准备识别…";
        updateOcrProgressDom();
      },
    });

    for (let index = 0; index < queue.length; index += 1) {
      activeIndex = index;
      const item = queue[index];
      item.state = "processing";
      state.ocr.message = `正在识别第 ${index + 1} / ${queue.length} 张…`;
      updateOcrProgressDom();
      try {
        const result = await ocrWorker.recognize(item.file);
        const text = result?.data?.text || "";
        item.state = "done";
        item.words = wordCount(text);
        appendOcrText(text);
        state.ocr.progress = ((index + 1) / queue.length) * 100;
        state.ocr.message = `第 ${index + 1} 张识别完成。`;
        updateOcrProgressDom();
      } catch (error) {
        item.state = "error";
        item.error = error.message || "识别失败";
      }
    }

    state.ocr.status = "recognized";
    state.ocr.progress = 100;
    state.ocr.message = state.ocr.text ? "识别完成，请核对文字。" : "没有识别到可用英文。可以换一张更清晰的截图。";
    if (!state.ocr.text) state.ocr.error = "当前图片里没有识别出英文文字。";
    if (state.view === "import") renderImport();
  } catch (error) {
    state.ocr.status = "error";
    state.ocr.error = error.message || "英文识别没有完成。";
    state.ocr.message = "可以重试，或直接把文字粘贴进来。";
    if (state.view === "import") renderImport();
  } finally {
    if (ocrWorker) {
      try {
        await ocrWorker.terminate();
      } catch {}
      ocrWorker = null;
    }
  }
}

function updateOcrProgressDom() {
  const percent = document.querySelector("#ocr-percent");
  const fill = document.querySelector("#ocr-progress-fill");
  const message = document.querySelector("#ocr-status-text");
  if (percent) percent.textContent = `${Math.round(state.ocr.progress)}%`;
  if (fill) fill.style.width = `${state.ocr.progress}%`;
  if (message) message.textContent = state.ocr.message;
  document.querySelectorAll("[data-file-index]").forEach((element, index) => {
    const item = state.ocr.files[index];
    const label = element.querySelector(".ocr-file-state");
    if (item && label) label.textContent = fileStateLabel(item.state);
  });
}

function emptyOcrState() {
  return {
    status: "idle",
    files: [],
    progress: 0,
    message: "",
    text: "",
    title: "",
    titleZh: "",
    source: "",
    sourceBookId: "",
    notes: "",
    targetArticleId: "",
    error: "",
  };
}

function clearOcrState() {
  for (const item of state.ocr.files) {
    if (item.url) URL.revokeObjectURL(item.url);
  }
  state.ocr = emptyOcrState();
  state.pendingBookTitle = "";
  state.pendingBookSource = null;
  state.pendingMagazine = null;
  state.appendMode = null;
}

async function appendTextToArticle(target, text, readAfter = true) {
  if (!target || !text) return;
  const saveButton = document.querySelector("[data-action=open-ocr-reading]");
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "追加中…";
  }
  try {
    const response = await fetch(`/api/imports/${encodeURIComponent(target.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ appendText: text }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "追加失败。");
    const index = state.imports.findIndex((item) => item.id === target.id);
    const updated = {
      ...payload,
      available: true,
      primary: "我的导入",
      tags: ["我的导入"],
      author: payload.source || "截图识别",
      cover: "",
    };
    if (index >= 0) state.imports[index] = { ...state.imports[index], ...updated };
    else state.imports.unshift(updated);
    safeWrite(STORAGE.imports, state.imports);
    clearOcrState();
    showToast("新内容已追加到原文末尾。", { icon: "i-check" });
    if (readAfter) navigate(`#/read/${encodeURIComponent(target.id)}`);
    else renderImport();
  } catch (error) {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = "追加并阅读";
    }
    showToast(`追加失败：${error.message}`, { icon: "i-x", duration: 7000 });
  }
}

async function appendOcrToArticle(readAfter = true) {
  await appendTextToArticle(state.appendMode, state.ocr.text.trim(), readAfter);
}

async function openOcrReading(readAfter = true) {
  const text = state.ocr.text.trim();
  if (!text) {
    showToast("先放入一张有英文的截图。", { icon: "i-image" });
    return;
  }
  if (state.appendMode) {
    await appendOcrToArticle(readAfter);
    return;
  }
  const selectedTargetId =
    document.querySelector("#ocr-target-select")?.value || state.ocr.targetArticleId;
  if (selectedTargetId) {
    const target = activeImports().find((item) => item.id === selectedTargetId);
    if (target) {
      await appendTextToArticle(target, text, readAfter);
      return;
    }
  }
  const titleInput = document.querySelector("#ocr-title-input");
  if (titleInput) state.ocr.title = titleInput.value.trim();
  const titleZhInput = document.querySelector("#ocr-title-zh-input");
  const sourceInput = document.querySelector("#ocr-source-input");
  const notesInput = document.querySelector("#ocr-notes-input");
  if (titleZhInput) state.ocr.titleZh = titleZhInput.value.trim();
  if (sourceInput) state.ocr.source = sourceInput.value.trim();
  if (notesInput) state.ocr.notes = notesInput.value.trim();
  const date = new Date();
  const title =
    state.ocr.title.trim() ||
    state.pendingBookTitle ||
    `截图精读 · ${new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(
      date,
    )}`;
  let bodyText = text;
  const firstBreak = bodyText.search(/\n/);
  const firstLine = (firstBreak >= 0 ? bodyText.slice(0, firstBreak) : bodyText).trim();
  if (firstLine && firstLine.toLowerCase() === title.toLowerCase() && firstBreak >= 0) {
    bodyText = bodyText.slice(firstBreak).trim();
  }
  const source = state.ocr.source.trim() || state.pendingBookSource?.title || "截图导入";
  const imported = {
    id: `import-${Date.now().toString(36)}`,
    title,
    titleZh: state.ocr.titleZh.trim(),
    source,
    sourceBookId: state.ocr.sourceBookId || state.pendingBookSource?.bookId || "",
    notes: state.ocr.notes.trim(),
    author: source,
    year: date.getFullYear(),
    cover: "",
    available: true,
    primary: "我的导入",
    tags: ["我的导入", "截图精读"],
    text: bodyText,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const saveButton = document.querySelector("[data-action=open-ocr-reading]");
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "保存中…";
  }
  let saved = imported;
  try {
    saved = await saveImportToServer(imported);
    showToast("文章已保存到后台，可在「最近导入」中继续编辑。", { icon: "i-check" });
  } catch (error) {
    showToast(`后台保存失败，已保留本机副本：${error.message}`, { icon: "i-x", duration: 7000 });
  }
  state.imports = [saved, ...state.imports.filter((item) => item.id !== saved.id)].slice(0, 50);
  safeWrite(STORAGE.imports, state.imports);
  state.pendingMagazine = null;
  clearOcrState();
  if (readAfter) navigate(`#/read/${encodeURIComponent(saved.id)}`);
  else renderImport();
}

function resetOcrWorkspace() {
  clearOcrState();
  renderImport();
}

function startTextPaste() {
  els.pasteTextarea.value = state.ocr.text || "";
  els.pasteDialog.showModal();
  window.setTimeout(() => els.pasteTextarea.focus(), 40);
}

async function useDemoOcr() {
  try {
    const response = await fetch("assets/demo-article.png");
    if (!response.ok) throw new Error("示例图片没有载入。");
    const blob = await response.blob();
    const file = new File([blob], "quiet-power-demo.png", { type: "image/png" });
    await handleIncomingFiles([file]);
  } catch (error) {
    showToast(error.message || "示例图片没有载入。", { icon: "i-image" });
  }
}

function commitTextPaste() {
  const text = els.pasteTextarea.value.trim();
  if (!text) {
    els.pasteTextarea.focus();
    showToast("先粘贴一段英文，再继续。", { icon: "i-image" });
    return;
  }
  state.ocr.files = [];
  state.ocr.error = "";
  state.ocr.text = cleanOcrText(text);
  state.ocr.title = inferTitle(state.ocr.text);
  state.ocr.source = state.ocr.source || state.pendingBookSource?.title || "粘贴文字";
  state.ocr.sourceBookId = state.ocr.sourceBookId || state.pendingBookSource?.bookId || "";
  state.ocr.status = "recognized";
  state.ocr.progress = 100;
  state.ocr.message = "文字已读入，可以直接开始精读。";
  els.pasteDialog.close();
  renderImport();
}

function openMetadataDialog(book = state.currentBook) {
  if (!book?.id.startsWith("import-")) return;
  state.metadataTarget = book;
  document.querySelector("#meta-title-input").value = book.title || "";
  document.querySelector("#meta-title-zh-input").value = book.titleZh || "";
  document.querySelector("#meta-source-input").value = book.source || "";
  document.querySelector("#meta-notes-input").value = book.notes || "";
  els.metadataDialog.showModal();
  window.setTimeout(() => document.querySelector("#meta-title-input")?.focus(), 40);
}

function startAppendArticle(book = state.currentBook) {
  if (!book?.id.startsWith("import-")) return;
  for (const item of state.ocr.files) {
    if (item.url) URL.revokeObjectURL(item.url);
  }
  state.appendMode = {
    id: book.id,
    title: book.title,
    titleZh: book.titleZh || "",
    source: book.source || "",
  };
  state.pendingBookTitle = "";
  state.pendingBookSource = null;
  state.pendingMagazine = null;
  state.ocr = emptyOcrState();
  navigate("#/import");
}

async function saveImportMetadata() {
  const book = state.metadataTarget || state.currentBook;
  if (!book?.id.startsWith("import-")) return;
  const title = document.querySelector("#meta-title-input").value.trim();
  const titleZh = document.querySelector("#meta-title-zh-input").value.trim();
  const source = document.querySelector("#meta-source-input").value.trim() || "我的导入";
  const notes = document.querySelector("#meta-notes-input").value.trim();
  if (!title) {
    showToast("英文标题不能为空。", { icon: "i-x" });
    return;
  }
  const saveButton = document.querySelector("[data-action=save-import-meta]");
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "保存中…";
  }
  try {
    const response = await fetch(`/api/imports/${encodeURIComponent(book.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ title, titleZh, source, notes }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "保存失败。");
    Object.assign(book, payload, { author: source, available: true, primary: "我的导入", tags: ["我的导入"] });
  } catch (error) {
    Object.assign(book, { title, titleZh, source, notes, author: source, updatedAt: Date.now() });
    showToast(`后台保存失败，已更新本机信息：${error.message}`, { icon: "i-x", duration: 6000 });
  }
  const index = state.imports.findIndex((item) => item.id === book.id);
  if (index >= 0) state.imports[index] = { ...state.imports[index], ...book };
  safeWrite(STORAGE.imports, state.imports);
  els.metadataDialog.close();
  if (state.view === "reading" && state.currentBook?.id === book.id) {
    renderReaderShell();
    saveProgress();
  } else if (state.view === "me") {
    renderMyPage();
  }
  state.metadataTarget = null;
  showToast("文章标题、中文备注、来源和备注已更新。", { icon: "i-check" });
}

/* Book dialog */

function showBookDialog(book) {
  const previewUrl = `https://books.google.com/books?q=${encodeURIComponent(`${book.title} ${book.author}`)}`;
  const alternatives = state.books
    .filter(
      (item) =>
        item.available &&
        item.id !== book.id &&
        (item.primary === book.primary || (item.tags || []).some((tag) => (book.tags || []).includes(tag))),
    )
    .slice(0, 3);
  els.bookDialogContent.innerHTML = `
    <div class="dialog-book-inner">
      <button class="reader-icon-button dialog-close" type="button" data-action="close-dialog" aria-label="关闭">
        <svg><use href="#i-x"></use></svg>
      </button>
      <div class="dialog-cover">
        ${coverFallbackHtml(book)}
        ${coverImageHtml(book)}
      </div>
      <h2 class="dialog-title">${escapeHtml(book.title)}</h2>
      ${book.titleZh && book.titleZh !== book.title ? `<div class="dialog-title-zh">${escapeHtml(book.titleZh)}</div>` : ""}
      <div class="dialog-author">${escapeHtml(book.author)}${book.year ? ` · ${book.year}` : ""}</div>
      <div class="dialog-meta">
        ${(book.tags || [book.primary]).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        ${book.editions ? `<span>${book.editions} 个版本</span>` : ""}
      </div>
      <p class="dialog-copy">
        这是一条<strong>版权书目</strong>，站点没有内置受版权保护的全文。
        你可以使用自己合法拥有的电子文本或文章截图，在这本书的书名下继续阅读。
      </p>
      <ol class="dialog-read-steps">
        <li><strong>点下面的导入按钮</strong><span>进入“截图精读”，来源会自动写成《${escapeHtml(book.title)}》。</span></li>
        <li><strong>选择你的文本或截图</strong><span>支持 TXT、Markdown、PNG、JPG、WebP，也可以直接粘贴英文。</span></li>
        <li><strong>核对标题和中文备注</strong><span>保存后会进入阅读器，并使用同一套标记与有道查词功能。</span></li>
      </ol>
      <div class="dialog-actions">
        <button class="button-primary" type="button" data-action="import-for-book" data-book-id="${escapeHtml(book.id)}">
          <svg><use href="#i-upload"></use></svg>
          导入这本书的文本或截图
        </button>
        <a class="button-secondary" href="${previewUrl}" target="_blank" rel="noreferrer">
          打开 Google Books 预览
          <svg><use href="#i-external"></use></svg>
        </a>
      </div>
      ${
        alternatives.length
          ? `<div class="dialog-alternatives">
              <div class="dialog-alternatives-label">可直接阅读全文 · 推荐换读</div>
              ${alternatives
                .map(
                  (item) => `
                    <button class="dialog-alternative" type="button" data-book-id="${escapeHtml(item.id)}">
                      <span class="dialog-alternative-cover">
                        ${coverFallbackHtml(item)}
                        ${coverImageHtml(item)}
                      </span>
                      <span>
                        <strong>${escapeHtml(item.titleZh || item.title)}</strong>
                        <small>${escapeHtml(item.title)} · ${escapeHtml(item.author)}</small>
                      </span>
                      <svg><use href="#i-arrow"></use></svg>
                    </button>
                  `,
                )
                .join("")}
            </div>`
          : ""
      }
      <p class="dialog-note">
        导入后，文章来源会自动备注为这本英文书名；你可以在阅读页继续修改英文标题、中文备注和来源。
        第三方预览由 Google Books 提供，不再跳转 BetterWorldBooks。
      </p>
    </div>
  `;
  els.bookDialog.showModal();
}

function importForBook(bookId) {
  const book = findBook(bookId);
  state.pendingMagazine = null;
  state.pendingBookTitle = book?.title || "";
  state.pendingBookSource = book
    ? { bookId: book.id, title: book.title, titleZh: book.titleZh || "", author: book.author }
    : null;
  state.ocr.title = book?.title || "";
  state.ocr.source = book
    ? book.titleZh
      ? `${book.titleZh} / ${book.title}`
      : book.title
    : "";
  state.ocr.sourceBookId = book?.id || "";
  els.bookDialog.close();
  navigate("#/import");
}

/* Events */

function bindEvents() {
  window.addEventListener("hashchange", handleRoute);

  document.addEventListener("click", (event) => {
    const colorButton = event.target.closest("[data-highlight-color]");
    if (colorButton) {
      setHighlightColor(colorButton.dataset.highlightColor);
      return;
    }
    const genre = event.target.closest("[data-genre]");
    if (genre) {
      state.category = genre.dataset.genre;
      state.visible = 30;
      refreshCatalog();
      return;
    }
    const wordCount = event.target.closest("[data-word-count]");
    if (wordCount) {
      state.wordSessionConfig.count = Number(wordCount.dataset.wordCount) || 20;
      renderWordbook();
      return;
    }
    const wordMode = event.target.closest("[data-word-mode]");
    if (wordMode) {
      state.wordSessionConfig.mode = wordMode.dataset.wordMode || "mixed";
      renderWordbook();
      return;
    }
    const magazineLevel = event.target.closest("[data-magazine-level]");
    if (magazineLevel) {
      state.magazineLevel = magazineLevel.dataset.magazineLevel || "all";
      state.magazineVisible = 24;
      renderMagazines();
      return;
    }
    const bookTrigger = event.target.closest("[data-book-id]");
    if (bookTrigger && !event.target.closest("[data-action]")) {
      const book = findBook(bookTrigger.dataset.bookId);
      if (!book) return;
      navigate(`#/read/${encodeURIComponent(book.id)}`);
      return;
    }
    const recent = event.target.closest("[data-recent-word]");
    if (recent) {
      openDictionary(recent.dataset.recentWord, {
        bookId: state.currentBook?.id || "",
        bookTitle: state.currentBook?.title || "",
        origin: "manual",
      });
      return;
    }
    const dictTab = event.target.closest("[data-dict-tab]");
    if (dictTab) {
      switchDictionaryTab(dictTab.dataset.dictTab);
      return;
    }
    const dropZone = event.target.closest("#drop-zone");
    if (dropZone && !event.target.closest("button")) {
      els.fileInput.click();
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    switch (action) {
      case "reload":
        location.reload();
        break;
      case "open-import":
        state.appendMode = null;
        state.pendingBookSource = null;
        state.pendingMagazine = null;
        state.pendingBookTitle = "";
        navigate("#/import");
        break;
      case "choose-import":
      case "add-more":
        els.fileInput.click();
        break;
      case "continue-reading": {
        const book = continueTarget();
        if (book) {
          state.startContentForBookId = book.id;
          navigate(`#/read/${encodeURIComponent(book.id)}`);
        }
        break;
      }
      case "start-book-reading":
        if (state.currentBook) {
          openReader(state.currentBook.id, {
            startContent: true,
            page: Number(actionButton.dataset.page || 0),
          });
        }
        break;
      case "load-more":
        state.visible += 30;
        refreshCatalog();
        break;
      case "clear-filters":
        state.category = "全部";
        state.era = "all";
        state.readableOnly = false;
        state.query = "";
        state.visible = 30;
        els.searchInput.value = "";
        const era = document.querySelector("#era-filter");
        const readable = document.querySelector("#readable-only");
        if (era) era.value = "all";
        if (readable) readable.checked = false;
        refreshCatalog();
        break;
      case "back-library":
        navigate("#/library");
        break;
      case "go-library":
        navigate("#/library");
        break;
      case "go-wordbook":
        navigate("#/wordbook");
        break;
      case "open-magazine": {
        const id = actionButton.dataset.magazineId;
        if (!id) break;
        state.startContentForBookId = id;
        navigate(`#/read/${encodeURIComponent(id)}`);
        break;
      }
      case "load-more-magazines":
        state.magazineVisible += 24;
        renderMagazines();
        break;
      case "focus-magazine-search": {
        const input = document.querySelector("#magazine-lookup-input");
        input?.focus();
        input?.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
      case "open-magazine-link-dialog":
        {
          const query = actionButton.dataset.prefillQuery || "";
          const publication = findPublication(query);
          openMagazineLinkDialog({
            query,
            title: query,
            source: actionButton.dataset.prefillSource || publication?.name || "",
            level: actionButton.dataset.prefillLevel || publication?.level || "",
            access: publication?.access || "unknown",
            notes: query ? "从站内查找结果保存，具体免费/付费情况请在官网确认。" : "",
          });
        }
        break;
      case "close-magazine-link": {
        const dialog = document.querySelector("#magazine-link-dialog");
        if (dialog) dialog.close();
        break;
      }
      case "save-magazine-link":
        saveMagazineLink();
        break;
      case "delete-magazine-link":
        deleteMagazineLink(actionButton.dataset.linkId);
        break;
      case "start-magazine-screenshot":
        startMagazineScreenshot(actionButton.dataset.linkId);
        break;
      case "clear-pending-magazine":
        state.pendingMagazine = null;
        state.pendingBookTitle = "";
        state.ocr.title = "";
        state.ocr.titleZh = "";
        state.ocr.source = "截图导入";
        state.ocr.notes = "";
        renderImport();
        break;
      case "start-word-session":
        startWordSession();
        break;
      case "answer-word":
        answerWordQuestion(Number(actionButton.dataset.optionIndex));
        break;
      case "reveal-word":
        revealWordAnswer();
        break;
      case "next-word":
        nextWordQuestion();
        break;
      case "end-word-session":
        endWordSession();
        break;
      case "review-wrong":
        reviewWrongWords();
        break;
      case "restart-word-session":
        startWordSession(state.wordSessionConfig.mode, state.wordSessionConfig.count);
        break;
      case "open-my-article":
      case "open-reading-record": {
        const id = actionButton.dataset.importId || actionButton.dataset.bookId;
        if (id) {
          state.startContentForBookId = id;
          navigate(`#/read/${encodeURIComponent(id)}`);
        }
        break;
      }
      case "trash-import":
        moveImportToTrash(actionButton.dataset.importId).catch((error) =>
          showToast(error.message, { icon: "i-x" }),
        );
        break;
      case "restore-import":
        restoreImport(actionButton.dataset.importId).catch((error) =>
          showToast(error.message, { icon: "i-x" }),
        );
        break;
      case "purge-import":
        purgeImport(actionButton.dataset.importId).catch((error) =>
          showToast(error.message, { icon: "i-x" }),
        );
        break;
      case "empty-trash":
        emptyTrash().catch((error) => showToast(error.message, { icon: "i-x" }));
        break;
      case "page-prev":
        goToPage(state.page - 1);
        break;
      case "page-next":
        goToPage(state.page + 1);
        break;
      case "font-down":
        changeReaderFont(-1);
        break;
      case "font-up":
        changeReaderFont(1);
        break;
      case "toggle-noise-filter": {
        const popover = document.querySelector("#reader-filter-popover");
        if (popover) {
          popover.hidden = !popover.hidden;
          actionButton.setAttribute("aria-expanded", String(!popover.hidden));
          if (!popover.hidden) updateNoiseFilterUi();
        }
        break;
      }
      case "reset-noise-filter":
        applyNoiseFilter(0);
        break;
      case "toggle-translation":
        toggleParagraphTranslation(Number(actionButton.dataset.paragraphIndex));
        break;
      case "retry-translation": {
        const index = Number(actionButton.dataset.paragraphIndex);
        state.translationFailed.delete(translationKey(index));
        state.expandedTranslations.add(translationKey(index));
        ensureTranslations([index]).then(() => renderReaderPage());
        break;
      }
      case "toggle-page-translation":
        togglePageTranslation();
        break;
      case "toggle-dict": {
        const panel = document.querySelector("#dictionary-panel");
        if (panel) panel.classList.toggle("is-open");
        break;
      }
      case "close-dict": {
        const panel = document.querySelector("#dictionary-panel");
        if (panel) panel.classList.remove("is-open");
        break;
      }
      case "confirm-highlight":
        confirmHighlight();
        break;
      case "lookup-selection":
        lookupSelection();
        break;
      case "lookup-magazine-word":
        if (state.currentBook && actionButton.dataset.word) {
          openDictionary(actionButton.dataset.word, {
            bookId: state.currentBook.id,
            bookTitle: state.currentBook.title,
            origin: "lookup",
          });
        }
        break;
      case "pronounce-selection":
        pronounceSelection();
        break;
      case "cancel-highlight": {
        const selection = window.getSelection();
        if (selection) selection.removeAllRanges();
        hideSelectionToolbar();
        break;
      }
      case "retry-dict":
        if (state.dictionary?.query) openDictionary(state.dictionary.query, state.dictionary.meta);
        break;
      case "save-word":
        saveCurrentWord();
        break;
      case "remove-current-highlight": {
        const meta = state.dictionary?.meta;
        if (!meta?.highlightId || !meta.bookId) break;
        removeHighlightById(meta.bookId, meta.highlightId);
        state.dictionary.meta = { ...meta, highlightId: "" };
        renderDictionaryPanel();
        showToast("已取消这个原文标记。", { icon: "i-highlight" });
        break;
      }
      case "open-word-source": {
        const item = getWordbook().find((word) => word.id === actionButton.dataset.wordId);
        if (!item?.sourceBookId) break;
        if (!findBook(item.sourceBookId)) {
          showToast("原文已经不在这台设备上。", { icon: "i-x" });
          break;
        }
        state.startContentForBookId = item.sourceBookId;
        navigate(`#/read/${encodeURIComponent(item.sourceBookId)}`);
        window.setTimeout(() => {
          openDictionary(item.word, {
            bookId: item.sourceBookId,
            bookTitle: item.sourceTitle,
            paragraph: item.paragraph,
            origin: "lookup",
          });
        }, 700);
        break;
      }
      case "remove-word":
        removeWord(actionButton.dataset.wordId);
        break;
      case "open-highlight-source":
        openHighlightSource(actionButton.dataset.highlightId);
        break;
      case "remove-highlight":
        removeHighlightById(actionButton.dataset.bookId, actionButton.dataset.highlightId);
        renderWordbook();
        break;
      case "export-data":
        exportUserData();
        break;
      case "clear-import":
        resetOcrWorkspace();
        break;
      case "clear-pending-source": {
        const previousTitle = state.pendingBookSource?.title || "";
        state.pendingBookSource = null;
        state.ocr.sourceBookId = "";
        if (state.ocr.source === previousTitle) state.ocr.source = "截图导入";
        if (state.ocr.title === previousTitle) state.ocr.title = "";
        state.pendingBookTitle = "";
        renderImport();
        break;
      }
      case "append-article":
        startAppendArticle(
          actionButton.dataset.importId
            ? activeImports().find((item) => item.id === actionButton.dataset.importId)
            : state.currentBook,
        );
        break;
      case "cancel-append":
        clearOcrState();
        renderImport();
        break;
      case "open-ocr-reading":
        openOcrReading();
        break;
      case "save-ocr-only":
        openOcrReading(false);
        break;
      case "paste-text":
        startTextPaste();
        break;
      case "use-demo-ocr":
        useDemoOcr();
        break;
      case "commit-paste":
        commitTextPaste();
        break;
      case "close-paste":
        els.pasteDialog.close();
        break;
      case "edit-import-meta":
        openMetadataDialog(
          actionButton.dataset.importId
            ? activeImports().find((item) => item.id === actionButton.dataset.importId)
            : state.currentBook,
        );
        break;
      case "close-metadata":
        els.metadataDialog.close();
        break;
      case "save-import-meta":
        saveImportMetadata();
        break;
      case "retry-ocr":
        state.ocr.files.forEach((item) => {
          if (item.state !== "done") item.state = "queued";
        });
        state.ocr.status = "processing";
        state.ocr.error = "";
        state.ocr.message = "正在重试英文识别…";
        state.ocr.progress = 0;
        renderImport();
        runOcrQueue();
        break;
      case "close-dialog":
        els.bookDialog.close();
        break;
      case "import-for-book":
        importForBook(actionButton.dataset.bookId);
        break;
      default:
        break;
    }
  });

  document.addEventListener("click", (event) => {
    const audioButton = event.target.closest("[data-audio]");
    if (audioButton) playAudio(audioButton.dataset.audio, audioButton.dataset.audioText);
    const mark = event.target.closest("mark[data-highlight-id]");
    if (mark) {
      const text = mark.textContent;
      openDictionary(text, {
        bookId: state.currentBook?.id || "",
        bookTitle: state.currentBook?.title || "",
        highlightId: mark.dataset.highlightId,
        origin: "lookup",
      });
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".reader-filter-wrap")) return;
    const popover = document.querySelector("#reader-filter-popover");
    if (!popover || popover.hidden) return;
    popover.hidden = true;
    const button = document.querySelector("[data-action=toggle-noise-filter]");
    if (button) button.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "ocr-target-select") {
      state.ocr.targetArticleId = event.target.value;
      updateOcrActionLabels();
    }
    if (event.target.id === "era-filter") {
      state.era = event.target.value;
      state.visible = 30;
      refreshCatalog();
    }
    if (event.target.id === "sort-select") {
      state.sort = event.target.value;
      refreshCatalog();
    }
    if (event.target.id === "readable-only") {
      state.readableOnly = event.target.checked;
      state.visible = 30;
      refreshCatalog();
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "noise-filter-range") {
      const value = Number(event.target.value);
      const popover = event.target.closest("#reader-filter-popover");
      const strength = popover?.querySelector(".reader-filter-head strong");
      if (strength) strength.textContent = `${value}%`;
      window.clearTimeout(noiseFilterTimer);
      noiseFilterTimer = window.setTimeout(() => applyNoiseFilter(value), 90);
    }
    if (event.target.id === "ocr-textarea") {
      state.ocr.text = event.target.value;
      const counter = event.target.closest(".ocr-editor-panel")?.querySelector(".ocr-editor-head span");
      if (counter) counter.textContent = `${wordCount(state.ocr.text)} words · ${state.ocr.text.length} characters`;
    }
    if (event.target.id === "ocr-title-input") {
      state.ocr.title = event.target.value;
    }
    if (event.target.id === "ocr-title-zh-input") {
      state.ocr.titleZh = event.target.value;
    }
    if (event.target.id === "ocr-source-input") {
      state.ocr.source = event.target.value;
      updateOcrTargetPicker();
    }
    if (event.target.id === "ocr-notes-input") {
      state.ocr.notes = event.target.value;
    }
    if (event.target.id === "wordbook-search-input") {
      state.wordbookQuery = event.target.value;
      const list = document.querySelector(".word-list");
      const words = getWordbook();
      const query = state.wordbookQuery.trim().toLowerCase();
      const visible = words.filter((item) => !query || item.word.toLowerCase().includes(query) || item.meaning.toLowerCase().includes(query));
      if (list) list.innerHTML = visible.length ? visible.map(wordRowMarkup).join("") : wordbookEmptyMarkup(words.length > 0);
    }
    if (event.target === els.searchInput && state.view === "library") {
      state.query = event.target.value;
      state.visible = 30;
      refreshCatalog();
    }
  });

  document.addEventListener("selectionchange", handleSelectionChange);
  document.addEventListener("mouseup", handleSelectionChange);
  document.addEventListener("keyup", (event) => {
    if (event.key === "Shift" || event.key.startsWith("Arrow")) handleSelectionChange();
  });

  els.toolbar.addEventListener("mousedown", (event) => {
    if (event.target.closest("button")) event.preventDefault();
  });

  els.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = els.searchInput.value;
    state.visible = 30;
    if (state.view !== "library") navigate("#/library");
    else refreshCatalog();
  });

  els.fileInput.addEventListener("change", async () => {
    const files = Array.from(els.fileInput.files || []);
    els.fileInput.value = "";
    if (files.length) await handleIncomingFiles(files);
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "magazine-lookup-form") {
      event.preventDefault();
      runMagazineLookup(event.target.querySelector("#magazine-lookup-input")?.value || "");
      return;
    }
    if (event.target.id !== "dict-search-form") return;
    event.preventDefault();
    const word = normalizeWord(new FormData(event.target).get("word") || "");
    if (!word) return;
    openDictionary(word, {
      bookId: state.currentBook?.id || "",
      bookTitle: state.currentBook?.title || "",
      origin: "manual",
    });
  });

  document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName;
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);
    if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      els.searchInput.focus();
      els.searchInput.select();
    }
    if (event.key === "Escape") {
      hideSelectionToolbar();
      const filterPopover = document.querySelector("#reader-filter-popover");
      if (filterPopover && !filterPopover.hidden) filterPopover.hidden = true;
      if (state.view === "reading") {
        const panel = document.querySelector("#dictionary-panel");
        if (panel?.classList.contains("is-open") && window.innerWidth <= 860) panel.classList.remove("is-open");
      }
    }
    if (state.view === "reading" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPage(state.page - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToPage(state.page + 1);
      }
    }
    if (
      state.view === "wordbook" &&
      state.wordSession &&
      !typing &&
      event.key === " " &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      event.preventDefault();
      const session = state.wordSession;
      const question = session.questions[session.index];
      if (question?.answered) nextWordQuestion();
      else revealWordAnswer();
    }
    if (event.target.id === "drop-zone" && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      els.fileInput.click();
    }
  });

  els.bookDialog.addEventListener("click", (event) => {
    if (event.target === els.bookDialog) els.bookDialog.close();
  });

  els.pasteDialog.addEventListener("click", (event) => {
    if (event.target === els.pasteDialog) els.pasteDialog.close();
  });

  els.metadataDialog.addEventListener("click", (event) => {
    if (event.target === els.metadataDialog) els.metadataDialog.close();
  });

  window.addEventListener("dragenter", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth += 1;
    els.dropOverlay.hidden = false;
  });

  window.addEventListener("dragover", (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });

  window.addEventListener("dragleave", (event) => {
    if (els.dropOverlay.hidden) return;
    event.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) els.dropOverlay.hidden = true;
  });

  window.addEventListener("drop", async (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth = 0;
    els.dropOverlay.hidden = true;
    const files = Array.from(event.dataTransfer.files || []);
    if (files.length) {
      await handleIncomingFiles(files);
    } else {
      const text = event.dataTransfer.getData("text/plain");
      if (text && text.trim().length > 80) {
        navigate("#/import");
        await nextFrame();
        state.ocr.text = cleanOcrText(text);
        state.ocr.title = inferTitle(state.ocr.text);
        state.ocr.status = "recognized";
        state.ocr.progress = 100;
        state.ocr.message = "拖入的文字已读入。";
        renderImport();
      }
    }
  });

  document.addEventListener("paste", async (event) => {
    const files = Array.from(event.clipboardData?.files || []).filter((file) => /^image\//.test(file.type));
    if (files.length) {
      event.preventDefault();
      await handleIncomingFiles(files);
      return;
    }
    if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
    const text = event.clipboardData?.getData("text/plain");
    if (text && text.trim().length > 120 && state.view !== "reading") {
      event.preventDefault();
      navigate("#/import");
      await nextFrame();
      state.ocr.text = cleanOcrText(text);
      state.ocr.title = inferTitle(state.ocr.text);
      state.ocr.status = "recognized";
      state.ocr.progress = 100;
      state.ocr.message = "粘贴的文字已读入。";
      renderImport();
    }
  });
}

function hasFiles(event) {
  return Array.from(event.dataTransfer?.types || []).includes("Files");
}

function truncate(value, length) {
  const text = String(value || "");
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

window.addEventListener("beforeunload", () => {
  for (const item of state.ocr.files) {
    if (item.url) URL.revokeObjectURL(item.url);
  }
});

init();
