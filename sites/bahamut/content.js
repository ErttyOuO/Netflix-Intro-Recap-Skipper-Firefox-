(() => {
  "use strict";

  // v2.0.0 unified extension - Bahamut module imported from v1.4.0 without removing learning features.

  const DEFAULT_SETTINGS = Object.freeze({
    autoAgree: true,
    introLearning: true,
    autoSkipIntro: true,
    minLearnSkipSeconds: 20,
    language: "zh-TW"
  });

  const I18N = Object.freeze({
    "zh-TW": {
      unnamedWork: "未命名作品",
      agreeText: "同意",
      waitFrame: "等待影片載入可讀取影格",
      waitSize: "影片尺寸尚未就緒",
      frameSupported: "可讀取純影片影格，不包含網頁彈幕與控制列",
      frameBlocked: "影片來源觸發 CORS 限制，無法讀取純影片像素",
      frameFailed: "影格讀取失敗：{reason}",
      loadedFrame: "影片已載入，準備測試純影格讀取",
      playerFound: "已找到播放器，等待讀取影片影格",
      candidateAria: "片頭快轉學習確認",
      previewAlt: "快轉前的純影片畫面",
      previewUnavailable: "無法讀取純影片影格",
      candidateEyebrow: "偵測到一次較長快轉",
      candidateTitle: "要儲存為這部作品的片頭嗎？",
      capabilityOk: "已取得純影片畫面，可用於未來視覺辨識。",
      capabilityBlocked: "動畫瘋目前的影片來源觸發 CORS 限制；這次只偵測到快轉時間，暫不允許儲存為自動辨識資料。",
      capabilityMissing: "快轉前沒有取得有效影格；這次暫不允許儲存。",
      saveIntro: "儲存片頭資料",
      skipOnce: "本集略過",
      askLater: "稍後再問",
      compactNewOpening: "發現可能的新片頭，要新增嗎？",
      compactSimilarOpening: "這次快轉像片頭 {index}，要更新嗎？",
      compactFullOpening: "已儲存 3 組片頭，要取代片頭 {index} 嗎？",
      saving: "儲存中…",
      savedTitle: "已儲存這部作品的片頭學習資料",
      saveRetry: "儲存失敗，再試一次",
      skipLabel: "跳過 {duration}",
      second: "秒",
      minute: "分",
      autoSkipped: "已自動跳過片頭 · {duration}",
      autoAgreed: "已自動確認分級並開始播放",
      autoSkipMatch: "已辨識到已學習的片頭畫面",
      scanWaiting: "等待已學習片頭出現",
      candidateEyebrowExisting: "偵測到新的片頭候選",
      candidateTitleExisting: "這可能是不同的片頭，要如何處理？",
      candidateTitleSimilar: "這次快轉和片頭 {index} 很相似",
      addIntroProfile: "新增為片頭 {index}",
      replaceIntroProfile: "取代片頭 {index}",
      updateIntroProfile: "更新片頭 {index}",
      profilesFull: "目前已儲存 3 組片頭；如要保留這次候選，請取代其中一組。",
      savedAddedTitle: "已新增這部作品的另一組片頭",
      savedReplacedTitle: "已更新這部作品的片頭資料",
      close: "關閉"
    },
    "zh-CN": {
      unnamedWork: "未命名作品",
      agreeText: "同意",
      waitFrame: "等待影片载入可读取影格",
      waitSize: "影片尺寸尚未就绪",
      frameSupported: "可读取纯影片影格，不包含网页弹幕与控制列",
      frameBlocked: "影片来源触发 CORS 限制，无法读取纯影片像素",
      frameFailed: "影格读取失败：{reason}",
      loadedFrame: "影片已载入，准备测试纯影格读取",
      playerFound: "已找到播放器，等待读取影片影格",
      candidateAria: "片头快转学习确认",
      previewAlt: "快转前的纯影片画面",
      previewUnavailable: "无法读取纯影片影格",
      candidateEyebrow: "侦测到一次较长快转",
      candidateTitle: "要储存为这部作品的片头吗？",
      capabilityOk: "已取得纯影片画面，可用于未来视觉辨识。",
      capabilityBlocked: "动画疯目前的影片来源触发 CORS 限制；这次只侦测到快转时间，暂不允许储存为自动辨识资料。",
      capabilityMissing: "快转前没有取得有效影格；这次暂不允许储存。",
      saveIntro: "储存片头资料",
      skipOnce: "本集略过",
      askLater: "稍后再问",
      compactNewOpening: "发现可能的新片头，要新增吗？",
      compactSimilarOpening: "这次快转像片头 {index}，要更新吗？",
      compactFullOpening: "已储存 3 组片头，要取代片头 {index} 吗？",
      saving: "储存中…",
      savedTitle: "已储存这部作品的片头学习资料",
      saveRetry: "储存失败，再试一次",
      skipLabel: "跳过 {duration}",
      second: "秒",
      minute: "分",
      autoSkipped: "已自动跳过片头 · {duration}",
      autoAgreed: "已自动确认分级并开始播放",
      autoSkipMatch: "已辨识到已学习的片头画面",
      scanWaiting: "等待已学习片头出现",
      candidateEyebrowExisting: "侦测到新的片头候选",
      candidateTitleExisting: "这可能是不同的片头，要如何处理？",
      candidateTitleSimilar: "这次快转和片头 {index} 很相似",
      addIntroProfile: "新增为片头 {index}",
      replaceIntroProfile: "取代片头 {index}",
      updateIntroProfile: "更新片头 {index}",
      profilesFull: "目前已储存 3 组片头；如要保留这次候选，请取代其中一组。",
      savedAddedTitle: "已新增这部作品的另一组片头",
      savedReplacedTitle: "已更新这部作品的片头资料",
      close: "关闭"
    },
    en: {
      unnamedWork: "Untitled work",
      agreeText: "Agree",
      waitFrame: "Waiting for a readable video frame",
      waitSize: "Video dimensions are not ready yet",
      frameSupported: "Pure video frames are readable without comments or player controls",
      frameBlocked: "The video source is blocked by CORS, so video pixels cannot be read",
      frameFailed: "Frame capture failed: {reason}",
      loadedFrame: "Video loaded; preparing frame capture test",
      playerFound: "Player found; waiting for readable video frames",
      candidateAria: "Opening skip learning confirmation",
      previewAlt: "Pure video frame before the seek",
      previewUnavailable: "Unable to read a pure video frame",
      candidateEyebrow: "Long forward seek detected",
      candidateTitle: "Save this as the opening for this title?",
      capabilityOk: "A pure video frame was captured and can be used for future visual matching.",
      capabilityBlocked: "This video source is blocked by CORS. The seek duration was detected, but it cannot be saved for automatic visual matching.",
      capabilityMissing: "No valid frame was available before the seek, so this one cannot be saved.",
      saveIntro: "Save opening",
      skipOnce: "Ignore this episode",
      askLater: "Ask later",
      compactNewOpening: "Possible new opening found. Add it?",
      compactSimilarOpening: "This seek looks like opening {index}. Update it?",
      compactFullOpening: "Three openings are saved. Replace opening {index}?",
      saving: "Saving…",
      savedTitle: "Opening learning data saved for this title",
      saveRetry: "Save failed — try again",
      skipLabel: "Skip {duration}",
      second: "sec",
      minute: "min",
      autoSkipped: "Opening auto-skipped · {duration}",
      autoAgreed: "Rating confirmed automatically; playback is starting",
      autoSkipMatch: "Matched a learned opening frame",
      scanWaiting: "Waiting for a learned opening",
      candidateEyebrowExisting: "New opening candidate detected",
      candidateTitleExisting: "This may be a different opening. What should happen?",
      candidateTitleSimilar: "This seek is very similar to opening {index}",
      addIntroProfile: "Add as opening {index}",
      replaceIntroProfile: "Replace opening {index}",
      updateIntroProfile: "Update opening {index}",
      profilesFull: "Three openings are already saved. Replace one to keep this candidate.",
      savedAddedTitle: "Another opening was added for this title",
      savedReplacedTitle: "Opening data updated for this title",
      close: "Close"
    }
  });

  const OVERLAY_SELECTOR = ".R18 .video-cover-ncc, .video-cover-ncc";
  const BUTTON_SELECTORS = [
    ".ncc-choose-btn button.choose-btn-agree",
    "button.choose-btn-agree#adult",
    "button.choose-btn-agree",
    "button#adult"
  ];

  const SAME_BUTTON_COOLDOWN_MS = 5000;
  const FALLBACK_SCAN_MS = 1200;
  const VIDEO_SCAN_MS = 1500;
  const FRAME_SAMPLE_MS = 420;
  const SEEK_SETTLE_MS = 1500;
  const CANDIDATE_LIFETIME_MS = 5000;
  const MAX_PROFILES_PER_WORK = 3;
  const FRAME_HISTORY_MS = 2200;
  const FRAME_HISTORY_MAX = 7;
  const AUTO_MATCH_SOFT_THRESHOLD = 0.88;
  const AUTO_MATCH_STRONG_THRESHOLD = 0.94;
  const AUTO_MATCH_CONFIRM_WINDOW_MS = 2800;
  const AUTO_MATCH_HINT_BEFORE_SECONDS = 240;
  const AUTO_MATCH_HINT_AFTER_SECONDS = 360;
  const AUTO_MATCH_FALLBACK_MAX_SECONDS = 10 * 60;
  const AUTO_SKIP_SUPPRESS_LEARNING_MS = 3500;
  const AUTO_SKIP_TOAST_MS = 3200;
  const EPISODE_PROMPT_STATE_KEY = "introPromptEpisodeStates";

  let settings = { ...DEFAULT_SETTINGS };
  let observer = null;
  let scanTimer = null;
  let fallbackTimer = null;
  let videoScanTimer = null;
  let frameSampleTimer = null;
  let lastButton = null;
  let lastClickAt = 0;
  let lastUrl = location.href;

  let activeVideo = null;
  let lastStableTime = null;
  let lastFrame = null;
  let frameHistory = [];
  let nextFrameAttemptAt = 0;
  let seekSession = null;
  let seekSettleTimer = null;
  let frameCapability = {
    status: "waiting",
    reason: t("waitFrame"),
    checkedAt: 0
  };

  let candidateCard = null;
  let candidateExpireTimer = null;
  let candidateFadeTimer = null;
  let activeCandidate = null;
  let toast = null;
  let toastTimer = null;

  let profilesCache = {
    workKey: null,
    entry: null,
    loadedAt: 0
  };
  let matcherBusy = false;
  let matchVotes = new Map();
  let autoSkipPerformedEpisodeKey = null;
  let suppressLearningUntil = 0;
  let lastAutoSkip = null;
  let lastMatchProbe = null;
  let episodePromptStateCache = null;

  function language() {
    return I18N[settings.language] ? settings.language : "zh-TW";
  }

  function t(key, vars = {}) {
    let text = I18N[language()]?.[key] ?? I18N["zh-TW"]?.[key] ?? key;
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  }

  function isTargetPage() {
    return location.hostname === "ani.gamer.com.tw";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    const rounded = Math.floor(seconds);
    const mins = Math.floor(rounded / 60);
    const secs = rounded % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function formatDuration(seconds) {
    const whole = Math.max(0, Math.round(seconds));
    const mins = Math.floor(whole / 60);
    const secs = whole % 60;

    if (language() === "en") {
      if (mins === 0) return `${secs} ${t("second")}`;
      if (secs === 0) return `${mins} ${t("minute")}`;
      return `${mins} ${t("minute")} ${secs} ${t("second")}`;
    }

    if (mins === 0) return `${secs} ${t("second")}`;
    if (secs === 0) return `${mins} ${t("minute")}`;
    return `${mins} ${t("minute")} ${secs} ${t("second")}`;
  }

  function normalizeTitle(value) {
    return (value || "")
      .replace(/\s*[｜|]\s*巴哈姆特動畫瘋.*$/i, "")
      .replace(/\s*-\s*巴哈姆特動畫瘋.*$/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function identifyWork() {
    let workId = null;
    let title = "";

    const workLink = document.querySelector(
      'a[href*="acg.gamer.com.tw/acgDetail.php?s="], a[href*="/acgDetail.php?s="]'
    );
    if (workLink) {
      const href = workLink.getAttribute("href") || "";
      const match = href.match(/[?&]s=(\d+)/);
      if (match) workId = match[1];
    }

    const dataImage = document.querySelector(
      ".data-file img.data-img[alt], .data-file img[alt], section.data img[alt]"
    );
    if (dataImage) title = normalizeTitle(dataImage.getAttribute("alt"));

    if (!title) {
      const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
      title = normalizeTitle(ogTitle);
    }

    if (!title) {
      const heading = document.querySelector("h1, .anime_name, .anime-name, .video-title");
      title = normalizeTitle(heading?.textContent);
    }

    if (!title) title = normalizeTitle(document.title) || t("unnamedWork");

    const episodeMatch = location.search.match(/[?&]sn=(\d+)/);
    const episodeId = episodeMatch ? episodeMatch[1] : null;

    const key = workId
      ? `acg:${workId}`
      : title && title !== t("unnamedWork")
        ? `title:${title}`
        : `episode:${location.pathname}${location.search}`;

    return {
      key,
      workId,
      title,
      episodeId,
      episodeKey: episodeId ? `sn:${episodeId}` : location.pathname + location.search,
      url: location.href
    };
  }

  function isElementUsable(button) {
    if (!(button instanceof HTMLButtonElement)) return false;
    if (!button.isConnected || button.disabled) return false;

    const text = (button.textContent || "").trim();
    if (text && !text.includes("同意")) return false;

    const style = getComputedStyle(button);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.pointerEvents === "none"
    ) {
      return false;
    }

    const overlay = button.closest(".video-cover-ncc");
    if (overlay) {
      const overlayStyle = getComputedStyle(overlay);
      if (overlayStyle.display === "none" || overlayStyle.visibility === "hidden") {
        return false;
      }
    }

    return true;
  }

  function findAgreeButton() {
    const overlays = document.querySelectorAll(OVERLAY_SELECTOR);

    for (const overlay of overlays) {
      for (const selector of BUTTON_SELECTORS) {
        const button = overlay.querySelector(selector);
        if (isElementUsable(button)) return button;
      }
    }

    const fallback = document.querySelector(
      ".R18 button#adult, .R18 button.choose-btn-agree, .video-cover-ncc button#adult"
    );
    return isElementUsable(fallback) ? fallback : null;
  }

  function clickAgreeIfNeeded() {
    if (!settings.autoAgree || !isTargetPage()) return false;

    const button = findAgreeButton();
    if (!button) return false;

    const now = Date.now();
    if (button === lastButton && now - lastClickAt < SAME_BUTTON_COOLDOWN_MS) {
      return false;
    }

    lastButton = button;
    lastClickAt = now;
    button.click();
    showToast(t("autoAgreed"));
    scheduleScan(900);
    return true;
  }

  function scheduleScan(delay = 60) {
    if (scanTimer !== null) clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      scanTimer = null;
      clickAgreeIfNeeded();
      bindBestVideo();
    }, delay);
  }

  function chooseBestVideo() {
    const videos = [...document.querySelectorAll("video")].filter((video) => {
      const rect = video.getBoundingClientRect();
      const style = getComputedStyle(video);
      return (
        video.isConnected &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width >= 240 &&
        rect.height >= 120
      );
    });

    videos.sort((a, b) => {
      const areaA = a.getBoundingClientRect().width * a.getBoundingClientRect().height;
      const areaB = b.getBoundingClientRect().width * b.getBoundingClientRect().height;
      return areaB - areaA;
    });

    return videos[0] || document.querySelector("video") || null;
  }

  function setFrameCapability(status, reason) {
    const changed = frameCapability.status !== status || frameCapability.reason !== reason;
    frameCapability = {
      status,
      reason,
      checkedAt: Date.now()
    };
    if (changed) {
      document.dispatchEvent(new CustomEvent("bahamut-helper-frame-status"));
    }
  }

  function makeHashFromCanvas(sourceCanvas) {
    const hashCanvas = document.createElement("canvas");
    hashCanvas.width = 16;
    hashCanvas.height = 9;
    const ctx = hashCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("NO_2D_CONTEXT");

    ctx.drawImage(sourceCanvas, 0, 0, 16, 9);
    const data = ctx.getImageData(0, 0, 16, 9).data;
    const values = [];
    let sum = 0;

    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      values.push(gray);
      sum += gray;
    }

    const avg = sum / values.length;
    return values.map((value) => (value >= avg ? "1" : "0")).join("");
  }

  function captureVideoFrame(video, { withPreview = true } = {}) {
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setFrameCapability("waiting", t("waitFrame"));
      return null;
    }

    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;
    if (!sourceWidth || !sourceHeight) {
      setFrameCapability("waiting", t("waitSize"));
      return null;
    }

    const canvas = document.createElement("canvas");
    const targetWidth = 240;
    const targetHeight = Math.max(90, Math.round((sourceHeight / sourceWidth) * targetWidth));
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    try {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("NO_2D_CONTEXT");

      ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
      ctx.getImageData(0, 0, 1, 1);
      const fingerprint = makeHashFromCanvas(canvas);
      const previewDataUrl = withPreview ? canvas.toDataURL("image/jpeg", 0.72) : null;

      setFrameCapability("supported", t("frameSupported"));
      return {
        mediaTime: video.currentTime,
        capturedAt: performance.now(),
        fingerprint,
        previewDataUrl,
        width: targetWidth,
        height: targetHeight
      };
    } catch (error) {
      if (error?.name === "SecurityError") {
        setFrameCapability("blocked", t("frameBlocked"));
      } else {
        setFrameCapability("error", t("frameFailed", { reason: error?.message || "Unknown error" }));
      }
      return null;
    }
  }

  function addFrameToHistory(frame) {
    if (!frame?.fingerprint) return;
    frameHistory.push(frame);
    const cutoff = performance.now() - FRAME_HISTORY_MS;
    frameHistory = frameHistory
      .filter((item) => item.capturedAt >= cutoff)
      .slice(-FRAME_HISTORY_MAX);
  }

  function uniqueFingerprints(frames) {
    const seen = new Set();
    const result = [];
    for (const frame of frames || []) {
      const fingerprint = frame?.fingerprint;
      if (!fingerprint || seen.has(fingerprint)) continue;
      seen.add(fingerprint);
      result.push(fingerprint);
    }
    return result;
  }

  function hammingSimilarity(a, b) {
    if (typeof a !== "string" || typeof b !== "string" || a.length === 0 || a.length !== b.length) {
      return 0;
    }
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) diff += 1;
    }
    return 1 - diff / a.length;
  }

  function isInformativeFingerprint(fingerprint) {
    if (typeof fingerprint !== "string" || fingerprint.length === 0) return false;
    let ones = 0;
    for (const bit of fingerprint) {
      if (bit === "1") ones += 1;
      else if (bit !== "0") return false;
    }
    const ratio = ones / fingerprint.length;
    return ratio >= 0.12 && ratio <= 0.88;
  }

  function getProfileFingerprints(profile) {
    const fingerprints = Array.isArray(profile?.fingerprints)
      ? profile.fingerprints.filter(isInformativeFingerprint)
      : [];
    if (isInformativeFingerprint(profile?.fingerprint)) {
      fingerprints.push(profile.fingerprint);
    }
    return [...new Set(fingerprints)];
  }

  function bestSimilarity(frameFingerprint, profile) {
    let best = 0;
    for (const saved of getProfileFingerprints(profile)) {
      best = Math.max(best, hammingSimilarity(frameFingerprint, saved));
    }
    return best;
  }

  function isProfileInSearchWindow(profile, currentTime) {
    const hint = Number(profile?.startTimeHint);
    if (Number.isFinite(hint)) {
      const min = Math.max(0, hint - AUTO_MATCH_HINT_BEFORE_SECONDS);
      const max = hint + AUTO_MATCH_HINT_AFTER_SECONDS;
      return currentTime >= min && currentTime <= max;
    }
    return currentTime >= 0 && currentTime <= AUTO_MATCH_FALLBACK_MAX_SECONDS;
  }

  async function getIntroProfiles() {
    const result = await browser.storage.local.get({ introProfiles: {} });
    return result.introProfiles && typeof result.introProfiles === "object"
      ? result.introProfiles
      : {};
  }

  function episodePromptStateId(work) {
    return `${work?.key || "unknown"}|${work?.episodeKey || location.pathname + location.search}`;
  }

  async function getEpisodePromptStates(force = false) {
    if (!force && episodePromptStateCache && typeof episodePromptStateCache === "object") {
      return episodePromptStateCache;
    }
    const result = await browser.storage.local.get({ [EPISODE_PROMPT_STATE_KEY]: {} });
    const states = result[EPISODE_PROMPT_STATE_KEY];
    episodePromptStateCache = states && typeof states === "object" ? states : {};
    return episodePromptStateCache;
  }

  async function getEpisodePromptState(work) {
    const states = await getEpisodePromptStates(false);
    return states[episodePromptStateId(work)] || null;
  }

  async function setEpisodePromptState(work, status) {
    if (!work?.episodeKey || !status) return;
    const states = { ...(await getEpisodePromptStates(false)) };
    const id = episodePromptStateId(work);
    states[id] = {
      status,
      workKey: work.key,
      episodeKey: work.episodeKey,
      updatedAt: Date.now()
    };

    episodePromptStateCache = states;
    await browser.storage.local.set({ [EPISODE_PROMPT_STATE_KEY]: states });
  }

  async function clearEpisodePromptState(work) {
    const states = { ...(await getEpisodePromptStates(false)) };
    const id = episodePromptStateId(work);
    if (!states[id]) return;
    delete states[id];
    episodePromptStateCache = states;
    await browser.storage.local.set({ [EPISODE_PROMPT_STATE_KEY]: states });
  }

  async function episodePromptIsSuppressed(work) {
    if (autoSkipPerformedEpisodeKey === work?.episodeKey) return true;
    const state = await getEpisodePromptState(work);
    return state?.status === "completed" || state?.status === "dismissed";
  }

  async function getCurrentProfileEntry(force = false) {
    const work = identifyWork();
    if (!force && profilesCache.workKey === work.key && profilesCache.loadedAt > 0) {
      return { work, entry: profilesCache.entry };
    }

    const all = await getIntroProfiles();
    const entry = all[work.key] || null;
    profilesCache = {
      workKey: work.key,
      entry,
      loadedAt: Date.now()
    };
    return { work, entry };
  }

  function resetMatcherForNavigation() {
    profilesCache = { workKey: null, entry: null, loadedAt: 0 };
    matchVotes = new Map();
    autoSkipPerformedEpisodeKey = null;
    lastAutoSkip = null;
    lastMatchProbe = null;
  }

  async function maybeAutoSkipIntro(frame) {
    if (!settings.autoSkipIntro || !frame?.fingerprint || !activeVideo || activeVideo.paused) return;
    if (activeVideo.seeking || matcherBusy) return;

    const work = identifyWork();
    if (autoSkipPerformedEpisodeKey === work.episodeKey) return;

    matcherBusy = true;
    try {
      const { entry } = await getCurrentProfileEntry(false);
      const profiles = Array.isArray(entry?.profiles) ? entry.profiles : [];
      if (!profiles.length) return;

      const now = performance.now();
      let bestProbe = null;
      for (const profile of profiles) {
        const duration = Number(profile?.duration);
        if (!Number.isFinite(duration) || duration <= 0) continue;
        if (!isProfileInSearchWindow(profile, activeVideo.currentTime)) continue;

        const similarity = bestSimilarity(frame.fingerprint, profile);
        const profileId = profile.id || `${profile.createdAt || 0}:${profile.startTimeHint || 0}`;
        if (!bestProbe || similarity > bestProbe.similarity) {
          bestProbe = {
            at: Date.now(),
            workKey: work.key,
            episodeKey: work.episodeKey,
            mediaTime: Number(activeVideo.currentTime.toFixed(3)),
            similarity: Number(similarity.toFixed(4)),
            profileId
          };
        }
        let shouldSkip = similarity >= AUTO_MATCH_STRONG_THRESHOLD;

        if (!shouldSkip && similarity >= AUTO_MATCH_SOFT_THRESHOLD) {
          const previous = matchVotes.get(profileId);
          const count = previous && now - previous.lastAt <= AUTO_MATCH_CONFIRM_WINDOW_MS
            ? previous.count + 1
            : 1;
          matchVotes.set(profileId, { count, lastAt: now, best: Math.max(previous?.best || 0, similarity) });
          shouldSkip = count >= 2;
        } else if (similarity < AUTO_MATCH_SOFT_THRESHOLD) {
          const previous = matchVotes.get(profileId);
          if (previous && now - previous.lastAt > AUTO_MATCH_CONFIRM_WINDOW_MS) {
            matchVotes.delete(profileId);
          }
        }

        if (!shouldSkip) continue;

        const from = activeVideo.currentTime;
        let to = from + duration;
        if (Number.isFinite(activeVideo.duration) && activeVideo.duration > 0) {
          to = Math.min(to, Math.max(0, activeVideo.duration - 0.15));
        }
        if (!(to > from + 1)) return;

        autoSkipPerformedEpisodeKey = work.episodeKey;
        suppressLearningUntil = performance.now() + AUTO_SKIP_SUPPRESS_LEARNING_MS;
        seekSession = null;
        if (seekSettleTimer !== null) {
          clearTimeout(seekSettleTimer);
          seekSettleTimer = null;
        }

        activeVideo.currentTime = to;
        lastAutoSkip = {
          at: Date.now(),
          workKey: work.key,
          episodeKey: work.episodeKey,
          fromTime: from,
          toTime: to,
          duration,
          similarity: Number(similarity.toFixed(4)),
          profileId
        };
        setEpisodePromptState(work, "completed").catch(() => {});
        showToast(t("autoSkipped", { duration: formatDuration(duration) }));
        break;
      }
      if (bestProbe) lastMatchProbe = bestProbe;
    } finally {
      matcherBusy = false;
    }
  }

  function sampleCurrentFrame(force = false) {
    if ((!settings.introLearning && !settings.autoSkipIntro) || !activeVideo) return;
    if (activeVideo.seeking || activeVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    if (!force && activeVideo.paused) return;

    const now = performance.now();
    if (!force && now < nextFrameAttemptAt) return;

    const frame = captureVideoFrame(activeVideo, { withPreview: settings.introLearning });
    if (frame) {
      lastFrame = frame;
      addFrameToHistory(frame);
      nextFrameAttemptAt = now + FRAME_SAMPLE_MS;
      maybeAutoSkipIntro(frame).catch((error) => {
        console.warn("[動畫瘋自動播放助手] 自動片頭辨識失敗。", error);
      });
    } else if (frameCapability.status === "blocked" || frameCapability.status === "error") {
      nextFrameAttemptAt = now + 6000;
    } else {
      nextFrameAttemptAt = now + 1200;
    }
  }

  function beginSeekSession(video) {
    if (!settings.introLearning) return;
    if (performance.now() < suppressLearningUntil) return;

    if (!seekSession) {
      const frame = lastFrame;
      const fromTime = Number.isFinite(frame?.mediaTime)
        ? frame.mediaTime
        : Number.isFinite(lastStableTime)
          ? lastStableTime
          : video.currentTime;

      seekSession = {
        startedAt: performance.now(),
        fromTime,
        toTime: video.currentTime,
        eventCount: 1,
        frame: frame ? { ...frame } : null,
        history: frameHistory.map((item) => ({ ...item })),
        work: identifyWork()
      };
    } else {
      seekSession.eventCount += 1;
      seekSession.toTime = video.currentTime;
    }

    if (seekSettleTimer !== null) clearTimeout(seekSettleTimer);
  }

  function updateSeekSession(video) {
    if (!seekSession || performance.now() < suppressLearningUntil) return;
    seekSession.toTime = video.currentTime;

    if (seekSettleTimer !== null) clearTimeout(seekSettleTimer);
    seekSettleTimer = setTimeout(() => {
      seekSettleTimer = null;
      finalizeSeekSession().catch((error) => {
        console.warn("[動畫瘋自動播放助手] 無法完成快轉學習候選。", error);
      });
    }, SEEK_SETTLE_MS);
  }

  async function workHasProfile(workKey) {
    const profiles = await getIntroProfiles();
    const entry = profiles[workKey];
    return Array.isArray(entry?.profiles) && entry.profiles.length > 0;
  }

  async function finalizeSeekSession() {
    const session = seekSession;
    seekSession = null;
    if (!session || !settings.introLearning) return;
    if (performance.now() < suppressLearningUntil) return;

    const toTime = Number(session.toTime);
    const fromTime = Number(session.fromTime);
    const duration = toTime - fromTime;

    if (!Number.isFinite(duration) || duration < settings.minLearnSkipSeconds) return;
    if (duration > 15 * 60) return;

    const work = session.work || identifyWork();
    if (activeCandidate?.work?.episodeKey === work.episodeKey) return;
    if (await episodePromptIsSuppressed(work)) return;
    const allProfiles = await getIntroProfiles();
    const existingEntry = allProfiles[work.key] || null;
    const existingProfiles = Array.isArray(existingEntry?.profiles) ? existingEntry.profiles : [];

    // Once a work already has learned openings, only ask about additional candidates
    // reasonably near the beginning of an episode. This prevents ordinary mid-episode
    // seeks from constantly becoming "opening 2" prompts.
    if (existingProfiles.length > 0 && fromTime > AUTO_MATCH_FALLBACK_MAX_SECONDS) return;

    const frame = session.frame;
    let bestExistingIndex = -1;
    let bestExistingSimilarity = 0;
    if (frame?.fingerprint) {
      existingProfiles.forEach((profile, index) => {
        const similarity = bestSimilarity(frame.fingerprint, profile);
        if (similarity > bestExistingSimilarity) {
          bestExistingSimilarity = similarity;
          bestExistingIndex = index;
        }
      });
    }

    const candidate = {
      id: `candidate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      work,
      fromTime,
      toTime,
      duration,
      eventCount: session.eventCount,
      frame: frame
        ? {
            mediaTime: frame.mediaTime,
            fingerprint: frame.fingerprint,
            previewDataUrl: frame.previewDataUrl,
            width: frame.width,
            height: frame.height
          }
        : null,
      fingerprints: uniqueFingerprints([...(session.history || []), frame]),
      frameCapability: { ...frameCapability },
      sourceEpisodeUrl: location.href,
      createdAt: Date.now(),
      existingProfilesCount: existingProfiles.length,
      bestExistingIndex,
      bestExistingSimilarity: Number(bestExistingSimilarity.toFixed(4))
    };

    showCandidateCard(candidate);
  }

  async function saveCandidate(candidate, mode = "add", replaceIndex = 0) {
    if (!candidate?.frame?.fingerprint) return { ok: false, reason: "NO_FRAME" };

    const all = await getIntroProfiles();
    const existing = all[candidate.work.key] || {
      workKey: candidate.work.key,
      workId: candidate.work.workId,
      title: candidate.work.title,
      profiles: []
    };

    const fingerprints = Array.isArray(candidate.fingerprints) && candidate.fingerprints.length
      ? candidate.fingerprints.slice(-FRAME_HISTORY_MAX)
      : [candidate.frame.fingerprint];

    const profile = {
      id: `intro-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      duration: Number(candidate.duration.toFixed(3)),
      startTimeHint: Number(candidate.fromTime.toFixed(3)),
      fingerprint: candidate.frame.fingerprint,
      fingerprints,
      fingerprintVersion: 1,
      previewDataUrl: candidate.frame.previewDataUrl,
      previewWidth: candidate.frame.width,
      previewHeight: candidate.frame.height,
      sourceEpisodeUrl: candidate.sourceEpisodeUrl
    };

    existing.workId = candidate.work.workId || existing.workId || null;
    existing.title = candidate.work.title || existing.title || t("unnamedWork");
    existing.updatedAt = Date.now();

    const currentProfiles = Array.isArray(existing.profiles) ? [...existing.profiles] : [];
    let savedMode = mode;
    let savedIndex = currentProfiles.length;

    if (mode === "replace" && currentProfiles.length > 0) {
      savedIndex = clamp(Number(replaceIndex) || 0, 0, currentProfiles.length - 1);
      profile.replacedProfileId = currentProfiles[savedIndex]?.id || null;
      currentProfiles[savedIndex] = profile;
    } else {
      if (currentProfiles.length >= MAX_PROFILES_PER_WORK) {
        return { ok: false, reason: "FULL" };
      }
      currentProfiles.push(profile);
      savedMode = "add";
      savedIndex = currentProfiles.length - 1;
    }

    existing.profiles = currentProfiles;
    all[candidate.work.key] = existing;

    await browser.storage.local.set({ introProfiles: all });
    profilesCache = { workKey: candidate.work.key, entry: existing, loadedAt: Date.now() };
    matchVotes = new Map();
    return { ok: true, profile, mode: savedMode, index: savedIndex };
  }

  function removeCandidateCard() {
    if (candidateExpireTimer !== null) {
      clearTimeout(candidateExpireTimer);
      candidateExpireTimer = null;
    }
    if (candidateFadeTimer !== null) {
      clearTimeout(candidateFadeTimer);
      candidateFadeTimer = null;
    }

    if (candidateCard) {
      candidateCard.remove();
      candidateCard = null;
    }
    activeCandidate = null;
  }

  function getCardMountPoint() {
    return document.body || document.documentElement;
  }

  function showCandidateCard(candidate) {
    removeCandidateCard();
    activeCandidate = candidate;

    const card = document.createElement("aside");
    card.className = "bahamut-helper-candidate";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", t("candidateAria"));

    const frameAvailable = Boolean(candidate.frame?.previewDataUrl && candidate.frame?.fingerprint);
    const existingCount = Number(candidate.existingProfilesCount) || 0;
    const similarIndex = Number.isInteger(candidate.bestExistingIndex) && candidate.bestExistingIndex >= 0
      ? candidate.bestExistingIndex
      : 0;
    const isSimilar = existingCount > 0 && Number(candidate.bestExistingSimilarity) >= AUTO_MATCH_SOFT_THRESHOLD;
    const canAdd = existingCount < MAX_PROFILES_PER_WORK;
    const isExistingPrompt = existingCount > 0;

    if (isExistingPrompt) {
      card.classList.add("is-compact-existing");
      const compactTitle = isSimilar
        ? t("compactSimilarOpening", { index: similarIndex + 1 })
        : canAdd
          ? t("compactNewOpening")
          : t("compactFullOpening", { index: similarIndex + 1 });
      const primaryAction = isSimilar || !canAdd ? "replace" : "add";
      const primaryIndex = isSimilar || !canAdd ? similarIndex : 0;
      const primaryLabel = isSimilar
        ? t("updateIntroProfile", { index: similarIndex + 1 })
        : canAdd
          ? t("addIntroProfile", { index: existingCount + 1 })
          : t("replaceIntroProfile", { index: similarIndex + 1 });

      card.innerHTML = `
        <div class="bahamut-helper-compact-row">
          <div class="bahamut-helper-compact-title">${escapeHtml(compactTitle)}</div>
          <div class="bahamut-helper-compact-actions">
            <button class="bahamut-helper-primary" data-action="${primaryAction}" data-replace-index="${primaryIndex}" type="button" ${frameAvailable ? "" : "disabled"}>${escapeHtml(primaryLabel)}</button>
            <button class="bahamut-helper-secondary" data-action="skip" type="button">${escapeHtml(t("skipOnce"))}</button>
            <button class="bahamut-helper-ghost" data-action="later" type="button">${escapeHtml(t("askLater"))}</button>
          </div>
        </div>
        <div class="bahamut-helper-progress"><span></span></div>
      `;
    } else {
      const preview = frameAvailable
        ? `<img class="bahamut-helper-preview" src="${candidate.frame.previewDataUrl}" alt="${escapeHtml(t("previewAlt"))}">`
        : `<div class="bahamut-helper-preview bahamut-helper-preview--empty">${escapeHtml(t("previewUnavailable"))}</div>`;
      const capabilityNote = frameAvailable
        ? t("capabilityOk")
        : candidate.frameCapability.status === "blocked"
          ? t("capabilityBlocked")
          : t("capabilityMissing");

      card.innerHTML = `
        <div class="bahamut-helper-card-head">
          <div>
            <div class="bahamut-helper-eyebrow">${escapeHtml(t("candidateEyebrow"))}</div>
            <div class="bahamut-helper-title">${escapeHtml(t("candidateTitle"))}</div>
          </div>
          <button class="bahamut-helper-close" type="button" aria-label="${escapeHtml(t("close"))}">×</button>
        </div>
        <div class="bahamut-helper-candidate-body">
          ${preview}
          <div class="bahamut-helper-candidate-copy">
            <div class="bahamut-helper-work">${escapeHtml(candidate.work.title)}</div>
            <div class="bahamut-helper-time-row">
              <span>${formatTime(candidate.fromTime)} → ${formatTime(candidate.toTime)}</span>
              <strong>${escapeHtml(t("skipLabel", { duration: formatDuration(candidate.duration) }))}</strong>
            </div>
          </div>
        </div>
        <div class="bahamut-helper-capability ${frameAvailable ? "is-ok" : "is-warning"}">${escapeHtml(capabilityNote)}</div>
        <div class="bahamut-helper-actions has-three">
          <button class="bahamut-helper-primary" data-action="add" type="button" ${frameAvailable ? "" : "disabled"}>${escapeHtml(t("saveIntro"))}</button>
          <button class="bahamut-helper-secondary" data-action="skip" type="button">${escapeHtml(t("skipOnce"))}</button>
          <button class="bahamut-helper-ghost" data-action="later" type="button">${escapeHtml(t("askLater"))}</button>
        </div>
        <div class="bahamut-helper-progress"><span></span></div>
      `;
    }

    getCardMountPoint().appendChild(card);
    candidateCard = card;

    const dismissForEpisode = async () => {
      if (candidateExpireTimer !== null) {
        clearTimeout(candidateExpireTimer);
        candidateExpireTimer = null;
      }
      await setEpisodePromptState(candidate.work, "dismissed");
      fadeCandidateCard(false);
    };

    card.querySelector(".bahamut-helper-close")?.addEventListener("click", () => {
      dismissForEpisode().catch(() => removeCandidateCard());
    });
    card.querySelector('[data-action="skip"]')?.addEventListener("click", () => {
      dismissForEpisode().catch(() => removeCandidateCard());
    });
    card.querySelector('[data-action="later"]')?.addEventListener("click", () => {
      if (candidateExpireTimer !== null) {
        clearTimeout(candidateExpireTimer);
        candidateExpireTimer = null;
      }
      clearEpisodePromptState(candidate.work).catch(() => {});
      fadeCandidateCard(false);
    });

    async function runSave(button, mode, replaceIndex = 0) {
      if (!frameAvailable || !button || button.disabled) return;
      if (candidateExpireTimer !== null) {
        clearTimeout(candidateExpireTimer);
        candidateExpireTimer = null;
      }

      const actionButtons = [...card.querySelectorAll("[data-action]")];
      actionButtons.forEach((node) => { node.disabled = true; });
      const originalText = button.textContent;
      button.textContent = t("saving");

      try {
        const result = await saveCandidate(candidate, mode, replaceIndex);
        if (result.ok) {
          await setEpisodePromptState(candidate.work, "completed");
          card.classList.add("is-saved");
          if (card.classList.contains("is-compact-existing")) {
            const titleNode = card.querySelector(".bahamut-helper-compact-title");
            if (titleNode) titleNode.textContent = result.mode === "replace" ? t("savedReplacedTitle") : t("savedAddedTitle");
            card.querySelector(".bahamut-helper-compact-actions")?.remove();
          } else {
            const titleNode = card.querySelector(".bahamut-helper-title");
            if (titleNode) titleNode.textContent = t("savedTitle");
            card.querySelector(".bahamut-helper-actions")?.remove();
          }
          candidateExpireTimer = setTimeout(() => fadeCandidateCard(false), 1200);
        } else {
          actionButtons.forEach((node) => { node.disabled = false; });
          button.textContent = originalText;
        }
      } catch (error) {
        console.warn("[動畫瘋自動播放助手] 儲存片頭資料失敗。", error);
        actionButtons.forEach((node) => { node.disabled = false; });
        button.textContent = t("saveRetry");
      }
    }

    card.querySelector('[data-action="add"]')?.addEventListener("click", (event) => {
      runSave(event.currentTarget, "add", 0);
    });

    card.querySelector('[data-action="replace"]')?.addEventListener("click", (event) => {
      const index = Number(event.currentTarget.dataset.replaceIndex) || 0;
      runSave(event.currentTarget, "replace", index);
    });

    requestAnimationFrame(() => card.classList.add("is-visible"));
    candidateExpireTimer = setTimeout(() => {
      candidateExpireTimer = null;
      setEpisodePromptState(candidate.work, "dismissed").catch(() => {});
      fadeCandidateCard(false);
    }, CANDIDATE_LIFETIME_MS);
  }

  function fadeCandidateCard() {
    if (!candidateCard) return;
    candidateCard.classList.remove("is-visible");
    candidateCard.classList.add("is-fading");
    candidateFadeTimer = setTimeout(removeCandidateCard, 420);
  }

  function showToast(message) {
    if (toastTimer !== null) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    if (toast) toast.remove();

    const node = document.createElement("div");
    node.className = "bahamut-helper-toast";
    node.textContent = message;
    getCardMountPoint().appendChild(node);
    toast = node;
    requestAnimationFrame(() => node.classList.add("is-visible"));
    toastTimer = setTimeout(() => {
      node.classList.remove("is-visible");
      setTimeout(() => {
        if (toast === node) toast = null;
        node.remove();
      }, 260);
    }, AUTO_SKIP_TOAST_MS);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function handleTimeUpdate(event) {
    const video = event.currentTarget;
    if (!video.seeking) lastStableTime = video.currentTime;
  }

  function handleSeeking(event) {
    beginSeekSession(event.currentTarget);
  }

  function handleSeeked(event) {
    updateSeekSession(event.currentTarget);
  }

  function handleLoadedData() {
    lastStableTime = activeVideo?.currentTime ?? null;
    nextFrameAttemptAt = 0;
    frameHistory = [];
    setFrameCapability("waiting", t("loadedFrame"));
    setTimeout(() => sampleCurrentFrame(true), 100);
  }

  function handlePlay() {
    sampleCurrentFrame(true);
  }

  function handlePause() {
    sampleCurrentFrame(true);
  }

  function unbindVideo() {
    if (!activeVideo) return;
    activeVideo.removeEventListener("timeupdate", handleTimeUpdate);
    activeVideo.removeEventListener("seeking", handleSeeking);
    activeVideo.removeEventListener("seeked", handleSeeked);
    activeVideo.removeEventListener("loadeddata", handleLoadedData);
    activeVideo.removeEventListener("play", handlePlay);
    activeVideo.removeEventListener("pause", handlePause);
    activeVideo = null;
    lastStableTime = null;
    lastFrame = null;
    frameHistory = [];
    nextFrameAttemptAt = 0;
    seekSession = null;
    if (seekSettleTimer !== null) {
      clearTimeout(seekSettleTimer);
      seekSettleTimer = null;
    }
  }

  function bindVideo(video) {
    if (!video || video === activeVideo) return;
    unbindVideo();
    activeVideo = video;
    lastStableTime = Number.isFinite(video.currentTime) ? video.currentTime : null;

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    setFrameCapability("waiting", t("playerFound"));
    setTimeout(() => sampleCurrentFrame(true), 100);
  }

  function bindBestVideo() {
    const video = chooseBestVideo();
    if (video && video !== activeVideo) bindVideo(video);
    if (!video && activeVideo && !activeVideo.isConnected) unbindVideo();
  }

  function startVideoScanner() {
    if (videoScanTimer !== null) return;
    bindBestVideo();
    videoScanTimer = setInterval(bindBestVideo, VIDEO_SCAN_MS);
  }

  function startFrameSampler() {
    if (frameSampleTimer !== null) return;
    frameSampleTimer = setInterval(sampleCurrentFrame, FRAME_SAMPLE_MS);
  }

  function startObserver() {
    if (observer || !document.documentElement) return;

    observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          shouldScan = true;
          break;
        }
        if (mutation.type === "attributes") {
          shouldScan = true;
          break;
        }
      }
      if (shouldScan) scheduleScan();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "disabled", "aria-hidden"]
    });
  }

  function startFallbackScanner() {
    if (fallbackTimer !== null) return;

    fallbackTimer = setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        lastButton = null;
        lastClickAt = 0;
        removeCandidateCard();
        seekSession = null;
        lastFrame = null;
        frameHistory = [];
        resetMatcherForNavigation();
        episodePromptStateCache = null;
      }
      clickAgreeIfNeeded();
    }, FALLBACK_SCAN_MS);
  }

  async function loadSettings() {
    try {
      const stored = await browser.storage.local.get(DEFAULT_SETTINGS);
      settings = { ...DEFAULT_SETTINGS, ...stored };
      if (!I18N[settings.language]) settings.language = "zh-TW";
    } catch (error) {
      console.warn("[動畫瘋自動播放助手] 無法讀取設定，使用預設值。", error);
      settings = { ...DEFAULT_SETTINGS };
    }
  }

  function bindSettingsChanges() {
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") return;

      if (changes.autoAgree) {
        settings.autoAgree = changes.autoAgree.newValue !== false;
        if (settings.autoAgree) scheduleScan(0);
      }

      if (changes.introLearning) {
        settings.introLearning = changes.introLearning.newValue !== false;
        if (!settings.introLearning) {
          seekSession = null;
          removeCandidateCard();
        } else {
          setTimeout(() => sampleCurrentFrame(true), 0);
        }
      }

      if (changes.autoSkipIntro) {
        settings.autoSkipIntro = changes.autoSkipIntro.newValue !== false;
        matchVotes = new Map();
        if (settings.autoSkipIntro) setTimeout(() => sampleCurrentFrame(true), 0);
      }

      if (changes.minLearnSkipSeconds) {
        const value = Number(changes.minLearnSkipSeconds.newValue);
        if (Number.isFinite(value)) settings.minLearnSkipSeconds = clamp(value, 5, 180);
      }

      if (changes.language) {
        settings.language = I18N[changes.language.newValue] ? changes.language.newValue : "zh-TW";
        setFrameCapability(frameCapability.status, frameCapability.status === "supported"
          ? t("frameSupported")
          : frameCapability.status === "blocked"
            ? t("frameBlocked")
            : frameCapability.reason);
        if (activeCandidate) showCandidateCard(activeCandidate);
      }

      if (changes.introProfiles) {
        profilesCache = { workKey: null, entry: null, loadedAt: 0 };
        matchVotes = new Map();
      }

      if (changes[EPISODE_PROMPT_STATE_KEY]) {
        episodePromptStateCache = null;
      }
    });
  }

  async function getLearningStatus() {
    bindBestVideo();
    const work = identifyWork();
    const profiles = await getIntroProfiles();
    const entry = profiles[work.key];

    return {
      work,
      videoFound: Boolean(activeVideo),
      video: activeVideo
        ? {
            currentTime: activeVideo.currentTime,
            duration: activeVideo.duration,
            paused: activeVideo.paused,
            readyState: activeVideo.readyState,
            videoWidth: activeVideo.videoWidth,
            videoHeight: activeVideo.videoHeight
          }
        : null,
      frameCapability,
      profileCount: Array.isArray(entry?.profiles) ? entry.profiles.length : 0,
      autoSkipPerformedThisEpisode: autoSkipPerformedEpisodeKey === work.episodeKey,
      lastAutoSkip,
      lastMatchProbe,
      settings: {
        autoAgree: settings.autoAgree,
        introLearning: settings.introLearning,
        autoSkipIntro: settings.autoSkipIntro,
        minLearnSkipSeconds: settings.minLearnSkipSeconds,
        language: settings.language
      }
    };
  }

  async function clearCurrentWorkProfiles() {
    const work = identifyWork();
    const profiles = await getIntroProfiles();
    const existed = Boolean(profiles[work.key]);
    if (existed) {
      delete profiles[work.key];
      await browser.storage.local.set({ introProfiles: profiles });
    }
    profilesCache = { workKey: null, entry: null, loadedAt: 0 };
    matchVotes = new Map();

    const states = { ...(await getEpisodePromptStates(false)) };
    let stateChanged = false;
    for (const [id, state] of Object.entries(states)) {
      if (state?.workKey === work.key) {
        delete states[id];
        stateChanged = true;
      }
    }
    if (stateChanged) {
      episodePromptStateCache = states;
      await browser.storage.local.set({ [EPISODE_PROMPT_STATE_KEY]: states });
    }

    return { cleared: existed, work };
  }

  function bindRuntimeMessages() {
    browser.runtime.onMessage.addListener((message) => {
      if (!message) return undefined;

      if (message.type === "scan-now") {
        const clicked = clickAgreeIfNeeded();
        bindBestVideo();
        sampleCurrentFrame(true);
        return Promise.resolve({ clicked });
      }

      if (message.type === "get-learning-status") {
        return getLearningStatus();
      }

      if (message.type === "unified:getPlatformStatus") {
        return getLearningStatus().then((status) => ({
          platform: "bahamut",
          active: isTargetPage(),
          ...status
        }));
      }

      if (message.type === "test-frame-now") {
        bindBestVideo();
        const frame = activeVideo ? captureVideoFrame(activeVideo, { withPreview: false }) : null;
        return Promise.resolve({
          videoFound: Boolean(activeVideo),
          captured: Boolean(frame),
          frameCapability,
          work: identifyWork()
        });
      }

      if (message.type === "clear-current-work-profiles") {
        return clearCurrentWorkProfiles();
      }

      return undefined;
    });
  }

  async function init() {
    if (!isTargetPage()) return;

    await loadSettings();
    bindSettingsChanges();
    bindRuntimeMessages();
    startObserver();
    startFallbackScanner();
    startVideoScanner();
    startFrameSampler();

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        scheduleScan(0);
        bindBestVideo();
        sampleCurrentFrame(true);
      }
    });
    window.addEventListener("pageshow", () => scheduleScan(0));
    window.addEventListener("popstate", () => scheduleScan(0));

    scheduleScan(0);
  }

  init();
})();
