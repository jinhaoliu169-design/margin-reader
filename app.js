(function () {
  "use strict";

  const CATEGORY_META = {
    "Рассказ о себе": { zh: "关于自己", order: 1 },
    "Мой день": { zh: "我的一天", order: 2 },
    "Моя семья": { zh: "我的家庭", order: 3 },
    "Моя учёба": { zh: "我的学习", order: 4 },
    "Свободное время и интересы": { zh: "空闲时间与兴趣", order: 5 },
  };

  const questions = window.ORAL_EXAM_DATA || [];
  const lexicon = window.RUSSIAN_GLOSSARY || {};
  const wordAudioSources = window.RUSSIAN_WORD_AUDIO || {};
  const QUESTION_STATE_KEY = "russian-oral-question-states-v1";
  const categoryNav = document.getElementById("category-nav");
  const questionsRoot = document.getElementById("questions");
  const searchInput = document.getElementById("search");
  const clearSearchButton = document.getElementById("clear-search");
  const resultSummary = document.getElementById("result-summary");
  const emptyState = document.getElementById("empty-state");
  const resetFiltersButton = document.getElementById("reset-filters");
  const toast = document.getElementById("toast");
  const voiceStatus = document.getElementById("voice-status");
  const speedButtons = Array.from(document.querySelectorAll(".speed-option"));

  let selectedCategory = "all";
  let selectedRate = 0.75;
  let activeAudio = null;
  let activeSpeech = null;
  let activeBlock = null;
  let activeButton = null;
  let activeWords = [];
  let activeWordButton = null;
  let russianVoice = null;
  let toastTimer = null;

  function loadQuestionStates() {
    try {
      const stored = JSON.parse(localStorage.getItem(QUESTION_STATE_KEY) || "{}");
      return stored && typeof stored === "object" ? stored : {};
    } catch {
      return {};
    }
  }

  let questionStates = loadQuestionStates();

  function getQuestionState(id) {
    return {
      completed: Boolean(questionStates[id]?.completed),
      duplicate: Boolean(questionStates[id]?.duplicate),
    };
  }

  function setQuestionState(id, patch) {
    questionStates[id] = { ...getQuestionState(id), ...patch };
    try {
      localStorage.setItem(QUESTION_STATE_KEY, JSON.stringify(questionStates));
    } catch {
      // The state still works for the current session.
    }
  }

  const splitSentences = (text) =>
    (text.match(/[^.!?…]+(?:[.!?…]+|$)/g) || [text])
      .map((sentence) => sentence.trim())
      .filter(Boolean);

  const normalize = (text) => text.toLocaleLowerCase("ru");

  function findRussianVoice() {
    if (!("speechSynthesis" in window)) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    const russianVoices = voices.filter((voice) =>
      voice.lang.toLowerCase().startsWith("ru"),
    );
    return (
      russianVoices.find((voice) => voice.localService === true) ||
      russianVoices.find((voice) => voice.lang.toLowerCase() === "ru-ru") ||
      russianVoices.find((voice) => voice.lang.toLowerCase().startsWith("ru")) ||
      null
    );
  }

  function updateVoiceStatus() {
    russianVoice = findRussianVoice();
    voiceStatus.classList.add("is-ready");
    voiceStatus.classList.remove("is-unavailable");
    voiceStatus.querySelector(".voice-status-text").textContent = russianVoice
      ? "俄语点读已就绪 · 优先离线发音"
      : "俄语点读已就绪 · 在线补充发音";
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }

  function getGloss(word) {
    const key = word.toLocaleLowerCase("ru");
    return lexicon[key] || lexicon[word] || "词形";
  }

  function buildSentenceMarkup(sentence) {
    const parts = [];
    const wordPattern = /[\p{L}\p{M}-]+/gu;
    let lastIndex = 0;
    let match;

    while ((match = wordPattern.exec(sentence)) !== null) {
      if (match.index > lastIndex) {
        const punctuation = sentence.slice(lastIndex, match.index);
        parts.push(`<span class="punctuation">${escapeHtml(punctuation)}</span>`);
      }

      const word = match[0];
      const gloss = getGloss(word);
      parts.push(
        `<button class="word" type="button" data-start="${match.index}" data-end="${
          match.index + word.length
        }" data-word="${escapeHtml(word)}" aria-pressed="false" aria-label="朗读俄语单词 ${escapeHtml(
          word,
        )}，释义：${escapeHtml(gloss)}">` +
          `<span class="word-ru">${escapeHtml(word)}</span>` +
          `<span class="word-zh">${escapeHtml(gloss)}</span>` +
          `</button>`,
      );
      lastIndex = match.index + word.length;
    }

    if (lastIndex < sentence.length) {
      parts.push(`<span class="punctuation">${escapeHtml(sentence.slice(lastIndex))}</span>`);
    }

    return parts.join("");
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function sentenceBlock(sentence, kind, question, sentenceIndex) {
    const audioKind = kind === "question" ? "q" : "a";
    const customAudioFiles = kind === "answer" ? question.answerAudioFiles : null;
    const audioPath =
      customAudioFiles?.[sentenceIndex] ||
      `assets/audio/q${String(question.id).padStart(2, "0")}-${audioKind}${String(
        sentenceIndex + 1,
      ).padStart(2, "0")}.mp3`;

    return `
      <div class="sentence-block" data-sentence="${escapeHtml(sentence)}" data-audio="${audioPath}">
        <button
          class="play-button"
          type="button"
          aria-label="播放${kind === "question" ? "问题" : "答案"}第 ${sentenceIndex + 1} 句"
          aria-pressed="false"
        >
          <svg aria-hidden="true"><use href="#icon-play"></use></svg>
        </button>
        <div class="sentence-body">
          <p class="sentence-copy" lang="ru">${buildSentenceMarkup(sentence)}</p>
          <div class="speech-line" aria-hidden="true"></div>
        </div>
      </div>
    `;
  }

  function questionMarkup(question) {
    const questionSentences = splitSentences(question.questionRu);
    const answerSentences = splitSentences(question.answerRu);
    const itemState = getQuestionState(question.id);
    const stateClass = [
      itemState.completed ? "is-complete" : "",
      itemState.duplicate ? "is-duplicate" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `
      <article
        class="question-item ${stateClass}"
        id="question-${question.id}"
        data-question-id="${question.id}"
        tabindex="0"
        aria-label="第 ${question.id} 题${itemState.completed ? "，已完成" : ""}${
          itemState.duplicate ? "，已标记为重复" : ""
        }"
      >
        <div class="question-number" aria-hidden="true">${String(question.id).padStart(2, "0")}</div>
        <div class="question-content">
          <div class="question-actions" aria-label="第 ${question.id} 题状态">
            <button
              class="question-action complete-action ${itemState.completed ? "is-active" : ""}"
              type="button"
              data-question-action="complete"
              aria-pressed="${itemState.completed}"
              ${itemState.duplicate ? "disabled" : ""}
              title="${itemState.completed ? "取消完成" : "标记为完成"}"
            >
              <svg aria-hidden="true"><use href="#icon-check"></use></svg>
              <span>${itemState.completed ? "已完成" : "完成"}</span>
            </button>
            <button
              class="question-action duplicate-action ${itemState.duplicate ? "is-active" : ""}"
              type="button"
              data-question-action="duplicate"
              aria-pressed="${itemState.duplicate}"
              title="${itemState.duplicate ? "恢复这道题" : "标记为重复，内容会变灰但保留"}"
            >
              <svg aria-hidden="true"><use href="#icon-${itemState.duplicate ? "restore" : "trash"}"></use></svg>
              <span>${itemState.duplicate ? "恢复" : "删除"}</span>
            </button>
          </div>
          <section class="question-prompt" aria-label="问题">
            ${questionSentences
              .map((sentence, index) => sentenceBlock(sentence, "question", question, index))
              .join("")}
            <p class="translation">${escapeHtml(question.questionZh)}</p>
          </section>
          <div class="answer-label">回答</div>
          ${answerSentences
            .map((sentence, index) => sentenceBlock(sentence, "answer", question, index))
            .join("")}
          <p class="answer-translation">${escapeHtml(question.answerZh)}</p>
        </div>
      </article>
    `;
  }

  function updateQuestionCard(card) {
    const id = Number(card.dataset.questionId);
    const itemState = getQuestionState(id);
    card.classList.toggle("is-complete", itemState.completed);
    card.classList.toggle("is-duplicate", itemState.duplicate);
    card.setAttribute(
      "aria-label",
      `第 ${id} 题${itemState.completed ? "，已完成" : ""}${
        itemState.duplicate ? "，已标记为重复" : ""
      }`,
    );

    const completeButton = card.querySelector('[data-question-action="complete"]');
    if (completeButton) {
      completeButton.classList.toggle("is-active", itemState.completed);
      completeButton.setAttribute("aria-pressed", String(itemState.completed));
      completeButton.disabled = itemState.duplicate;
      completeButton.title = itemState.completed ? "取消完成" : "标记为完成";
      completeButton.querySelector("span").textContent = itemState.completed ? "已完成" : "完成";
    }

    const duplicateButton = card.querySelector('[data-question-action="duplicate"]');
    if (duplicateButton) {
      duplicateButton.classList.toggle("is-active", itemState.duplicate);
      duplicateButton.setAttribute("aria-pressed", String(itemState.duplicate));
      duplicateButton.title = itemState.duplicate
        ? "恢复这道题"
        : "标记为重复，内容会变灰但保留";
      duplicateButton.querySelector("use").setAttribute(
        "href",
        `#icon-${itemState.duplicate ? "restore" : "trash"}`,
      );
      duplicateButton.querySelector("span").textContent = itemState.duplicate ? "恢复" : "删除";
    }
  }

  function toggleQuestionComplete(card) {
    const id = Number(card.dataset.questionId);
    const current = getQuestionState(id);
    if (current.duplicate) return;
    setQuestionState(id, { completed: !current.completed });
    updateQuestionCard(card);
    showToast(current.completed ? `第 ${id} 题已取消完成` : `第 ${id} 题已完成`);
  }

  function toggleQuestionDuplicate(card) {
    const id = Number(card.dataset.questionId);
    const current = getQuestionState(id);
    const duplicate = !current.duplicate;
    if (duplicate && card.contains(activeBlock)) stopSpeech();
    setQuestionState(id, { duplicate, completed: duplicate ? false : current.completed });
    updateQuestionCard(card);
    showToast(duplicate ? `第 ${id} 题已标记为重复，内容仍保留` : `第 ${id} 题已恢复`);
  }

  function renderQuestions() {
    if (activeAudio || activeSpeech) {
      stopSpeech();
    }

    const query = normalize(searchInput.value.trim());
    const grouped = new Map();
    let visibleCount = 0;

    questions.forEach((question) => {
      const categoryMatches =
        selectedCategory === "all" || question.category === selectedCategory;
      const searchable = normalize(
        [
          question.questionRu,
          question.questionZh,
          question.answerRu,
          question.answerZh,
        ].join(" "),
      );
      if (categoryMatches && (!query || searchable.includes(query))) {
        if (!grouped.has(question.category)) {
          grouped.set(question.category, []);
        }
        grouped.get(question.category).push(question);
        visibleCount += 1;
      }
    });

    const orderedCategories = Array.from(grouped.keys()).sort(
      (a, b) => CATEGORY_META[a].order - CATEGORY_META[b].order,
    );

    questionsRoot.innerHTML = orderedCategories
      .map((category) => {
        const items = grouped.get(category);
        return `
          <section class="category-section" aria-labelledby="category-${CATEGORY_META[category].order}">
            <div class="section-heading">
              <h2 id="category-${CATEGORY_META[category].order}" lang="ru">${escapeHtml(category)}</h2>
              <span>${escapeHtml(CATEGORY_META[category].zh)} · ${items.length} 题</span>
            </div>
            <div class="question-list">${items.map(questionMarkup).join("")}</div>
          </section>
        `;
      })
      .join("");

    resultSummary.textContent = query
      ? `找到 ${visibleCount} 道题`
      : selectedCategory === "all"
        ? `${visibleCount} 道题`
        : `${visibleCount} 道题`;

    emptyState.hidden = visibleCount !== 0;
    questionsRoot.hidden = visibleCount === 0;
    clearSearchButton.hidden = !searchInput.value;

  }

  function populateCategories() {
    const counts = questions.reduce((accumulator, question) => {
      accumulator[question.category] = (accumulator[question.category] || 0) + 1;
      return accumulator;
    }, {});

    const categoryNames = Object.keys(CATEGORY_META);
    categoryNames.forEach((category) => {
      const button = document.createElement("button");
      button.className = "category-button";
      button.type = "button";
      button.dataset.category = category;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML =
        `<span class="category-label">` +
        `<span class="category-ru" lang="ru">${escapeHtml(category)}</span>` +
        `<span class="category-zh">${escapeHtml(CATEGORY_META[category].zh)}</span>` +
        `</span>` +
        `<span class="category-count">${counts[category]}</span>`;
      categoryNav.appendChild(button);
    });

    const firstButton = categoryNav.querySelector('[data-category="all"]');
    firstButton.querySelector(".category-count").textContent = String(questions.length);
    firstButton.setAttribute("aria-pressed", "true");
  }

  function setCategory(category) {
    selectedCategory = category;
    categoryNav.querySelectorAll(".category-button").forEach((button) => {
      const isActive = button.dataset.category === category;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderQuestions();
  }

  function setSpeed(rate) {
    selectedRate = rate;
    speedButtons.forEach((button) => {
      const isActive = Number(button.dataset.rate) === rate;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (activeAudio) {
      activeAudio.playbackRate = selectedRate;
      activeAudio.preservesPitch = true;
      showToast(`已切换为 ${rate.toFixed(2)}× 慢速`);
    } else if (activeSpeech) {
      stopSpeech();
      showToast(`语速已切换为 ${rate.toFixed(2)}×，请重新播放本句`);
    }
  }

  function clearWordHighlight() {
    activeWords.forEach((word) => {
      word.classList.remove("is-speaking", "is-loading");
      if (word === activeWordButton) word.setAttribute("aria-pressed", "false");
    });
    activeWordButton?.classList.remove("is-speaking", "is-loading");
    activeWordButton?.setAttribute("aria-pressed", "false");
    activeWordButton = null;
  }

  function markWordAt(index) {
    const nextWord = activeWords.find((word) => {
      const start = Number(word.dataset.start);
      const end = Number(word.dataset.end);
      return index >= start && index < end;
    });

    if (!nextWord || nextWord.classList.contains("is-speaking")) {
      return;
    }

    clearWordHighlight();
    nextWord.classList.add("is-speaking");
    const length = Number(activeBlock.dataset.sentence.length) || 1;
    activeBlock.style.setProperty(
      "--speech-progress",
      String(Math.min(0.98, Number(nextWord.dataset.end) / length)),
    );
  }

  function resetSpeechUI() {
    activeBlock?.classList.remove("is-playing");
    activeBlock?.style.setProperty("--speech-progress", "0");
    activeButton?.setAttribute("aria-pressed", "false");
    if (activeButton) {
      activeButton.innerHTML =
        '<svg aria-hidden="true"><use href="#icon-play"></use></svg>';
      activeButton.setAttribute("aria-label", activeButton.dataset.label || "播放句子");
    }
    clearWordHighlight();
    activeSpeech = null;
    activeAudio = null;
    activeBlock = null;
    activeButton = null;
    activeWords = [];
  }

  function stopSpeech() {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.removeAttribute("src");
      activeAudio = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    resetSpeechUI();
  }

  function wordLabel(word) {
    return `朗读俄语单词 ${word}`;
  }

  function setWordPlaying(button, isPlaying) {
    button.classList.toggle("is-speaking", isPlaying);
    button.classList.toggle("is-loading", !isPlaying);
    if (isPlaying) {
      button.setAttribute("aria-pressed", "true");
      button.setAttribute("aria-label", "停止朗读这个单词");
    } else {
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", wordLabel(button.dataset.word || ""));
    }
  }

  function playWordAudio(button, source, options = {}) {
    if (activeWordButton !== button) {
      return false;
    }
    activeSpeech = null;
    button.classList.remove("is-loading");
    const audio = new Audio(source);
    audio.preload = "auto";
    audio.referrerPolicy = "no-referrer";
    audio.playbackRate = selectedRate;
    audio.preservesPitch = true;
    activeAudio = audio;
    setWordPlaying(button, true);

    const finish = (message = "") => {
      if (activeAudio !== audio) {
        return;
      }
      resetSpeechUI();
      if (message) showToast(message);
    };

    const fail = () => {
      if (activeAudio !== audio) {
        return;
      }
      activeAudio = null;
      audio.pause();
      audio.removeAttribute("src");
      button.classList.remove("is-speaking");
      button.classList.add("is-loading");
      if (options.fallback) {
        options.fallback();
      } else {
        resetSpeechUI();
        showToast(options.errorMessage || "这个单词暂时无法发声，请检查网络");
      }
    };

    audio.addEventListener("ended", () => finish(), { once: true });
    audio.addEventListener("error", fail, { once: true });
    audio.play().catch(fail);
    return true;
  }

  function playWordOnline(button, word) {
    const source =
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ru&q=` +
      encodeURIComponent(word);
    playWordAudio(button, source, {
      errorMessage: "这个单词暂时无法发声，请检查网络",
    });
  }

  function playWordWithVoice(button, word) {
    if (!("speechSynthesis" in window) || !russianVoice) {
      playWordOnline(button, word);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ru-RU";
    utterance.rate = selectedRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.voice = russianVoice;
    activeSpeech = utterance;
    let started = false;

    const startTimer = window.setTimeout(() => {
      if (activeSpeech !== utterance || started) {
        return;
      }
      utterance.onend = null;
      utterance.onerror = null;
      window.speechSynthesis.cancel();
      playWordOnline(button, word);
    }, 2200);

    utterance.onstart = () => {
      started = true;
      window.clearTimeout(startTimer);
      if (activeWordButton === button) {
        setWordPlaying(button, true);
      }
    };

    utterance.onend = () => {
      window.clearTimeout(startTimer);
      if (activeSpeech !== utterance) {
        return;
      }
      resetSpeechUI();
    };

    utterance.onerror = (event) => {
      window.clearTimeout(startTimer);
      if (activeSpeech !== utterance || event.error === "interrupted") {
        return;
      }
      playWordOnline(button, word);
    };

    window.speechSynthesis.speak(utterance);
  }

  function speakWord(button) {
    if (activeWordButton === button && (activeSpeech || activeAudio)) {
      stopSpeech();
      return;
    }

    stopSpeech();
    const word = button.dataset.word || button.querySelector(".word-ru")?.textContent || "";
    if (!word) {
      return;
    }

    activeWordButton = button;
    button.classList.add("is-loading");
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "正在准备发音");

    const offlineSource = wordAudioSources[word.toLocaleLowerCase("ru")];
    if (offlineSource) {
      playWordAudio(button, offlineSource, {
        fallback: () => playWordWithVoice(button, word),
      });
      return;
    }

    playWordWithVoice(button, word);
  }

  function playSentence(button, block) {
    if (activeButton === button && (activeAudio || activeSpeech)) {
      stopSpeech();
      return;
    }

    stopSpeech();
    activeBlock = block;
    activeButton = button;
    activeWords = Array.from(block.querySelectorAll(".word"));
    button.dataset.label = button.getAttribute("aria-label") || "播放句子";
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "停止播放");
    button.innerHTML = '<svg aria-hidden="true"><use href="#icon-stop"></use></svg>';
    block.classList.add("is-playing");
    block.style.setProperty("--speech-progress", "0");

    const sentence = block.dataset.sentence;
    const audio = new Audio(block.dataset.audio);
    audio.preload = "auto";
    audio.playbackRate = selectedRate;
    audio.preservesPitch = true;
    activeAudio = audio;

    audio.addEventListener("timeupdate", () => {
      if (activeAudio !== audio) {
        return;
      }
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 1;
      const progress = Math.min(0.98, audio.currentTime / duration);
      block.style.setProperty("--speech-progress", String(progress));
      markWordAt(Math.floor(sentence.length * progress));
    });

    audio.addEventListener("ended", () => {
      if (activeAudio !== audio) {
        return;
      }
      block.style.setProperty("--speech-progress", "1");
      window.setTimeout(() => {
        if (activeAudio === audio) {
          resetSpeechUI();
        }
      }, 240);
    });

    audio.addEventListener("error", () => {
      if (activeAudio === audio) {
        playWithSpeechFallback(button, block);
      }
    });

    audio.play().catch(() => {
      if (activeAudio === audio) {
        playWithSpeechFallback(button, block);
      }
    });
  }

  function playWithSpeechFallback(button, block) {
    if (!("speechSynthesis" in window)) {
      resetSpeechUI();
      showToast("本句音频未能加载，请刷新页面后重试");
      return;
    }

    activeAudio = null;
    activeButton = button;
    activeBlock = block;
    activeWords = Array.from(block.querySelectorAll(".word"));
    const sentence = block.dataset.sentence;
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "ru-RU";
    utterance.rate = selectedRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (russianVoice) {
      utterance.voice = russianVoice;
    }

    utterance.onstart = () => {
      window.speechSynthesis.resume();
    };

    utterance.onboundary = (event) => {
      if (typeof event.charIndex === "number") {
        markWordAt(event.charIndex);
      }
    };

    utterance.onend = () => {
      if (activeSpeech !== utterance) {
        return;
      }
      activeBlock?.style.setProperty("--speech-progress", "1");
      window.setTimeout(() => {
        if (activeSpeech === utterance) {
          resetSpeechUI();
        }
      }, 240);
    };

    utterance.onerror = (event) => {
      if (activeSpeech !== utterance || event.error === "interrupted") {
        return;
      }
      resetSpeechUI();
      showToast("语音未能播放，请检查系统是否安装了俄语语音");
    };

    activeSpeech = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function resetFilters() {
    searchInput.value = "";
    selectedCategory = "all";
    categoryNav.querySelectorAll(".category-button").forEach((button) => {
      const isActive = button.dataset.category === "all";
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderQuestions();
    searchInput.focus();
  }

  categoryNav.addEventListener("click", (event) => {
    const button = event.target.closest(".category-button");
    if (!button) {
      return;
    }
    setCategory(button.dataset.category);
  });

  speedButtons.forEach((button) => {
    button.addEventListener("click", () => setSpeed(Number(button.dataset.rate)));
  });

  questionsRoot.addEventListener("click", (event) => {
    const questionAction = event.target.closest("[data-question-action]");
    if (questionAction) {
      const card = questionAction.closest(".question-item");
      if (!card) return;
      if (questionAction.dataset.questionAction === "complete") {
        toggleQuestionComplete(card);
      } else if (questionAction.dataset.questionAction === "duplicate") {
        toggleQuestionDuplicate(card);
      }
      return;
    }
    const wordButton = event.target.closest(".word");
    if (wordButton) {
      speakWord(wordButton);
      return;
    }
    const button = event.target.closest(".play-button");
    if (!button) {
      return;
    }
    const block = button.closest(".sentence-block");
    playSentence(button, block);
  });

  let searchTimer = null;
  searchInput.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(renderQuestions, 100);
  });

  clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    renderQuestions();
    searchInput.focus();
  });

  resetFiltersButton.addEventListener("click", resetFilters);

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable;

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      searchInput.focus();
    }

    if (event.key === "Escape") {
      if (document.activeElement === searchInput && searchInput.value) {
        searchInput.value = "";
        renderQuestions();
      } else if (activeAudio || activeSpeech) {
        stopSpeech();
      }
    }

    if (
      !isTyping &&
      (event.key === "Delete" || event.key === "Backspace") &&
      event.target === document.activeElement
    ) {
      const card = target.closest?.(".question-item");
      if (card && event.target === card) {
        event.preventDefault();
        toggleQuestionDuplicate(card);
      }
    }
  });

  window.addEventListener("beforeunload", () => {
    activeAudio?.pause();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  });

  function registerOfflineSupport() {
    const status = document.getElementById("offline-status");
    if (!status) return;
    const cacheName = "russian-oral-offline-v2026-10-27-2";

    const markReady = () => {
      status.classList.remove("is-caching", "is-failed");
      status.classList.add("is-ready");
      status.textContent = "离线内容已准备好，可断网使用";
    };

    if (!("serviceWorker" in navigator) || location.protocol === "file:") {
      status.classList.remove("is-caching");
      status.classList.add("is-failed");
      status.textContent = "请通过在线网址打开一次，以启用离线模式";
      return;
    }

    const fetchWithTimeout = async (url) => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      try {
        return await fetch(url, { signal: controller.signal });
      } finally {
        window.clearTimeout(timeout);
      }
    };

    const cacheOfflineAssets = async () => {
      const manifestResponse = await fetchWithTimeout("precache-manifest.json");
      if (!manifestResponse.ok) throw new Error("离线清单加载失败");
      const paths = await manifestResponse.json();
      const cache = await caches.open(cacheName);
      let completed = 0;
      let failed = [];

      const cacheOne = async (path) => {
        const url = new URL(path, document.baseURI).href;
        if (await cache.match(url)) {
          completed += 1;
          return;
        }
        try {
          const response = await fetchWithTimeout(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          await cache.put(url, response);
          completed += 1;
        } catch {
          failed.push(path);
        }
        if (completed % 15 === 0 || completed === paths.length) {
          status.textContent = `正在准备离线音频 ${completed}/${paths.length}`;
        }
      };

      for (let index = 0; index < paths.length; index += 6) {
        await Promise.all(paths.slice(index, index + 6).map(cacheOne));
      }

      if (failed.length) {
        const retryPaths = failed;
        failed = [];
        for (const path of retryPaths) await cacheOne(path);
      }
      if (failed.length) {
        status.classList.remove("is-caching");
        status.classList.add("is-failed");
        status.textContent = `还有 ${failed.length} 个音频未缓存，请联网后刷新`;
        return;
      }
      markReady();
    };

    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => navigator.serviceWorker.ready)
      .then(cacheOfflineAssets)
      .catch(() => {
        status.classList.remove("is-caching");
        status.classList.add("is-failed");
        status.textContent = "离线缓存尚未完成，请保持联网后刷新";
      });
  }

  populateCategories();
  renderQuestions();
  updateVoiceStatus();
  registerOfflineSupport();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", updateVoiceStatus);
  }
})();
