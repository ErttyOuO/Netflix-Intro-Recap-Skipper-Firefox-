(() => {
  "use strict";

  const extensionApi = globalThis.browser || globalThis.chrome;
  if (!extensionApi) return;

  // v2.2.0 unified extension - opening/ending learning, bounded detection windows, and timeline endpoint preview.

  const DEFAULT_SETTINGS = Object.freeze({
    autoAgree: true,
    introLearning: true,
    autoSkipIntro: true,
    outroLearning: true,
    autoSkipOutro: true,
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
      skipOnce: "略過這次",
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
      candidateAriaOutro: "片尾快轉學習確認",
      candidateTitleOutro: "要儲存為這部作品的片尾嗎？",
      saveOutro: "儲存片尾資料",
      compactNewEnding: "發現可能的新片尾，要新增嗎？",
      compactSimilarEnding: "這次快轉像片尾 {index}，要更新嗎？",
      compactFullEnding: "已儲存 3 組片尾，要取代片尾 {index} 嗎？",
      addOutroProfile: "新增為片尾 {index}",
      replaceOutroProfile: "取代片尾 {index}",
      updateOutroProfile: "更新片尾 {index}",
      savedOutroTitle: "已儲存這部作品的片尾學習資料",
      savedAddedOutroTitle: "已新增這部作品的另一組片尾",
      savedReplacedOutroTitle: "已更新這部作品的片尾資料",
      autoSkippedOutro: "已自動跳過片尾",
      outroCountdownSkip: "即將跳過片尾",
      outroCountdownNext: "即將到下一集",
      continueOutro: "繼續觀看片尾",
      endAdjustLabel: "片段結束點",
      endAdjustHelp: "按下 ±2 秒會同步移動動畫瘋播放器時間軸，確認是否切得剛好。",
      originalEnd: "原位置",
      adjustMinus2: "−2 秒",
      adjustPlus2: "+2 秒",
      previewEnd: "預覽結束點 {time}",
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
      skipOnce: "略过这次",
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
      candidateAriaOutro: "片尾快转学习确认",
      candidateTitleOutro: "要储存为这部作品的片尾吗？",
      saveOutro: "储存片尾资料",
      compactNewEnding: "发现可能的新片尾，要新增吗？",
      compactSimilarEnding: "这次快转像片尾 {index}，要更新吗？",
      compactFullEnding: "已储存 3 组片尾，要取代片尾 {index} 吗？",
      addOutroProfile: "新增为片尾 {index}",
      replaceOutroProfile: "取代片尾 {index}",
      updateOutroProfile: "更新片尾 {index}",
      savedOutroTitle: "已储存这部作品的片尾学习资料",
      savedAddedOutroTitle: "已新增这部作品的另一组片尾",
      savedReplacedOutroTitle: "已更新这部作品的片尾资料",
      autoSkippedOutro: "已自动跳过片尾",
      outroCountdownSkip: "即将跳过片尾",
      outroCountdownNext: "即将到下一集",
      continueOutro: "继续观看片尾",
      endAdjustLabel: "片段结束点",
      endAdjustHelp: "按下 ±2 秒会同步移动动画疯播放器时间轴，确认是否切得刚好。",
      originalEnd: "原位置",
      adjustMinus2: "−2 秒",
      adjustPlus2: "+2 秒",
      previewEnd: "预览结束点 {time}",
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
      skipOnce: "Ignore this seek",
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
      candidateAriaOutro: "Ending skip learning confirmation",
      candidateTitleOutro: "Save this as the ending for this title?",
      saveOutro: "Save ending",
      compactNewEnding: "Possible new ending found. Add it?",
      compactSimilarEnding: "This seek looks like ending {index}. Update it?",
      compactFullEnding: "Three endings are saved. Replace ending {index}?",
      addOutroProfile: "Add as ending {index}",
      replaceOutroProfile: "Replace ending {index}",
      updateOutroProfile: "Update ending {index}",
      savedOutroTitle: "Ending learning data saved for this title",
      savedAddedOutroTitle: "Another ending was added for this title",
      savedReplacedOutroTitle: "Ending data updated for this title",
      autoSkippedOutro: "Ending auto-skipped",
      outroCountdownSkip: "Skipping ending soon",
      outroCountdownNext: "Next episode soon",
      continueOutro: "Keep watching ending",
      endAdjustLabel: "Segment end point",
      endAdjustHelp: "Press ±2 sec to move the Bahamut player timeline to that endpoint and verify the cut.",
      originalEnd: "Original",
      adjustMinus2: "−2 sec",
      adjustPlus2: "+2 sec",
      previewEnd: "Preview endpoint {time}",
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
  // v2.2.0: automatic opening matching is intentionally limited to the first
  // 3 minutes. Ending matching runs only in the final 4 minutes of the video.
  const FRAME_SAMPLE_MS = 240;
  const LEARNING_SAMPLE_MS = 1000;
  const INTRO_SCAN_END_SECONDS = 3 * 60;
  const OUTRO_SCAN_LEAD_SECONDS = 4 * 60;
  const OUTRO_SCAN_FALLBACK_START_SECONDS = 20 * 60;
  const OUTRO_NEAR_END_SECONDS = 5;
  const OUTRO_NEXT_COUNTDOWN_SECONDS = 4;
  const OUTRO_SKIP_COUNTDOWN_SECONDS = 2;
  const SEEK_SETTLE_MS = 1500;
  const CANDIDATE_LIFETIME_MS = 5000;
  const MAX_PROFILES_PER_WORK = 3;
  const FRAME_HISTORY_MS = 2400;
  const FRAME_HISTORY_MAX = 10;

  // Multi-level visual matching. The bounded search windows make the softer
  // vote tier safe without relying on a fixed learned timestamp.
  const AUTO_MATCH_SOFT_THRESHOLD = 0.84;
  const AUTO_MATCH_MEDIUM_THRESHOLD = 0.88;
  const AUTO_MATCH_STRONG_THRESHOLD = 0.93;
  const AUTO_MATCH_CONFIRM_WINDOW_MS = 1900;
  const AUTO_MATCH_REQUIRED_SCORE = 3;
  const AUTO_MATCH_REQUIRED_HITS = 2;
  const AUTO_SKIP_SUPPRESS_LEARNING_MS = 3500;
  const AUTO_SKIP_TOAST_MS = 3200;
  const PROMPT_HISTORY_KEY = "bahamutLearningPromptHistoryV2";

  let settings = { ...DEFAULT_SETTINGS };
  let observer = null;
  let scanTimer = null;
  let fallbackTimer = null;
  let videoScanTimer = null;
  let frameSampleTimer = null;
  let frameSampleIntervalMs = null;
  let lastButton = null;
  let lastClickAt = 0;
  let lastUrl = location.href;

  let activeVideo = null;
  let lastStableTime = null;
  let lastFrame = null;
  let frameHistory = [];
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

  let introProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
  let outroProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
  let matcherBusy = false;
  let matchVotes = new Map();
  let outroMatchVotes = new Map();
  let autoSkipPerformedEpisodeKey = null;
  let outroActionEpisodeKey = null;
  let outroActionStatus = null;
  let suppressLearningUntil = 0;
  let lastAutoSkip = null;
  let lastMatchProbe = null;
  let lastOutroAction = null;
  let lastOutroMatchProbe = null;
  let promptHistoryCache = null;
  let outroCountdownCard = null;
  let outroCountdownTimer = null;

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

  function isIntroWindowAt(currentTime) {
    return Number.isFinite(Number(currentTime)) && Number(currentTime) >= 0 && Number(currentTime) <= INTRO_SCAN_END_SECONDS;
  }

  function getOutroScanStart(video = activeVideo) {
    const duration = Number(video?.duration);
    if (Number.isFinite(duration) && duration > 0) {
      return Math.max(INTRO_SCAN_END_SECONDS + 1, duration - OUTRO_SCAN_LEAD_SECONDS);
    }
    return OUTRO_SCAN_FALLBACK_START_SECONDS;
  }

  function isOutroWindowAt(currentTime, video = activeVideo) {
    const time = Number(currentTime);
    if (!Number.isFinite(time)) return false;
    const start = getOutroScanStart(video);
    const duration = Number(video?.duration);
    if (Number.isFinite(duration) && duration > 0) return time >= start && time < Math.max(start, duration - 0.25);
    return time >= start;
  }

  function classifyLearningKind(fromTime, video = activeVideo) {
    if (settings.introLearning && isIntroWindowAt(fromTime)) return "intro";
    if (settings.outroLearning && isOutroWindowAt(fromTime, video)) return "outro";
    return null;
  }

  function profileStorageKey(kind) {
    return kind === "outro" ? "outroProfiles" : "introProfiles";
  }

  function getProfileCache(kind) {
    return kind === "outro" ? outroProfilesCache : introProfilesCache;
  }

  function setProfileCache(kind, value) {
    if (kind === "outro") outroProfilesCache = value;
    else introProfilesCache = value;
  }

  async function getProfiles(kind) {
    const key = profileStorageKey(kind);
    const result = await extensionApi.storage.local.get({ [key]: {} });
    return result[key] && typeof result[key] === "object" ? result[key] : {};
  }

  async function getIntroProfiles() {
    return getProfiles("intro");
  }

  async function getOutroProfiles() {
    return getProfiles("outro");
  }

  async function getCurrentProfileEntry(kind, force = false) {
    const work = identifyWork();
    const cache = getProfileCache(kind);
    if (!force && cache.workKey === work.key && cache.loadedAt > 0) {
      return { work, entry: cache.entry };
    }

    const all = await getProfiles(kind);
    const entry = all[work.key] || null;
    setProfileCache(kind, { workKey: work.key, entry, loadedAt: Date.now() });
    return { work, entry };
  }

  function promptEpisodeId(work) {
    return `${work?.key || "unknown"}|${work?.episodeKey || location.pathname + location.search}`;
  }

  async function getPromptHistory(force = false) {
    if (!force && promptHistoryCache && typeof promptHistoryCache === "object") return promptHistoryCache;
    const result = await extensionApi.storage.local.get({ [PROMPT_HISTORY_KEY]: {} });
    const history = result[PROMPT_HISTORY_KEY];
    promptHistoryCache = history && typeof history === "object" ? history : {};
    return promptHistoryCache;
  }

  async function candidateAlreadyHandled(candidate) {
    const history = await getPromptHistory(false);
    const items = Array.isArray(history[promptEpisodeId(candidate.work)]) ? history[promptEpisodeId(candidate.work)] : [];
    return items.some((item) =>
      item?.kind === candidate.kind &&
      Math.abs(Number(item.fromTime) - Number(candidate.fromTime)) <= 3 &&
      Math.abs(Number(item.originalToTime) - Number(candidate.originalToTime ?? candidate.toTime)) <= 3
    );
  }

  async function recordCandidateHandled(candidate, status) {
    if (!candidate?.work || !candidate?.kind) return;
    const history = { ...(await getPromptHistory(false)) };
    const id = promptEpisodeId(candidate.work);
    const items = Array.isArray(history[id]) ? [...history[id]] : [];
    items.push({
      kind: candidate.kind,
      fromTime: Number(candidate.fromTime || 0),
      originalToTime: Number(candidate.originalToTime ?? candidate.toTime ?? 0),
      status,
      at: Date.now()
    });
    history[id] = items.slice(-12);
    promptHistoryCache = history;
    await extensionApi.storage.local.set({ [PROMPT_HISTORY_KEY]: history });
  }

  function resetMatcherForNavigation() {
    introProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
    outroProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
    matchVotes = new Map();
    outroMatchVotes = new Map();
    autoSkipPerformedEpisodeKey = null;
    outroActionEpisodeKey = null;
    outroActionStatus = null;
    lastAutoSkip = null;
    lastMatchProbe = null;
    lastOutroAction = null;
    lastOutroMatchProbe = null;
    promptHistoryCache = null;
    removeOutroCountdown();
  }

  function evaluateProfileMatch(frameFingerprint, profile, voteMap, now) {
    const similarity = bestSimilarity(frameFingerprint, profile);
    const profileId = profile.id || `${profile.createdAt || 0}:${profile.startTimeHint || 0}`;
    const previous = voteMap.get(profileId);
    const stillInWindow = previous && now - previous.lastAt <= AUTO_MATCH_CONFIRM_WINDOW_MS;
    let voteScore = stillInWindow ? Number(previous.score || 0) : 0;
    let hitCount = stillInWindow ? Number(previous.hits || 0) : 0;
    let bestVote = stillInWindow ? Number(previous.best || 0) : 0;
    let shouldTrigger = similarity >= AUTO_MATCH_STRONG_THRESHOLD;
    let matchLevel = shouldTrigger ? "strong" : "none";

    if (!shouldTrigger && similarity >= AUTO_MATCH_SOFT_THRESHOLD) {
      const points = similarity >= AUTO_MATCH_MEDIUM_THRESHOLD ? 2 : 1;
      voteScore += points;
      hitCount += 1;
      bestVote = Math.max(bestVote, similarity);
      matchLevel = similarity >= AUTO_MATCH_MEDIUM_THRESHOLD ? "medium" : "soft";
      voteMap.set(profileId, { score: voteScore, hits: hitCount, lastAt: now, best: bestVote });
      shouldTrigger = voteScore >= AUTO_MATCH_REQUIRED_SCORE && hitCount >= AUTO_MATCH_REQUIRED_HITS;
    } else if (shouldTrigger) {
      voteScore = Math.max(voteScore, AUTO_MATCH_REQUIRED_SCORE);
      hitCount = Math.max(hitCount, 1);
      bestVote = Math.max(bestVote, similarity);
      voteMap.set(profileId, { score: voteScore, hits: hitCount, lastAt: now, best: bestVote });
    } else if (previous && now - previous.lastAt > AUTO_MATCH_CONFIRM_WINDOW_MS) {
      voteMap.delete(profileId);
      voteScore = 0;
      hitCount = 0;
      bestVote = 0;
    }

    return { similarity, profileId, voteScore, hitCount, bestVote, matchLevel, shouldTrigger };
  }

  async function maybeAutoSkipIntro(frame) {
    if (!settings.autoSkipIntro || !frame?.fingerprint || !activeVideo || activeVideo.paused) return;
    if (activeVideo.seeking || matcherBusy) return;
    if (!isIntroWindowAt(activeVideo.currentTime)) return;

    const work = identifyWork();
    if (autoSkipPerformedEpisodeKey === work.episodeKey) return;

    matcherBusy = true;
    try {
      const { entry } = await getCurrentProfileEntry("intro", false);
      const profiles = Array.isArray(entry?.profiles) ? entry.profiles : [];
      if (!profiles.length) return;

      const now = performance.now();
      let bestProbe = null;
      for (const profile of profiles) {
        const duration = Number(profile?.duration);
        if (!Number.isFinite(duration) || duration <= 0) continue;
        const result = evaluateProfileMatch(frame.fingerprint, profile, matchVotes, now);

        if (!bestProbe || result.similarity > bestProbe.similarity) {
          bestProbe = {
            at: Date.now(), workKey: work.key, episodeKey: work.episodeKey,
            mediaTime: Number(activeVideo.currentTime.toFixed(3)),
            similarity: Number(result.similarity.toFixed(4)), profileId: result.profileId,
            matchLevel: result.matchLevel, voteScore: result.voteScore, hitCount: result.hitCount,
            requiredScore: AUTO_MATCH_REQUIRED_SCORE, requiredHits: AUTO_MATCH_REQUIRED_HITS,
            sampleIntervalMs: frameSampleIntervalMs || FRAME_SAMPLE_MS,
            scanWindow: `0-${INTRO_SCAN_END_SECONDS}`
          };
        }
        if (!result.shouldTrigger) continue;

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
          at: Date.now(), workKey: work.key, episodeKey: work.episodeKey,
          fromTime: from, toTime: to, duration,
          similarity: Number(result.similarity.toFixed(4)), profileId: result.profileId,
          matchLevel: result.matchLevel, voteScore: result.voteScore, hitCount: result.hitCount
        };
        showToast(t("autoSkipped", { duration: formatDuration(duration) }));
        updateFrameSamplerState();
        break;
      }
      if (bestProbe) lastMatchProbe = bestProbe;
    } finally {
      matcherBusy = false;
    }
  }

  function positionCardAtVideoBottomRight(node) {
    if (!node || !activeVideo) return;
    const rect = activeVideo.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const right = Math.max(12, window.innerWidth - rect.right + 16);
    const bottom = Math.max(12, window.innerHeight - rect.bottom + 16);
    node.style.right = `${right}px`;
    node.style.bottom = `${bottom}px`;
  }

  function removeOutroCountdown() {
    if (outroCountdownTimer !== null) {
      clearInterval(outroCountdownTimer);
      outroCountdownTimer = null;
    }
    if (outroCountdownCard) {
      outroCountdownCard.remove();
      outroCountdownCard = null;
    }
  }

  function finishOutroAction(work, target, mode, profileMatch) {
    if (!activeVideo || identifyWork().episodeKey !== work.episodeKey) return;
    suppressLearningUntil = performance.now() + AUTO_SKIP_SUPPRESS_LEARNING_MS;
    seekSession = null;
    const duration = Number(activeVideo.duration);
    if (mode === "next") {
      const endTarget = Number.isFinite(duration) && duration > 0 ? Math.max(0, duration - 0.12) : target;
      activeVideo.currentTime = endTarget;
      activeVideo.play?.().catch?.(() => {});
    } else {
      activeVideo.currentTime = target;
      activeVideo.play?.().catch?.(() => {});
      showToast(t("autoSkippedOutro"));
    }
    outroActionStatus = mode === "next" ? "next" : "skipped";
    lastOutroAction = {
      at: Date.now(), workKey: work.key, episodeKey: work.episodeKey,
      targetTime: target, mode, similarity: Number(profileMatch.similarity.toFixed(4)),
      profileId: profileMatch.profileId
    };
    removeOutroCountdown();
    updateFrameSamplerState();
  }

  function getOutroCountdownPlan(target, duration) {
    const remainingAfterSkip = Number.isFinite(Number(duration)) ? Math.max(0, Number(duration) - Number(target)) : Number.POSITIVE_INFINITY;
    const nearEnd = remainingAfterSkip < OUTRO_NEAR_END_SECONDS;
    return {
      remainingAfterSkip,
      nearEnd,
      mode: nearEnd ? "next" : "skip",
      countdownSeconds: nearEnd ? OUTRO_NEXT_COUNTDOWN_SECONDS : OUTRO_SKIP_COUNTDOWN_SECONDS
    };
  }

  function showOutroCountdown(work, target, profileMatch) {
    removeOutroCountdown();
    const duration = Number(activeVideo?.duration);
    const plan = getOutroCountdownPlan(target, duration);
    const nearEnd = plan.nearEnd;
    let secondsLeft = plan.countdownSeconds;
    const mode = plan.mode;

    outroActionEpisodeKey = work.episodeKey;
    outroActionStatus = "pending";
    updateFrameSamplerState();

    const card = document.createElement("aside");
    card.className = "bahamut-helper-outro-countdown";
    card.setAttribute("role", "status");
    card.innerHTML = `
      <div class="bahamut-helper-outro-copy">
        <strong>${escapeHtml(nearEnd ? t("outroCountdownNext") : t("outroCountdownSkip"))}</strong>
        <span data-countdown>${secondsLeft}</span>
      </div>
      <button type="button" data-action="continue-outro">${escapeHtml(t("continueOutro"))}</button>
    `;
    getCardMountPoint().appendChild(card);
    outroCountdownCard = card;
    positionCardAtVideoBottomRight(card);
    requestAnimationFrame(() => card.classList.add("is-visible"));

    card.querySelector('[data-action="continue-outro"]')?.addEventListener("click", () => {
      outroActionStatus = "cancelled";
      lastOutroAction = { at: Date.now(), workKey: work.key, episodeKey: work.episodeKey, mode: "cancelled" };
      removeOutroCountdown();
      updateFrameSamplerState();
    });

    outroCountdownTimer = setInterval(() => {
      secondsLeft -= 1;
      const node = card.querySelector("[data-countdown]");
      if (node) node.textContent = String(Math.max(0, secondsLeft));
      if (secondsLeft <= 0) {
        clearInterval(outroCountdownTimer);
        outroCountdownTimer = null;
        finishOutroAction(work, target, mode, profileMatch);
      }
    }, 1000);
  }

  async function maybeAutoSkipOutro(frame) {
    if (!settings.autoSkipOutro || !frame?.fingerprint || !activeVideo || activeVideo.paused) return;
    if (activeVideo.seeking || matcherBusy || !isOutroWindowAt(activeVideo.currentTime, activeVideo)) return;

    const work = identifyWork();
    if (outroActionEpisodeKey === work.episodeKey) return;

    matcherBusy = true;
    try {
      const { entry } = await getCurrentProfileEntry("outro", false);
      const profiles = Array.isArray(entry?.profiles) ? entry.profiles : [];
      if (!profiles.length) return;
      const now = performance.now();
      let bestProbe = null;

      for (const profile of profiles) {
        const duration = Number(profile?.duration);
        if (!Number.isFinite(duration) || duration <= 0) continue;
        const result = evaluateProfileMatch(frame.fingerprint, profile, outroMatchVotes, now);
        if (!bestProbe || result.similarity > bestProbe.similarity) {
          bestProbe = {
            at: Date.now(), workKey: work.key, episodeKey: work.episodeKey,
            mediaTime: Number(activeVideo.currentTime.toFixed(3)),
            similarity: Number(result.similarity.toFixed(4)), profileId: result.profileId,
            matchLevel: result.matchLevel, voteScore: result.voteScore, hitCount: result.hitCount,
            requiredScore: AUTO_MATCH_REQUIRED_SCORE, requiredHits: AUTO_MATCH_REQUIRED_HITS,
            sampleIntervalMs: frameSampleIntervalMs || FRAME_SAMPLE_MS,
            scanWindowStart: Number(getOutroScanStart(activeVideo).toFixed(3))
          };
        }
        if (!result.shouldTrigger) continue;

        const from = activeVideo.currentTime;
        let target = from + duration;
        const videoDuration = Number(activeVideo.duration);
        if (Number.isFinite(videoDuration) && videoDuration > 0) {
          target = Math.min(target, Math.max(0, videoDuration - 0.12));
        }
        if (!(target > from + 1)) return;
        showOutroCountdown(work, target, result);
        break;
      }
      if (bestProbe) lastOutroMatchProbe = bestProbe;
    } finally {
      matcherBusy = false;
    }
  }

  function desiredFrameSampleInterval() {
    if (!activeVideo || activeVideo.paused || activeVideo.seeking || activeVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return null;
    const work = identifyWork();
    const time = Number(activeVideo.currentTime);
    const introWindow = isIntroWindowAt(time);
    const outroWindow = isOutroWindowAt(time, activeVideo);
    const introAuto = introWindow && settings.autoSkipIntro && autoSkipPerformedEpisodeKey !== work.episodeKey;
    const outroAuto = outroWindow && settings.autoSkipOutro && outroActionEpisodeKey !== work.episodeKey;
    if (introAuto || outroAuto) return FRAME_SAMPLE_MS;
    const learningOnly = (introWindow && settings.introLearning) ||
      (outroWindow && settings.outroLearning && outroActionEpisodeKey !== work.episodeKey);
    return learningOnly ? LEARNING_SAMPLE_MS : null;
  }

  function stopFrameSampler() {
    if (frameSampleTimer !== null) {
      clearInterval(frameSampleTimer);
      frameSampleTimer = null;
    }
    frameSampleIntervalMs = null;
  }

  function updateFrameSamplerState({ sampleNow = false } = {}) {
    const desired = desiredFrameSampleInterval();
    if (!desired) {
      stopFrameSampler();
      return;
    }
    if (frameSampleTimer === null || frameSampleIntervalMs !== desired) {
      stopFrameSampler();
      frameSampleIntervalMs = desired;
      frameSampleTimer = setInterval(sampleCurrentFrame, desired);
      sampleNow = true;
    }
    if (sampleNow) setTimeout(() => sampleCurrentFrame(true), 0);
  }

  function sampleCurrentFrame(force = false) {
    if (!activeVideo || activeVideo.seeking || activeVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    if (!force && activeVideo.paused) return;
    const work = identifyWork();
    const introWindow = isIntroWindowAt(activeVideo.currentTime);
    const outroWindow = isOutroWindowAt(activeVideo.currentTime, activeVideo);
    const introAuto = introWindow && settings.autoSkipIntro && autoSkipPerformedEpisodeKey !== work.episodeKey;
    const outroAuto = outroWindow && settings.autoSkipOutro && outroActionEpisodeKey !== work.episodeKey;
    const learningActive = (introWindow && settings.introLearning) ||
      (outroWindow && settings.outroLearning && outroActionEpisodeKey !== work.episodeKey);
    if (!force && !introAuto && !outroAuto && !learningActive) return;

    const frame = captureVideoFrame(activeVideo, { withPreview: learningActive });
    if (frame) {
      lastFrame = frame;
      addFrameToHistory(frame);
      if (introAuto) maybeAutoSkipIntro(frame).catch((error) => console.warn("[動畫瘋自動播放助手] 自動片頭辨識失敗。", error));
      if (outroAuto) maybeAutoSkipOutro(frame).catch((error) => console.warn("[動畫瘋自動播放助手] 自動片尾辨識失敗。", error));
    }
  }

  function beginSeekSession(video) {
    if ((!settings.introLearning && !settings.outroLearning) || performance.now() < suppressLearningUntil) return;

    if (!seekSession) {
      const fromTime = Number.isFinite(lastStableTime) ? lastStableTime : Number(lastFrame?.mediaTime);
      const kind = classifyLearningKind(fromTime, video);
      if (!kind) return;

      let frame = lastFrame;
      if (!frame || !Number.isFinite(Number(frame.mediaTime)) || Math.abs(Number(frame.mediaTime) - Number(fromTime)) > 2.5) {
        frame = null;
      }

      seekSession = {
        startedAt: performance.now(),
        fromTime,
        toTime: video.currentTime,
        eventCount: 1,
        kind,
        frame: frame ? { ...frame } : null,
        history: frameHistory.filter((item) => Math.abs(Number(item.mediaTime) - Number(fromTime)) <= 3).map((item) => ({ ...item })),
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

  async function finalizeSeekSession() {
    const session = seekSession;
    seekSession = null;
    if (!session || performance.now() < suppressLearningUntil) return;

    const toTime = Number(session.toTime);
    const fromTime = Number(session.fromTime);
    const duration = toTime - fromTime;
    const kind = session.kind || classifyLearningKind(fromTime, activeVideo);
    if (!kind) return;
    if (kind === "intro" && !settings.introLearning) return;
    if (kind === "outro" && !settings.outroLearning) return;
    if (!Number.isFinite(duration) || duration < settings.minLearnSkipSeconds || duration > 15 * 60) return;

    const work = session.work || identifyWork();
    if (activeCandidate?.work?.episodeKey === work.episodeKey) return;

    const allProfiles = await getProfiles(kind);
    const existingEntry = allProfiles[work.key] || null;
    const existingProfiles = Array.isArray(existingEntry?.profiles) ? existingEntry.profiles : [];
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
      kind,
      work,
      fromTime,
      originalToTime: toTime,
      toTime,
      adjustmentSeconds: 0,
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

    if (await candidateAlreadyHandled(candidate)) return;
    showCandidateCard(candidate);
  }

  function candidateAdjustedToTime(candidate, adjustmentSeconds) {
    let to = Number(candidate.originalToTime) + Number(adjustmentSeconds || 0);
    const min = Number(candidate.fromTime) + 1;
    const duration = Number(activeVideo?.duration);
    const max = Number.isFinite(duration) && duration > 0 ? Math.max(min, duration - 0.12) : Number.POSITIVE_INFINITY;
    return clamp(to, min, max);
  }

  function applyCandidateAdjustment(candidate, adjustmentSeconds, { preview = true } = {}) {
    const adjustment = clamp(Number(adjustmentSeconds) || 0, -2, 2);
    const to = candidateAdjustedToTime(candidate, adjustment);
    candidate.adjustmentSeconds = adjustment;
    candidate.toTime = to;
    candidate.duration = to - Number(candidate.fromTime);

    if (preview && activeVideo && identifyWork().episodeKey === candidate.work.episodeKey) {
      suppressLearningUntil = performance.now() + 2500;
      seekSession = null;
      if (seekSettleTimer !== null) {
        clearTimeout(seekSettleTimer);
        seekSettleTimer = null;
      }
      activeVideo.currentTime = to;
    }
    return candidate;
  }

  async function saveCandidate(candidate, mode = "add", replaceIndex = 0) {
    if (!candidate?.frame?.fingerprint || !candidate?.kind) return { ok: false, reason: "NO_FRAME" };

    const all = await getProfiles(candidate.kind);
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
      id: `${candidate.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: candidate.kind,
      createdAt: Date.now(),
      duration: Number(candidate.duration.toFixed(3)),
      startTimeHint: Number(candidate.fromTime.toFixed(3)),
      endTimeHint: Number(candidate.toTime.toFixed(3)),
      adjustmentSeconds: Number(candidate.adjustmentSeconds || 0),
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
      if (currentProfiles.length >= MAX_PROFILES_PER_WORK) return { ok: false, reason: "FULL" };
      currentProfiles.push(profile);
      savedMode = "add";
      savedIndex = currentProfiles.length - 1;
    }

    existing.profiles = currentProfiles;
    all[candidate.work.key] = existing;
    await extensionApi.storage.local.set({ [profileStorageKey(candidate.kind)]: all });
    setProfileCache(candidate.kind, { workKey: candidate.work.key, entry: existing, loadedAt: Date.now() });
    if (candidate.kind === "outro") outroMatchVotes = new Map();
    else matchVotes = new Map();
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

    const isOutro = candidate.kind === "outro";
    const card = document.createElement("aside");
    card.className = "bahamut-helper-candidate";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", t(isOutro ? "candidateAriaOutro" : "candidateAria"));

    const frameAvailable = Boolean(candidate.frame?.previewDataUrl && candidate.frame?.fingerprint);
    const existingCount = Number(candidate.existingProfilesCount) || 0;
    const similarIndex = Number.isInteger(candidate.bestExistingIndex) && candidate.bestExistingIndex >= 0
      ? candidate.bestExistingIndex
      : 0;
    const isSimilar = existingCount > 0 && Number(candidate.bestExistingSimilarity) >= AUTO_MATCH_SOFT_THRESHOLD;
    const canAdd = existingCount < MAX_PROFILES_PER_WORK;
    const isExistingPrompt = existingCount > 0;

    const adjustControls = `
      <div class="bahamut-helper-adjust-panel">
        <div class="bahamut-helper-adjust-head">
          <span>${escapeHtml(t("endAdjustLabel"))}</span>
          <strong data-preview-end>${escapeHtml(t("previewEnd", { time: formatTime(candidate.toTime) }))}</strong>
        </div>
        <div class="bahamut-helper-adjust-buttons" role="group" aria-label="${escapeHtml(t("endAdjustLabel"))}">
          <button type="button" data-adjust="-2">${escapeHtml(t("adjustMinus2"))}</button>
          <button type="button" data-adjust="0" class="is-active">${escapeHtml(t("originalEnd"))}</button>
          <button type="button" data-adjust="2">${escapeHtml(t("adjustPlus2"))}</button>
        </div>
        <div class="bahamut-helper-adjust-help">${escapeHtml(t("endAdjustHelp"))}</div>
      </div>`;

    if (isExistingPrompt) {
      card.classList.add("is-compact-existing");
      const compactTitle = isOutro
        ? (isSimilar ? t("compactSimilarEnding", { index: similarIndex + 1 }) : canAdd ? t("compactNewEnding") : t("compactFullEnding", { index: similarIndex + 1 }))
        : (isSimilar ? t("compactSimilarOpening", { index: similarIndex + 1 }) : canAdd ? t("compactNewOpening") : t("compactFullOpening", { index: similarIndex + 1 }));
      const primaryAction = isSimilar || !canAdd ? "replace" : "add";
      const primaryIndex = isSimilar || !canAdd ? similarIndex : 0;
      const primaryLabel = isOutro
        ? (isSimilar ? t("updateOutroProfile", { index: similarIndex + 1 }) : canAdd ? t("addOutroProfile", { index: existingCount + 1 }) : t("replaceOutroProfile", { index: similarIndex + 1 }))
        : (isSimilar ? t("updateIntroProfile", { index: similarIndex + 1 }) : canAdd ? t("addIntroProfile", { index: existingCount + 1 }) : t("replaceIntroProfile", { index: similarIndex + 1 }));

      card.innerHTML = `
        <div class="bahamut-helper-compact-row">
          <div class="bahamut-helper-compact-title">${escapeHtml(compactTitle)}</div>
          <div class="bahamut-helper-compact-actions">
            <button class="bahamut-helper-primary" data-action="${primaryAction}" data-replace-index="${primaryIndex}" type="button" ${frameAvailable ? "" : "disabled"}>${escapeHtml(primaryLabel)}</button>
            <button class="bahamut-helper-secondary" data-action="skip" type="button">${escapeHtml(t("skipOnce"))}</button>
            <button class="bahamut-helper-ghost" data-action="later" type="button">${escapeHtml(t("askLater"))}</button>
          </div>
        </div>
        <div class="bahamut-helper-time-row bahamut-helper-time-row--compact">
          <span data-from-to>${formatTime(candidate.fromTime)} → ${formatTime(candidate.toTime)}</span>
          <strong data-skip-duration>${escapeHtml(t("skipLabel", { duration: formatDuration(candidate.duration) }))}</strong>
        </div>
        ${adjustControls}
        <div class="bahamut-helper-progress"><span></span></div>
      `;
    } else {
      const preview = frameAvailable
        ? `<img class="bahamut-helper-preview" src="${candidate.frame.previewDataUrl}" alt="${escapeHtml(t("previewAlt"))}">`
        : `<div class="bahamut-helper-preview bahamut-helper-preview--empty">${escapeHtml(t("previewUnavailable"))}</div>`;
      const capabilityNote = frameAvailable
        ? t("capabilityOk")
        : candidate.frameCapability.status === "blocked" ? t("capabilityBlocked") : t("capabilityMissing");

      card.innerHTML = `
        <div class="bahamut-helper-card-head">
          <div>
            <div class="bahamut-helper-eyebrow">${escapeHtml(t("candidateEyebrow"))}</div>
            <div class="bahamut-helper-title">${escapeHtml(t(isOutro ? "candidateTitleOutro" : "candidateTitle"))}</div>
          </div>
          <button class="bahamut-helper-close" type="button" aria-label="${escapeHtml(t("close"))}">×</button>
        </div>
        <div class="bahamut-helper-candidate-body">
          ${preview}
          <div class="bahamut-helper-candidate-copy">
            <div class="bahamut-helper-work">${escapeHtml(candidate.work.title)}</div>
            <div class="bahamut-helper-time-row">
              <span data-from-to>${formatTime(candidate.fromTime)} → ${formatTime(candidate.toTime)}</span>
              <strong data-skip-duration>${escapeHtml(t("skipLabel", { duration: formatDuration(candidate.duration) }))}</strong>
            </div>
          </div>
        </div>
        ${adjustControls}
        <div class="bahamut-helper-capability ${frameAvailable ? "is-ok" : "is-warning"}">${escapeHtml(capabilityNote)}</div>
        <div class="bahamut-helper-actions has-three">
          <button class="bahamut-helper-primary" data-action="add" type="button" ${frameAvailable ? "" : "disabled"}>${escapeHtml(t(isOutro ? "saveOutro" : "saveIntro"))}</button>
          <button class="bahamut-helper-secondary" data-action="skip" type="button">${escapeHtml(t("skipOnce"))}</button>
          <button class="bahamut-helper-ghost" data-action="later" type="button">${escapeHtml(t("askLater"))}</button>
        </div>
        <div class="bahamut-helper-progress"><span></span></div>
      `;
    }

    getCardMountPoint().appendChild(card);
    candidateCard = card;

    const restartExpiry = () => {
      if (candidateExpireTimer !== null) clearTimeout(candidateExpireTimer);
      candidateExpireTimer = setTimeout(() => {
        candidateExpireTimer = null;
        recordCandidateHandled(candidate, "dismissed").catch(() => {});
        fadeCandidateCard(false);
      }, CANDIDATE_LIFETIME_MS);
    };

    const updateAdjustmentUi = () => {
      const fromTo = card.querySelector("[data-from-to]");
      const durationNode = card.querySelector("[data-skip-duration]");
      const endNode = card.querySelector("[data-preview-end]");
      if (fromTo) fromTo.textContent = `${formatTime(candidate.fromTime)} → ${formatTime(candidate.toTime)}`;
      if (durationNode) durationNode.textContent = t("skipLabel", { duration: formatDuration(candidate.duration) });
      if (endNode) endNode.textContent = t("previewEnd", { time: formatTime(candidate.toTime) });
      for (const button of card.querySelectorAll("[data-adjust]")) {
        button.classList.toggle("is-active", Number(button.dataset.adjust) === Number(candidate.adjustmentSeconds || 0));
      }
    };

    for (const button of card.querySelectorAll("[data-adjust]")) {
      button.addEventListener("click", () => {
        applyCandidateAdjustment(candidate, Number(button.dataset.adjust), { preview: true });
        updateAdjustmentUi();
        restartExpiry();
      });
    }

    const dismissCandidate = async () => {
      if (candidateExpireTimer !== null) {
        clearTimeout(candidateExpireTimer);
        candidateExpireTimer = null;
      }
      await recordCandidateHandled(candidate, "dismissed");
      fadeCandidateCard(false);
    };

    card.querySelector(".bahamut-helper-close")?.addEventListener("click", () => dismissCandidate().catch(() => removeCandidateCard()));
    card.querySelector('[data-action="skip"]')?.addEventListener("click", () => dismissCandidate().catch(() => removeCandidateCard()));
    card.querySelector('[data-action="later"]')?.addEventListener("click", () => {
      if (candidateExpireTimer !== null) {
        clearTimeout(candidateExpireTimer);
        candidateExpireTimer = null;
      }
      fadeCandidateCard(false);
    });

    async function runSave(button, mode, replaceIndex = 0) {
      if (!frameAvailable || !button || button.disabled) return;
      if (candidateExpireTimer !== null) {
        clearTimeout(candidateExpireTimer);
        candidateExpireTimer = null;
      }

      const actionButtons = [...card.querySelectorAll("[data-action], [data-adjust]")];
      actionButtons.forEach((node) => { node.disabled = true; });
      const originalText = button.textContent;
      button.textContent = t("saving");

      try {
        const result = await saveCandidate(candidate, mode, replaceIndex);
        if (result.ok) {
          await recordCandidateHandled(candidate, "completed");
          card.classList.add("is-saved");
          const titleNode = card.querySelector(card.classList.contains("is-compact-existing") ? ".bahamut-helper-compact-title" : ".bahamut-helper-title");
          if (titleNode) {
            titleNode.textContent = isOutro
              ? (result.mode === "replace" ? t("savedReplacedOutroTitle") : existingCount > 0 ? t("savedAddedOutroTitle") : t("savedOutroTitle"))
              : (result.mode === "replace" ? t("savedReplacedTitle") : existingCount > 0 ? t("savedAddedTitle") : t("savedTitle"));
          }
          card.querySelector(".bahamut-helper-compact-actions")?.remove();
          card.querySelector(".bahamut-helper-actions")?.remove();
          card.querySelector(".bahamut-helper-adjust-panel")?.remove();
          candidateExpireTimer = setTimeout(() => fadeCandidateCard(false), 1200);
        } else {
          actionButtons.forEach((node) => { node.disabled = false; });
          button.textContent = originalText;
        }
      } catch (error) {
        console.warn(`[動畫瘋自動播放助手] 儲存${isOutro ? "片尾" : "片頭"}資料失敗。`, error);
        actionButtons.forEach((node) => { node.disabled = false; });
        button.textContent = t("saveRetry");
      }
    }

    card.querySelector('[data-action="add"]')?.addEventListener("click", (event) => runSave(event.currentTarget, "add", 0));
    card.querySelector('[data-action="replace"]')?.addEventListener("click", (event) => {
      const index = Number(event.currentTarget.dataset.replaceIndex) || 0;
      runSave(event.currentTarget, "replace", index);
    });

    requestAnimationFrame(() => card.classList.add("is-visible"));
    restartExpiry();
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
    updateFrameSamplerState();
  }

  function handleSeeking(event) {
    beginSeekSession(event.currentTarget);
  }

  function handleSeeked(event) {
    updateSeekSession(event.currentTarget);
    updateFrameSamplerState({ sampleNow: true });
  }

  function handleLoadedData() {
    lastStableTime = activeVideo?.currentTime ?? null;
    frameHistory = [];
    lastFrame = null;
    setFrameCapability("waiting", t("loadedFrame"));
    updateFrameSamplerState({ sampleNow: true });
  }

  function handlePlay() {
    updateFrameSamplerState({ sampleNow: true });
  }

  function handlePause() {
    stopFrameSampler();
  }

  function unbindVideo() {
    if (!activeVideo) return;
    activeVideo.removeEventListener("timeupdate", handleTimeUpdate);
    activeVideo.removeEventListener("seeking", handleSeeking);
    activeVideo.removeEventListener("seeked", handleSeeked);
    activeVideo.removeEventListener("loadeddata", handleLoadedData);
    activeVideo.removeEventListener("play", handlePlay);
    activeVideo.removeEventListener("pause", handlePause);
    stopFrameSampler();
    removeOutroCountdown();
    activeVideo = null;
    lastStableTime = null;
    lastFrame = null;
    frameHistory = [];
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
    updateFrameSamplerState({ sampleNow: true });
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

  function startObserver() {
    if (observer || !document.documentElement) return;
    observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) { shouldScan = true; break; }
        if (mutation.type === "attributes") { shouldScan = true; break; }
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
        removeOutroCountdown();
        seekSession = null;
        lastFrame = null;
        frameHistory = [];
        resetMatcherForNavigation();
        updateFrameSamplerState({ sampleNow: true });
      }
      clickAgreeIfNeeded();
    }, FALLBACK_SCAN_MS);
  }

  async function loadSettings() {
    try {
      const stored = await extensionApi.storage.local.get(DEFAULT_SETTINGS);
      settings = { ...DEFAULT_SETTINGS, ...stored };
      if (!I18N[settings.language]) settings.language = "zh-TW";
    } catch (error) {
      console.warn("[動畫瘋自動播放助手] 無法讀取設定，使用預設值。", error);
      settings = { ...DEFAULT_SETTINGS };
    }
  }

  function bindSettingsChanges() {
    extensionApi.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") return;

      if (changes.autoAgree) {
        settings.autoAgree = changes.autoAgree.newValue !== false;
        if (settings.autoAgree) scheduleScan(0);
      }
      if (changes.introLearning) {
        settings.introLearning = changes.introLearning.newValue !== false;
        if (!settings.introLearning && activeCandidate?.kind === "intro") removeCandidateCard();
        updateFrameSamplerState({ sampleNow: settings.introLearning });
      }
      if (changes.autoSkipIntro) {
        settings.autoSkipIntro = changes.autoSkipIntro.newValue !== false;
        matchVotes = new Map();
        updateFrameSamplerState({ sampleNow: settings.autoSkipIntro });
      }
      if (changes.outroLearning) {
        settings.outroLearning = changes.outroLearning.newValue !== false;
        if (!settings.outroLearning && activeCandidate?.kind === "outro") removeCandidateCard();
        updateFrameSamplerState({ sampleNow: settings.outroLearning });
      }
      if (changes.autoSkipOutro) {
        settings.autoSkipOutro = changes.autoSkipOutro.newValue !== false;
        outroMatchVotes = new Map();
        if (!settings.autoSkipOutro) removeOutroCountdown();
        updateFrameSamplerState({ sampleNow: settings.autoSkipOutro });
      }
      if (changes.minLearnSkipSeconds) {
        const value = Number(changes.minLearnSkipSeconds.newValue);
        if (Number.isFinite(value)) settings.minLearnSkipSeconds = clamp(value, 5, 180);
      }
      if (changes.language) {
        settings.language = I18N[changes.language.newValue] ? changes.language.newValue : "zh-TW";
        setFrameCapability(frameCapability.status, frameCapability.status === "supported"
          ? t("frameSupported")
          : frameCapability.status === "blocked" ? t("frameBlocked") : frameCapability.reason);
        if (activeCandidate) showCandidateCard(activeCandidate);
      }
      if (changes.introProfiles) {
        introProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
        matchVotes = new Map();
      }
      if (changes.outroProfiles) {
        outroProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
        outroMatchVotes = new Map();
      }
      if (changes[PROMPT_HISTORY_KEY]) promptHistoryCache = null;
    });
  }

  async function getLearningStatus() {
    bindBestVideo();
    const work = identifyWork();
    const [introAll, outroAll] = await Promise.all([getIntroProfiles(), getOutroProfiles()]);
    const introEntry = introAll[work.key];
    const outroEntry = outroAll[work.key];
    const currentTime = Number(activeVideo?.currentTime);
    const introWindowActive = Boolean(activeVideo && isIntroWindowAt(currentTime));
    const outroWindowActive = Boolean(activeVideo && isOutroWindowAt(currentTime, activeVideo));

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
            videoHeight: activeVideo.videoHeight,
            introScanEnd: INTRO_SCAN_END_SECONDS,
            outroScanStart: getOutroScanStart(activeVideo)
          }
        : null,
      frameCapability,
      profileCount: Array.isArray(introEntry?.profiles) ? introEntry.profiles.length : 0,
      introProfileCount: Array.isArray(introEntry?.profiles) ? introEntry.profiles.length : 0,
      outroProfileCount: Array.isArray(outroEntry?.profiles) ? outroEntry.profiles.length : 0,
      introWindowActive,
      outroWindowActive,
      frameSamplerIntervalMs: frameSampleIntervalMs,
      autoSkipPerformedThisEpisode: autoSkipPerformedEpisodeKey === work.episodeKey,
      outroActionThisEpisode: outroActionEpisodeKey === work.episodeKey ? outroActionStatus : null,
      lastAutoSkip,
      lastMatchProbe,
      lastOutroAction,
      lastOutroMatchProbe,
      settings: {
        autoAgree: settings.autoAgree,
        introLearning: settings.introLearning,
        autoSkipIntro: settings.autoSkipIntro,
        outroLearning: settings.outroLearning,
        autoSkipOutro: settings.autoSkipOutro,
        minLearnSkipSeconds: settings.minLearnSkipSeconds,
        language: settings.language
      }
    };
  }

  async function clearCurrentWorkProfiles() {
    const work = identifyWork();
    const [introProfiles, outroProfiles] = await Promise.all([getIntroProfiles(), getOutroProfiles()]);
    const introExisted = Boolean(introProfiles[work.key]);
    const outroExisted = Boolean(outroProfiles[work.key]);
    if (introExisted) delete introProfiles[work.key];
    if (outroExisted) delete outroProfiles[work.key];
    await extensionApi.storage.local.set({ introProfiles, outroProfiles });
    introProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
    outroProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
    matchVotes = new Map();
    outroMatchVotes = new Map();

    const history = { ...(await getPromptHistory(false)) };
    let historyChanged = false;
    for (const [id, items] of Object.entries(history)) {
      if (id.startsWith(`${work.key}|`)) {
        delete history[id];
        historyChanged = true;
      }
    }
    if (historyChanged) {
      promptHistoryCache = history;
      await extensionApi.storage.local.set({ [PROMPT_HISTORY_KEY]: history });
    }
    return { cleared: introExisted || outroExisted, introCleared: introExisted, outroCleared: outroExisted, work };
  }

  function bindRuntimeMessages() {
    extensionApi.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!message) return false;

      let responseTask;
      if (message.type === "scan-now") {
        const clicked = clickAgreeIfNeeded();
        bindBestVideo();
        updateFrameSamplerState({ sampleNow: true });
        responseTask = Promise.resolve({ clicked });
      } else if (message.type === "get-learning-status") {
        responseTask = getLearningStatus();
      } else if (message.type === "unified:getPlatformStatus") {
        responseTask = getLearningStatus().then((status) => ({
          platform: "bahamut",
          active: isTargetPage(),
          ...status
        }));
      } else if (message.type === "test-frame-now") {
        bindBestVideo();
        const frame = activeVideo ? captureVideoFrame(activeVideo, { withPreview: false }) : null;
        responseTask = Promise.resolve({
          videoFound: Boolean(activeVideo),
          captured: Boolean(frame),
          frameCapability,
          work: identifyWork()
        });
      } else if (message.type === "clear-current-work-profiles") {
        responseTask = clearCurrentWorkProfiles();
      } else {
        return false;
      }

      Promise.resolve(responseTask).then(
        (response) => sendResponse(response),
        (error) => sendResponse({ error: error instanceof Error ? error.message : String(error) })
      );
      return true;
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
    updateFrameSamplerState({ sampleNow: true });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        scheduleScan(0);
        bindBestVideo();
        updateFrameSamplerState({ sampleNow: true });
      }
    });
    window.addEventListener("pageshow", () => scheduleScan(0));
    window.addEventListener("popstate", () => scheduleScan(0));

    scheduleScan(0);
  }

  init();
})();
