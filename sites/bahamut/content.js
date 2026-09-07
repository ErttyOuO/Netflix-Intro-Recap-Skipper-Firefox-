(() => {
  "use strict";

  const extensionApi = globalThis.browser || globalThis.chrome;
  if (!extensionApi) return;

  // v2.2.11 unified extension - after an ending is skipped, show an in-player Next Episode button until navigation.

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
      previewAlt: "片段入點的純影片畫面",
      endPreviewAlt: "片段結束點的純影片畫面",
      previewUnavailable: "無法讀取純影片影格",
      candidateEyebrow: "偵測到一次較長快轉",
      candidateTitle: "要儲存為這部作品的片頭嗎？",
      capabilityOk: "已取得純影片畫面，可用於未來視覺辨識。",
      capabilityBlocked: "動畫瘋目前的影片來源觸發 CORS 限制；這次只偵測到快轉時間，暫不允許儲存為自動辨識資料。",
      capabilityMissing: "沒有取得足夠精確的片段入點影格；為避免把前一段劇情誤存成片頭／片尾，這次不允許儲存。",
      capabilityUninformative: "入點畫面資訊較少；儲存時會自動再擷取片段開始後的多張影格，只有取得足夠辨識特徵才會真正儲存。",
      saveIntro: "儲存片頭資料",
      skipEpisode: "略過本集",
      askLater: "稍後再問",
      compactNewOpening: "發現可能的新片頭，要新增嗎？",
      compactSimilarOpening: "這次快轉像片頭 {index}，要更新嗎？",
      compactFullOpening: "已儲存 3 組片頭，要取代片頭 {index} 嗎？",
      saving: "正在建立多影格特徵…",
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
      continueOutro: "移動滑鼠取消倒數・繼續看片尾",
      nextEpisodeButton: "下一集",
      nextEpisodeButtonTitle: "直接前往下一集",
      startAdjustLabel: "片段入點",
      endAdjustLabel: "片段結束點",
      pointAdjustHelp: "點上方的入點／結束圖片選擇要微調的位置；±2 秒可重複累加，播放器時間軸會同步移動。",
      originalEnd: "原位置",
      previewStart: "預覽入點 {time}",
      adjustMinus2: "−2 秒",
      adjustPlus2: "+2 秒",
      previewEnd: "預覽結束點 {time}",
      adjustmentTotal: "目前調整 {offset} 秒",
      overlayCompactIntro: "偵測到片頭候選 · 移入展開",
      overlayCompactOutro: "偵測到片尾候選 · 移入展開",
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
      previewAlt: "片段入点的纯影片画面",
      endPreviewAlt: "片段结束点的纯影片画面",
      previewUnavailable: "无法读取纯影片影格",
      candidateEyebrow: "侦测到一次较长快转",
      candidateTitle: "要储存为这部作品的片头吗？",
      capabilityOk: "已取得纯影片画面，可用于未来视觉辨识。",
      capabilityBlocked: "动画疯目前的影片来源触发 CORS 限制；这次只侦测到快转时间，暂不允许储存为自动辨识资料。",
      capabilityMissing: "没有取得足够精确的片段入点影格；为避免把前一段剧情误存成片头／片尾，这次不允许储存。",
      capabilityUninformative: "入点画面资讯较少；储存时会自动再截取片段开始后的多张影格，只有取得足够辨识特征才会真正储存。",
      saveIntro: "储存片头资料",
      skipEpisode: "略过本集",
      askLater: "稍后再问",
      compactNewOpening: "发现可能的新片头，要新增吗？",
      compactSimilarOpening: "这次快转像片头 {index}，要更新吗？",
      compactFullOpening: "已储存 3 组片头，要取代片头 {index} 吗？",
      saving: "正在建立多影格特征…",
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
      continueOutro: "移动鼠标取消倒数・继续观看片尾",
      nextEpisodeButton: "下一集",
      nextEpisodeButtonTitle: "直接前往下一集",
      startAdjustLabel: "片段入点",
      endAdjustLabel: "片段结束点",
      pointAdjustHelp: "点击上方的入点／结束图片选择要微调的位置；±2 秒可重复累加，播放器时间轴会同步移动。",
      originalEnd: "原位置",
      previewStart: "预览入点 {time}",
      adjustMinus2: "−2 秒",
      adjustPlus2: "+2 秒",
      previewEnd: "预览结束点 {time}",
      adjustmentTotal: "当前调整 {offset} 秒",
      overlayCompactIntro: "侦测到片头候选 · 移入展开",
      overlayCompactOutro: "侦测到片尾候选 · 移入展开",
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
      previewAlt: "Pure video frame at the segment start",
      endPreviewAlt: "Pure video frame at the segment endpoint",
      previewUnavailable: "Unable to read a pure video frame",
      candidateEyebrow: "Long forward seek detected",
      candidateTitle: "Save this as the opening for this title?",
      capabilityOk: "A pure video frame was captured and can be used for future visual matching.",
      capabilityBlocked: "This video source is blocked by CORS. The seek duration was detected, but it cannot be saved for automatic visual matching.",
      capabilityMissing: "No sufficiently precise start frame was captured. To avoid learning story footage before the opening/ending, this seek cannot be saved.",
      capabilityUninformative: "The start frame has little visual detail. Saving will sample several post-start frames and will only succeed if enough reliable anchors are captured.",
      saveIntro: "Save opening",
      skipEpisode: "Skip this episode",
      askLater: "Ask later",
      compactNewOpening: "Possible new opening found. Add it?",
      compactSimilarOpening: "This seek looks like opening {index}. Update it?",
      compactFullOpening: "Three openings are saved. Replace opening {index}?",
      saving: "Learning visual anchors…",
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
      continueOutro: "Move mouse to cancel and keep watching",
      nextEpisodeButton: "Next episode",
      nextEpisodeButtonTitle: "Go directly to the next episode",
      startAdjustLabel: "Segment start point",
      endAdjustLabel: "Segment end point",
      pointAdjustHelp: "Click the Start or End image above to choose which point to fine-tune. Repeated ±2 sec clicks accumulate and move the player timeline.",
      originalEnd: "Original",
      previewStart: "Preview start {time}",
      adjustMinus2: "−2 sec",
      adjustPlus2: "+2 sec",
      previewEnd: "Preview endpoint {time}",
      adjustmentTotal: "Current adjustment {offset} sec",
      overlayCompactIntro: "Opening candidate · Hover to expand",
      overlayCompactOutro: "Ending candidate · Hover to expand",
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
  // v2.2.2: automatic opening matching is intentionally limited to the first
  // 10 minutes. Ending matching runs only in the final 6 minutes of the video.
  const FRAME_SAMPLE_MS = 180;
  const LEARNING_SAMPLE_MS = 1000;
  const INTRO_SCAN_END_SECONDS = 10 * 60;
  // v2.2.5: an opening seek larger than 3 minutes is treated as ordinary navigation,
  // not as an opening-learning gesture. Exactly 3 minutes is still allowed.
  const INTRO_MAX_LEARN_SKIP_SECONDS = 3 * 60;
  const OUTRO_SCAN_LEAD_SECONDS = 6 * 60;
  const OUTRO_SCAN_FALLBACK_START_SECONDS = 18 * 60;
  const OUTRO_NEAR_END_SECONDS = 10;
  const OUTRO_NEXT_COUNTDOWN_SECONDS = 4;
  const OUTRO_SKIP_COUNTDOWN_SECONDS = 3;
  const OUTRO_MOUSE_CANCEL_ARM_MS = 300;
  const OUTRO_MOUSE_CANCEL_MIN_DISTANCE_PX = 4;
  const SEEK_SETTLE_MS = 1500;
  const CANDIDATE_LIFETIME_MS = 5000;
  const MAX_PROFILES_PER_WORK = 3;
  // v2.2.4: learning profiles must anchor to the actual pre-seek frame.
  // A frame farther away than this is rejected instead of silently learning story footage.
  const PRECISE_START_FRAME_TOLERANCE_SECONDS = 0.45;
  const INTERACTION_FRAME_MAX_AGE_MS = 8000;
  const PROFILE_SCHEMA_VERSION = 2;
  // v2.2.6: one exact start frame is too fragile for animation transitions.
  // New profiles learn several frames from the first six seconds after the user-selected start.
  const PROFILE_ANCHOR_VERSION = 3;
  const PROFILE_ANCHOR_OFFSETS_SECONDS = Object.freeze([0, 1.2, 2.4, 3.6, 4.8, 6.0]);
  const PROFILE_MIN_RELIABLE_ANCHORS = 3;
  const PROFILE_ANCHOR_SEEK_TIMEOUT_MS = 1600;

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
  let pendingSeekStartFrame = null;
  let pendingSeekStartCapturedAt = 0;
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
  let candidateLayoutResizeObserver = null;
  let candidateLayoutResizeHandler = null;
  let candidateFullscreenHandler = null;
  let activeCandidate = null;
  let toast = null;
  let toastTimer = null;

  let introProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
  let outroProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
  let matcherBusy = false;
  let trainingCaptureBusy = false;
  let trainingCaptureGeneration = 0;
  let matchVotes = new Map();
  let outroMatchVotes = new Map();
  let autoSkipPerformedEpisodeKey = null;
  let outroActionEpisodeKey = null;
  let outroActionStatus = null;
  let suppressLearningUntil = 0;
  let lastAutoSkip = null;
  let lastMatchProbe = null;
  let lastMatchByProfile = new Map();
  let lastOutroAction = null;
  let lastOutroMatchProbe = null;
  let lastOutroMatchByProfile = new Map();
  let promptHistoryCache = null;
  let outroCountdownCard = null;
  let outroCountdownTimer = null;
  let outroCountdownMouseMoveHandler = null;
  let nextEpisodeButton = null;
  let nextEpisodeResizeHandler = null;
  let nextEpisodeFullscreenHandler = null;

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

  function copyFrame(frame) {
    if (!frame?.fingerprint) return null;
    return {
      mediaTime: Number(frame.mediaTime),
      capturedAt: Number(frame.capturedAt) || performance.now(),
      fingerprint: frame.fingerprint,
      previewDataUrl: frame.previewDataUrl || null,
      width: Number(frame.width) || 240,
      height: Number(frame.height) || 135
    };
  }

  function helperUiOwnsTarget(target) {
    return Boolean(target && typeof target.closest === "function" && target.closest(
      ".bahamut-helper-candidate, .bahamut-helper-outro-countdown, .bahamut-helper-next-episode, .bahamut-helper-toast"
    ));
  }

  function capturePotentialSeekStart() {
    if (!activeVideo || performance.now() < suppressLearningUntil) return null;
    if (activeVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return null;
    const kind = classifyLearningKind(activeVideo.currentTime, activeVideo);
    if (!kind) return null;
    const frame = captureVideoFrame(activeVideo, { withPreview: true });
    if (!frame) return null;
    pendingSeekStartFrame = copyFrame(frame);
    pendingSeekStartCapturedAt = performance.now();
    // Use the exact captured frame time as the stable pre-seek time.
    lastStableTime = Number(frame.mediaTime);
    return pendingSeekStartFrame;
  }

  function handlePotentialSeekPointerDown(event) {
    if (event?.button != null && event.button !== 0) return;
    if (helperUiOwnsTarget(event?.target)) return;
    capturePotentialSeekStart();
  }

  function handlePotentialSeekKeyDown(event) {
    if (helperUiOwnsTarget(event?.target)) return;
    const key = String(event?.key || "");
    if (!["ArrowLeft", "ArrowRight", "j", "J", "l", "L", "Home", "End"].includes(key)) return;
    capturePotentialSeekStart();
  }

  function takePreciseSeekStartFrame(fromTime) {
    const now = performance.now();
    let frame = null;
    if (pendingSeekStartFrame && now - pendingSeekStartCapturedAt <= INTERACTION_FRAME_MAX_AGE_MS) {
      const delta = Math.abs(Number(pendingSeekStartFrame.mediaTime) - Number(fromTime));
      if (Number.isFinite(delta) && delta <= PRECISE_START_FRAME_TOLERANCE_SECONDS) frame = copyFrame(pendingSeekStartFrame);
    }
    pendingSeekStartFrame = null;
    pendingSeekStartCapturedAt = 0;

    if (!frame && lastFrame?.fingerprint) {
      const delta = Math.abs(Number(lastFrame.mediaTime) - Number(fromTime));
      if (Number.isFinite(delta) && delta <= PRECISE_START_FRAME_TOLERANCE_SECONDS) frame = copyFrame(lastFrame);
    }
    return frame;
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

  function getAutoMatchAnchors(profile) {
    // Legacy profiles may contain frames from up to ~3 seconds before the real opening/ending.
    // They remain visible/deletable/importable, but are intentionally not trusted for auto-skip.
    const schemaVersion = Number(profile?.profileSchemaVersion);
    if (!Number.isFinite(schemaVersion) || schemaVersion < PROFILE_SCHEMA_VERSION) return [];
    const anchors = Array.isArray(profile?.anchors) ? profile.anchors : [];
    const output = [];
    for (const anchor of anchors) {
      if (!isInformativeFingerprint(anchor?.fingerprint)) continue;
      const offsetSeconds = Number(anchor?.offsetSeconds);
      output.push({
        fingerprint: anchor.fingerprint,
        offsetSeconds: Number.isFinite(offsetSeconds) ? Math.max(0, offsetSeconds) : 0
      });
    }
    if (!output.length && isInformativeFingerprint(profile?.startFingerprint)) {
      output.push({ fingerprint: profile.startFingerprint, offsetSeconds: 0 });
    }
    return output;
  }

  function bestAutoMatch(frameFingerprint, profile) {
    let best = { similarity: 0, anchorOffsetSeconds: 0 };
    for (const anchor of getAutoMatchAnchors(profile)) {
      const similarity = hammingSimilarity(frameFingerprint, anchor.fingerprint);
      if (similarity > best.similarity) best = { similarity, anchorOffsetSeconds: anchor.offsetSeconds };
    }
    return best;
  }

  function profileAnchorStats(profile) {
    const anchors = getAutoMatchAnchors(profile);
    return {
      count: anchors.length,
      version: Number(profile?.anchorVersion) || 0,
      reliable: (Number(profile?.anchorVersion) || 0) >= PROFILE_ANCHOR_VERSION && anchors.length >= PROFILE_MIN_RELIABLE_ANCHORS
    };
  }

  function waitMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
  }

  function waitForRenderedVideoFrame(video, timeoutMs = 260) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      const timeoutId = setTimeout(finish, timeoutMs);
      const complete = () => {
        clearTimeout(timeoutId);
        finish();
      };
      try {
        if (typeof video?.requestVideoFrameCallback === "function") {
          video.requestVideoFrameCallback(() => complete());
          return;
        }
      } catch (_) {}
      requestAnimationFrame(() => requestAnimationFrame(complete));
    });
  }

  async function seekVideoForAnchorCapture(video, targetTime, captureToken) {
    if (!video || captureToken !== trainingCaptureGeneration) return false;
    const duration = Number(video.duration);
    const max = Number.isFinite(duration) && duration > 0 ? Math.max(0, duration - 0.15) : Number.POSITIVE_INFINITY;
    const target = clamp(Number(targetTime) || 0, 0, max);

    if (Math.abs(Number(video.currentTime) - target) <= 0.06 && !video.seeking) {
      await waitForRenderedVideoFrame(video);
      return captureToken === trainingCaptureGeneration;
    }

    return new Promise((resolve) => {
      let settled = false;
      const cleanup = () => {
        clearTimeout(timeoutId);
        video.removeEventListener?.("seeked", onSeeked);
      };
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(Boolean(ok));
      };
      const onSeeked = async () => {
        if (captureToken !== trainingCaptureGeneration) return finish(false);
        if (Math.abs(Number(video.currentTime) - target) > 0.35) return;
        await waitForRenderedVideoFrame(video);
        finish(captureToken === trainingCaptureGeneration);
      };
      const timeoutId = setTimeout(() => finish(false), PROFILE_ANCHOR_SEEK_TIMEOUT_MS);
      video.addEventListener?.("seeked", onSeeked);
      try {
        video.currentTime = target;
      } catch (_) {
        finish(false);
      }
    });
  }

  async function collectCandidateLearningAnchors(candidate) {
    if (!candidate?.work || !Number.isFinite(Number(candidate.fromTime))) return [];
    if (Array.isArray(candidate.learnedAnchors) && candidate.learnedAnchors.length >= PROFILE_MIN_RELIABLE_ANCHORS) {
      return candidate.learnedAnchors
        .filter((anchor) => isInformativeFingerprint(anchor?.fingerprint))
        .map((anchor) => ({ fingerprint: anchor.fingerprint, offsetSeconds: Math.max(0, Number(anchor.offsetSeconds) || 0) }))
        .slice(0, PROFILE_ANCHOR_OFFSETS_SECONDS.length);
    }

    const anchors = [];
    const pushFrame = (frame, expectedOffset) => {
      if (!frame?.fingerprint || !isInformativeFingerprint(frame.fingerprint)) return;
      const actualOffset = Number(frame.mediaTime) - Number(candidate.fromTime);
      const offset = Number.isFinite(actualOffset) && actualOffset >= -0.35
        ? Math.max(0, actualOffset)
        : Math.max(0, Number(expectedOffset) || 0);
      anchors.push({
        fingerprint: frame.fingerprint,
        offsetSeconds: Number(offset.toFixed(3))
      });
    };

    const originalStart = candidate.startFrame?.fingerprint ? copyFrame(candidate.startFrame) : candidate.frame?.fingerprint ? copyFrame(candidate.frame) : null;
    if (originalStart && Math.abs(Number(originalStart.mediaTime) - Number(candidate.fromTime)) <= PRECISE_START_FRAME_TOLERANCE_SECONDS) {
      pushFrame(originalStart, 0);
    }

    const video = activeVideo;
    if (!video || identifyWork().episodeKey !== candidate.work.episodeKey || identifyWork().key !== candidate.work.key) {
      return anchors;
    }

    const captureToken = ++trainingCaptureGeneration;
    const wasPaused = Boolean(video.paused);
    const restoreTime = Number(candidate.toTime);
    trainingCaptureBusy = true;
    stopFrameSampler();
    suppressLearningUntil = performance.now() + 20000;
    seekSession = null;
    if (seekSettleTimer !== null) {
      clearTimeout(seekSettleTimer);
      seekSettleTimer = null;
    }

    try {
      try { video.pause?.(); } catch (_) {}
      const maxOffset = Math.max(0, Math.min(6, Number(candidate.duration) - 1));
      for (const offset of PROFILE_ANCHOR_OFFSETS_SECONDS) {
        if (captureToken !== trainingCaptureGeneration) break;
        if (offset > maxOffset + 0.001) continue;
        if (offset === 0 && anchors.some((anchor) => anchor.offsetSeconds <= 0.35)) continue;
        const ok = await seekVideoForAnchorCapture(video, Number(candidate.fromTime) + offset, captureToken);
        if (!ok || captureToken !== trainingCaptureGeneration) continue;
        const frame = captureVideoFrame(video, { withPreview: offset === 0 && !originalStart });
        if (frame) {
          if (offset === 0 && (
            !candidate.startFrame?.fingerprint ||
            !isInformativeFingerprint(candidate.startFrame.fingerprint) ||
            Math.abs(Number(candidate.startFrame.mediaTime) - Number(candidate.fromTime)) > PRECISE_START_FRAME_TOLERANCE_SECONDS
          )) {
            setCandidateStartFrame(candidate, frame);
          }
          pushFrame(frame, offset);
        }
      }
    } finally {
      if (captureToken === trainingCaptureGeneration && video && identifyWork().episodeKey === candidate.work.episodeKey) {
        await seekVideoForAnchorCapture(video, restoreTime, captureToken);
        captureCandidateEndFrameNow(candidate);
        if (!wasPaused) {
          try { await video.play?.(); } catch (_) {}
        }
      }
      if (captureToken === trainingCaptureGeneration) {
        trainingCaptureBusy = false;
        suppressLearningUntil = performance.now() + 1800;
        updateFrameSamplerState({ sampleNow: true });
      }
    }

    // Keep temporal order and cap the payload to the planned learning samples.
    const learned = anchors
      .filter((anchor) => isInformativeFingerprint(anchor.fingerprint))
      .sort((a, b) => a.offsetSeconds - b.offsetSeconds)
      .slice(0, PROFILE_ANCHOR_OFFSETS_SECONDS.length);
    if (learned.length >= PROFILE_MIN_RELIABLE_ANCHORS) candidate.learnedAnchors = learned.map((anchor) => ({ ...anchor }));
    return learned;
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
    return items.some((item) => {
      if (item?.kind !== candidate.kind) return false;
      if (item?.suppressKindForEpisode === true) return true;
      return Math.abs(Number(item.originalFromTime ?? item.fromTime) - Number(candidate.originalFromTime ?? candidate.fromTime)) <= 3 &&
        Math.abs(Number(item.originalToTime) - Number(candidate.originalToTime ?? candidate.toTime)) <= 3;
    });
  }

  async function recordCandidateHandled(candidate, status, { suppressKindForEpisode = false } = {}) {
    if (!candidate?.work || !candidate?.kind) return;
    const history = { ...(await getPromptHistory(false)) };
    const id = promptEpisodeId(candidate.work);
    const items = Array.isArray(history[id]) ? [...history[id]] : [];
    items.push({
      kind: candidate.kind,
      fromTime: Number(candidate.fromTime || 0),
      originalFromTime: Number(candidate.originalFromTime ?? candidate.fromTime ?? 0),
      originalToTime: Number(candidate.originalToTime ?? candidate.toTime ?? 0),
      status,
      suppressKindForEpisode: Boolean(suppressKindForEpisode),
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
    lastMatchByProfile = new Map();
    lastOutroAction = null;
    lastOutroMatchProbe = null;
    lastOutroMatchByProfile = new Map();
    promptHistoryCache = null;
    trainingCaptureGeneration += 1;
    trainingCaptureBusy = false;
    removeOutroCountdown();
    removeNextEpisodeButton();
  }

  function evaluateProfileMatch(frameFingerprint, profile, voteMap, now) {
    const anchorMatch = bestAutoMatch(frameFingerprint, profile);
    const similarity = anchorMatch.similarity;
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

    return {
      similarity, profileId, voteScore, hitCount, bestVote, matchLevel, shouldTrigger,
      anchorOffsetSeconds: anchorMatch.anchorOffsetSeconds,
      preciseProfile: getAutoMatchAnchors(profile).length > 0
    };
  }

  function chooseBestTriggeredProfile(triggered) {
    if (!Array.isArray(triggered) || !triggered.length) return null;
    return [...triggered].sort((a, b) =>
      Number(b?.result?.similarity || 0) - Number(a?.result?.similarity || 0) ||
      Number(b?.result?.voteScore || 0) - Number(a?.result?.voteScore || 0) ||
      Number(b?.result?.hitCount || 0) - Number(a?.result?.hitCount || 0)
    )[0] || null;
  }

  function remainingSkipDuration(profileDuration, anchorOffsetSeconds = 0) {
    const duration = Number(profileDuration);
    const offset = Math.max(0, Number(anchorOffsetSeconds) || 0);
    if (!Number.isFinite(duration) || duration <= 0) return 0;
    return Math.max(1, duration - offset);
  }

  async function maybeAutoSkipIntro(frame) {
    if (!settings.autoSkipIntro || trainingCaptureBusy || !frame?.fingerprint || !activeVideo || activeVideo.paused) return;
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
      const triggered = [];
      for (const profile of profiles) {
        const duration = Number(profile?.duration);
        if (!Number.isFinite(duration) || duration <= 0) continue;
        const result = evaluateProfileMatch(frame.fingerprint, profile, matchVotes, now);
        lastMatchByProfile.set(result.profileId, {
          at: Date.now(), mediaTime: Number(activeVideo.currentTime.toFixed(3)),
          similarity: Number(result.similarity.toFixed(4)), matchLevel: result.matchLevel,
          voteScore: result.voteScore, hitCount: result.hitCount
        });

        if (!bestProbe || result.similarity > bestProbe.similarity) {
          bestProbe = {
            at: Date.now(), workKey: work.key, episodeKey: work.episodeKey,
            mediaTime: Number(activeVideo.currentTime.toFixed(3)),
            similarity: Number(result.similarity.toFixed(4)), profileId: result.profileId,
            matchLevel: result.matchLevel, voteScore: result.voteScore, hitCount: result.hitCount,
            requiredScore: AUTO_MATCH_REQUIRED_SCORE, requiredHits: AUTO_MATCH_REQUIRED_HITS,
            sampleIntervalMs: frameSampleIntervalMs || FRAME_SAMPLE_MS,
            scanWindow: `0-${INTRO_SCAN_END_SECONDS}`,
            preciseProfile: result.preciseProfile
          };
        }
        if (result.shouldTrigger && result.preciseProfile) triggered.push({ profile, duration, result });
      }
      if (bestProbe) lastMatchProbe = bestProbe;
      if (!triggered.length) return;

      // Never let storage order decide which of several profiles wins.
      const chosen = chooseBestTriggeredProfile(triggered);
      if (!chosen) return;
      const from = activeVideo.currentTime;
      const remainingDuration = remainingSkipDuration(chosen.duration, chosen.result.anchorOffsetSeconds);
      let to = from + remainingDuration;
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
        fromTime: from, toTime: to, duration: remainingDuration,
        similarity: Number(chosen.result.similarity.toFixed(4)), profileId: chosen.result.profileId,
        matchLevel: chosen.result.matchLevel, voteScore: chosen.result.voteScore, hitCount: chosen.result.hitCount,
        anchorOffsetSeconds: Number(chosen.result.anchorOffsetSeconds || 0)
      };
      showToast(t("autoSkipped", { duration: formatDuration(remainingDuration) }));
      updateFrameSamplerState();
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

  function removeNextEpisodeButton() {
    if (nextEpisodeResizeHandler) {
      window.removeEventListener?.("resize", nextEpisodeResizeHandler);
      nextEpisodeResizeHandler = null;
    }
    if (nextEpisodeFullscreenHandler) {
      document.removeEventListener?.("fullscreenchange", nextEpisodeFullscreenHandler, true);
      nextEpisodeFullscreenHandler = null;
    }
    if (nextEpisodeButton) {
      nextEpisodeButton.remove?.();
      nextEpisodeButton = null;
    }
  }

  function refreshNextEpisodeButtonLayout() {
    if (!nextEpisodeButton || !activeVideo || !activeVideo.isConnected) return;
    const mount = getCandidateCardMountPoint();
    if (mount && nextEpisodeButton.parentNode !== mount) mount.appendChild(nextEpisodeButton);
    positionCardAtVideoBottomRight(nextEpisodeButton);
  }

  function isUsableNextEpisodeControl(node) {
    if (!node || node === nextEpisodeButton || node.disabled) return false;
    if (String(node.getAttribute?.("aria-disabled") || "").toLowerCase() === "true") return false;
    if (node.hidden) return false;
    const rects = node.getClientRects?.();
    return !rects || rects.length > 0;
  }

  function findNativeNextEpisodeControl() {
    const selectors = [
      '[data-action="next-episode"]',
      '[data-action="next"]',
      '[data-next-episode]',
      'button[aria-label*="下一集"]',
      'a[aria-label*="下一集"]',
      'button[title*="下一集"]',
      'a[title*="下一集"]'
    ];
    for (const selector of selectors) {
      const node = document.querySelector?.(selector);
      if (isUsableNextEpisodeControl(node)) return node;
    }

    const exactLabels = new Set(["下一集", "下集", "下一話", "Next episode", "Next Episode"]);
    for (const node of document.querySelectorAll?.("button, a[href]") || []) {
      const label = String(node.textContent || "").replace(/\s+/g, " ").trim();
      if (exactLabels.has(label) && isUsableNextEpisodeControl(node)) return node;
    }
    return null;
  }

  function advanceToNextEpisode(work, reason = "button") {
    if (!activeVideo || identifyWork().episodeKey !== work.episodeKey) return false;
    const nativeControl = findNativeNextEpisodeControl();
    const duration = Number(activeVideo.duration);
    const canFallbackToEnd = Number.isFinite(duration) && duration > 0;
    if (!nativeControl && !canFallbackToEnd) return false;

    suppressLearningUntil = performance.now() + AUTO_SKIP_SUPPRESS_LEARNING_MS;
    seekSession = null;
    outroActionStatus = "next";
    lastOutroAction = {
      at: Date.now(),
      workKey: work.key,
      episodeKey: work.episodeKey,
      mode: "next",
      reason,
      method: nativeControl ? "native-control" : "video-end-fallback"
    };
    removeNextEpisodeButton();

    if (nativeControl) {
      nativeControl.click?.();
      return true;
    }

    activeVideo.currentTime = Math.max(0, duration - 0.12);
    activeVideo.play?.().catch?.(() => {});
    return true;
  }

  function showNextEpisodeButton(work) {
    if (!activeVideo || identifyWork().episodeKey !== work.episodeKey) return;
    removeNextEpisodeButton();

    const button = document.createElement("button");
    button.type = "button";
    button.className = "bahamut-helper-next-episode";
    button.setAttribute("aria-label", t("nextEpisodeButtonTitle"));
    button.title = t("nextEpisodeButtonTitle");
    button.innerHTML = `<span>${escapeHtml(t("nextEpisodeButton"))}</span><span aria-hidden="true">▶</span>`;
    button.addEventListener("pointerdown", (event) => event.stopPropagation());
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      advanceToNextEpisode(work, "post-outro-button");
    });

    nextEpisodeButton = button;
    getCandidateCardMountPoint().appendChild(button);
    refreshNextEpisodeButtonLayout();
    requestAnimationFrame(() => button.classList.add("is-visible"));

    nextEpisodeResizeHandler = () => refreshNextEpisodeButtonLayout();
    nextEpisodeFullscreenHandler = () => requestAnimationFrame(refreshNextEpisodeButtonLayout);
    window.addEventListener?.("resize", nextEpisodeResizeHandler);
    document.addEventListener?.("fullscreenchange", nextEpisodeFullscreenHandler, true);
  }

  function removeOutroCountdown() {
    if (outroCountdownTimer !== null) {
      clearInterval(outroCountdownTimer);
      outroCountdownTimer = null;
    }
    if (outroCountdownMouseMoveHandler) {
      document.removeEventListener?.("mousemove", outroCountdownMouseMoveHandler, true);
      outroCountdownMouseMoveHandler = null;
    }
    if (outroCountdownCard) {
      outroCountdownCard.remove();
      outroCountdownCard = null;
    }
  }

  function cancelOutroCountdown(work, reason = "mouse") {
    if (outroActionStatus !== "pending" || !outroCountdownCard) return false;
    if (!activeVideo || identifyWork().episodeKey !== work.episodeKey) return false;
    outroActionStatus = "cancelled";
    lastOutroAction = {
      at: Date.now(),
      workKey: work.key,
      episodeKey: work.episodeKey,
      mode: "cancelled",
      reason
    };
    removeOutroCountdown();
    updateFrameSamplerState();
    return true;
  }

  function armOutroCountdownMouseCancel(work) {
    if (!document.addEventListener || !activeVideo) return;
    const armedAt = performance.now();
    let lastPoint = null;

    outroCountdownMouseMoveHandler = (event) => {
      if (!outroCountdownCard || outroActionStatus !== "pending" || !activeVideo) return;
      if (identifyWork().episodeKey !== work.episodeKey) return;

      const x = Number(event.clientX);
      const y = Number(event.clientY);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const rect = activeVideo.getBoundingClientRect?.();
      if (!rect || !rect.width || !rect.height) return;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;

      const point = { x, y };
      if (!lastPoint || performance.now() - armedAt < OUTRO_MOUSE_CANCEL_ARM_MS) {
        lastPoint = point;
        return;
      }

      const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
      lastPoint = point;
      if (distance < OUTRO_MOUSE_CANCEL_MIN_DISTANCE_PX) return;
      cancelOutroCountdown(work, "mouse-move");
    };

    document.addEventListener("mousemove", outroCountdownMouseMoveHandler, true);
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
    if (mode === "skip") showNextEpisodeButton(work);
    else removeNextEpisodeButton();
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
      <span class="bahamut-helper-outro-hint">${escapeHtml(t("continueOutro"))}</span>
    `;
    getCardMountPoint().appendChild(card);
    outroCountdownCard = card;
    positionCardAtVideoBottomRight(card);
    requestAnimationFrame(() => card.classList.add("is-visible"));
    armOutroCountdownMouseCancel(work);

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
    if (!settings.autoSkipOutro || trainingCaptureBusy || !frame?.fingerprint || !activeVideo || activeVideo.paused) return;
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
      const triggered = [];

      for (const profile of profiles) {
        const duration = Number(profile?.duration);
        if (!Number.isFinite(duration) || duration <= 0) continue;
        const result = evaluateProfileMatch(frame.fingerprint, profile, outroMatchVotes, now);
        lastOutroMatchByProfile.set(result.profileId, {
          at: Date.now(), mediaTime: Number(activeVideo.currentTime.toFixed(3)),
          similarity: Number(result.similarity.toFixed(4)), matchLevel: result.matchLevel,
          voteScore: result.voteScore, hitCount: result.hitCount
        });
        if (!bestProbe || result.similarity > bestProbe.similarity) {
          bestProbe = {
            at: Date.now(), workKey: work.key, episodeKey: work.episodeKey,
            mediaTime: Number(activeVideo.currentTime.toFixed(3)),
            similarity: Number(result.similarity.toFixed(4)), profileId: result.profileId,
            matchLevel: result.matchLevel, voteScore: result.voteScore, hitCount: result.hitCount,
            requiredScore: AUTO_MATCH_REQUIRED_SCORE, requiredHits: AUTO_MATCH_REQUIRED_HITS,
            sampleIntervalMs: frameSampleIntervalMs || FRAME_SAMPLE_MS,
            scanWindowStart: Number(getOutroScanStart(activeVideo).toFixed(3)),
            preciseProfile: result.preciseProfile
          };
        }
        if (result.shouldTrigger && result.preciseProfile) triggered.push({ profile, duration, result });
      }
      if (bestProbe) lastOutroMatchProbe = bestProbe;
      if (!triggered.length) return;

      const chosen = chooseBestTriggeredProfile(triggered);
      if (!chosen) return;
      const from = activeVideo.currentTime;
      const remainingDuration = remainingSkipDuration(chosen.duration, chosen.result.anchorOffsetSeconds);
      let target = from + remainingDuration;
      const videoDuration = Number(activeVideo.duration);
      if (Number.isFinite(videoDuration) && videoDuration > 0) {
        target = Math.min(target, Math.max(0, videoDuration - 0.12));
      }
      if (!(target > from + 1)) return;
      showOutroCountdown(work, target, chosen.result);
    } finally {
      matcherBusy = false;
    }
  }

  function desiredFrameSampleInterval() {
    if (trainingCaptureBusy) return null;
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
    if (trainingCaptureBusy) return;
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
      if (introAuto) maybeAutoSkipIntro(frame).catch((error) => console.warn("[動畫瘋自動播放助手] 自動片頭辨識失敗。", error));
      if (outroAuto) maybeAutoSkipOutro(frame).catch((error) => console.warn("[動畫瘋自動播放助手] 自動片尾辨識失敗。", error));
    }
  }

  function beginSeekSession(video) {
    if (trainingCaptureBusy) return;
    if ((!settings.introLearning && !settings.outroLearning) || performance.now() < suppressLearningUntil) return;

    if (!seekSession) {
      const stableTime = Number.isFinite(lastStableTime) ? Number(lastStableTime) : Number(lastFrame?.mediaTime);
      let fromTime = stableTime;
      const interactionFrame = pendingSeekStartFrame && performance.now() - pendingSeekStartCapturedAt <= INTERACTION_FRAME_MAX_AGE_MS
        ? pendingSeekStartFrame
        : null;
      // A recent pointer/key capture is only trusted if it still agrees with the last
      // non-seeking playback time. This prevents an unrelated old click from becoming
      // the start anchor several seconds later.
      if (interactionFrame?.fingerprint && Number.isFinite(stableTime) &&
          Math.abs(Number(interactionFrame.mediaTime) - stableTime) <= PRECISE_START_FRAME_TOLERANCE_SECONDS) {
        fromTime = Number(interactionFrame.mediaTime);
      }
      const kind = classifyLearningKind(fromTime, video);
      if (!kind) {
        pendingSeekStartFrame = null;
        pendingSeekStartCapturedAt = 0;
        return;
      }

      const frame = takePreciseSeekStartFrame(fromTime);
      seekSession = {
        startedAt: performance.now(),
        fromTime,
        toTime: video.currentTime,
        eventCount: 1,
        kind,
        frame,
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
    // Capture the endpoint immediately after the seek settles, before normal playback
    // can advance several seconds during the candidate settle timer.
    const endpointFrame = captureVideoFrame(video, { withPreview: true });
    if (endpointFrame) seekSession.endFrame = copyFrame(endpointFrame);

    if (seekSettleTimer !== null) clearTimeout(seekSettleTimer);
    seekSettleTimer = setTimeout(() => {
      seekSettleTimer = null;
      finalizeSeekSession().catch((error) => {
        console.warn("[動畫瘋自動播放助手] 無法完成快轉學習候選。", error);
      });
    }, SEEK_SETTLE_MS);
  }

  function learningSeekDurationAllowed(kind, duration) {
    const seconds = Number(duration);
    if (!Number.isFinite(seconds) || seconds < settings.minLearnSkipSeconds) return false;
    if (kind === "intro" && seconds > INTRO_MAX_LEARN_SKIP_SECONDS) return false;
    return seconds <= 15 * 60;
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
    // Keep very large timeline jumps out of the opening-learning UI. A jump over
    // three minutes is assumed to be general navigation, even when it starts
    // inside the first ten-minute opening scan window.
    if (!learningSeekDurationAllowed(kind, duration)) return;

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
        const anchors = getAutoMatchAnchors(profile);
        if (!anchors.length) return;
        const similarity = bestAutoMatch(frame.fingerprint, profile).similarity;
        if (similarity > bestExistingSimilarity) {
          bestExistingSimilarity = similarity;
          bestExistingIndex = index;
        }
      });
    }

    let endFrame = session.endFrame?.fingerprint ? copyFrame(session.endFrame) : null;
    if (!endFrame && activeVideo && Math.abs(Number(activeVideo.currentTime) - toTime) <= 0.5) {
      endFrame = captureVideoFrame(activeVideo, { withPreview: true });
    }

    const candidate = {
      id: `candidate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind,
      work,
      originalFromTime: fromTime,
      fromTime,
      originalToTime: toTime,
      toTime,
      startAdjustmentSeconds: 0,
      endAdjustmentSeconds: 0,
      // Compatibility alias used by older backups/Popup versions: end-point adjustment.
      adjustmentSeconds: 0,
      duration,
      eventCount: session.eventCount,
      frame: frame ? copyFrame(frame) : null,
      startFrame: frame ? copyFrame(frame) : null,
      endFrame: endFrame ? copyFrame(endFrame) : null,
      // v2.2.4 new profiles never include pre-seek history frames.
      fingerprints: frame?.fingerprint ? [frame.fingerprint] : [],
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

  function setCandidateStartFrame(candidate, frame) {
    if (!candidate || !frame?.fingerprint) return false;
    candidate.startFrame = copyFrame(frame);
    candidate.frame = copyFrame(frame);
    candidate.fingerprints = [frame.fingerprint];
    // A start-point change invalidates any anchors learned from the old start.
    candidate.learnedAnchors = null;
    if (activeCandidate === candidate && candidateCard) {
      const img = candidateCard.querySelector("[data-start-preview]");
      if (img) {
        img.src = candidate.startFrame.previewDataUrl || "";
        img.hidden = !candidate.startFrame.previewDataUrl;
      }
    }
    return true;
  }

  function setCandidateEndFrame(candidate, frame) {
    if (!candidate || !frame?.fingerprint) return false;
    candidate.endFrame = copyFrame(frame);
    if (activeCandidate === candidate && candidateCard) {
      const img = candidateCard.querySelector("[data-end-preview]");
      if (img) {
        img.src = candidate.endFrame.previewDataUrl || "";
        img.hidden = !candidate.endFrame.previewDataUrl;
      }
    }
    return true;
  }

  function captureCandidateStartFrameNow(candidate) {
    if (!candidate || !activeVideo || identifyWork().episodeKey !== candidate.work.episodeKey) return false;
    if (Math.abs(Number(activeVideo.currentTime) - Number(candidate.fromTime)) > 0.5) return false;
    const frame = captureVideoFrame(activeVideo, { withPreview: true });
    return setCandidateStartFrame(candidate, frame);
  }

  function captureCandidateEndFrameNow(candidate) {
    if (!candidate || !activeVideo || identifyWork().episodeKey !== candidate.work.episodeKey) return false;
    if (Math.abs(Number(activeVideo.currentTime) - Number(candidate.toTime)) > 0.5) return false;
    const frame = captureVideoFrame(activeVideo, { withPreview: true });
    return setCandidateEndFrame(candidate, frame);
  }

  function scheduleCandidatePointFrameCapture(candidate, point) {
    if (!candidate || !activeVideo || typeof activeVideo.addEventListener !== "function") return;
    const pointIsStart = point === "start";
    const tokenKey = pointIsStart ? "startCaptureToken" : "endCaptureToken";
    const token = (Number(candidate[tokenKey]) || 0) + 1;
    candidate[tokenKey] = token;
    const target = Number(pointIsStart ? candidate.fromTime : candidate.toTime);
    const tryCapture = () => {
      if (candidate[tokenKey] !== token || activeCandidate !== candidate) return;
      if (!activeVideo || identifyWork().episodeKey !== candidate.work.episodeKey) return;
      if (Math.abs(Number(activeVideo.currentTime) - target) > 0.5) return;
      if (pointIsStart) captureCandidateStartFrameNow(candidate);
      else captureCandidateEndFrameNow(candidate);
    };
    activeVideo.addEventListener("seeked", () => setTimeout(tryCapture, 40), { once: true });
    setTimeout(tryCapture, 260);
  }

  function scheduleCandidateStartFrameCapture(candidate) {
    scheduleCandidatePointFrameCapture(candidate, "start");
  }

  function scheduleCandidateEndFrameCapture(candidate) {
    scheduleCandidatePointFrameCapture(candidate, "end");
  }

  function minimumCandidateDuration() {
    const configured = Number(settings.minLearnSkipSeconds);
    return Number.isFinite(configured) ? clamp(configured, 5, 180) : DEFAULT_SETTINGS.minLearnSkipSeconds;
  }

  function maximumCandidateDuration(candidate) {
    // The explicit 3-minute ceiling is an opening-learning invariant, not just a prompt filter.
    // Fine tuning therefore cannot silently turn a valid opening candidate into a >3-minute segment.
    return candidate?.kind === "intro" ? INTRO_MAX_LEARN_SKIP_SECONDS : Number.POSITIVE_INFINITY;
  }

  function candidateAdjustedFromTime(candidate, adjustmentSeconds) {
    let from = Number(candidate.originalFromTime ?? candidate.fromTime) + Number(adjustmentSeconds || 0);
    const minDuration = minimumCandidateDuration();
    const maxDuration = maximumCandidateDuration(candidate);
    const min = Number.isFinite(maxDuration) ? Math.max(0, Number(candidate.toTime) - maxDuration) : 0;
    const max = Math.max(min, Number(candidate.toTime) - minDuration);
    return clamp(from, min, max);
  }

  function candidateAdjustedToTime(candidate, adjustmentSeconds) {
    let to = Number(candidate.originalToTime) + Number(adjustmentSeconds || 0);
    const min = Number(candidate.fromTime) + minimumCandidateDuration();
    const videoDuration = Number(activeVideo?.duration);
    const playableMax = Number.isFinite(videoDuration) && videoDuration > 0 ? Math.max(min, videoDuration - 0.12) : Number.POSITIVE_INFINITY;
    const maxDuration = maximumCandidateDuration(candidate);
    const durationMax = Number.isFinite(maxDuration) ? Number(candidate.fromTime) + maxDuration : Number.POSITIVE_INFINITY;
    const max = Math.max(min, Math.min(playableMax, durationMax));
    return clamp(to, min, max);
  }

  function prepareCandidatePointPreview(candidate, target, point) {
    if (!activeVideo || identifyWork().episodeKey !== candidate.work.episodeKey) return;
    suppressLearningUntil = performance.now() + 2500;
    seekSession = null;
    if (seekSettleTimer !== null) {
      clearTimeout(seekSettleTimer);
      seekSettleTimer = null;
    }
    activeVideo.currentTime = target;
    if (point === "start") scheduleCandidateStartFrameCapture(candidate);
    else scheduleCandidateEndFrameCapture(candidate);
  }

  function applyCandidateStartAdjustment(candidate, adjustmentSeconds, { preview = true } = {}) {
    const requestedAdjustment = Number(adjustmentSeconds) || 0;
    const from = candidateAdjustedFromTime(candidate, requestedAdjustment);
    const originalFrom = Number(candidate.originalFromTime ?? candidate.fromTime);
    const effectiveAdjustment = from - originalFrom;
    candidate.startAdjustmentSeconds = Number(effectiveAdjustment.toFixed(3));
    candidate.fromTime = from;
    candidate.duration = Number(candidate.toTime) - from;
    candidate.learnedAnchors = null;

    if (preview) prepareCandidatePointPreview(candidate, from, "start");
    return candidate;
  }

  function applyCandidateEndAdjustment(candidate, adjustmentSeconds, { preview = true } = {}) {
    const requestedAdjustment = Number(adjustmentSeconds) || 0;
    const to = candidateAdjustedToTime(candidate, requestedAdjustment);
    const effectiveAdjustment = to - Number(candidate.originalToTime);
    candidate.endAdjustmentSeconds = Number(effectiveAdjustment.toFixed(3));
    // Compatibility alias for older Popup/backup code.
    candidate.adjustmentSeconds = candidate.endAdjustmentSeconds;
    candidate.toTime = to;
    candidate.duration = to - Number(candidate.fromTime);

    if (preview) prepareCandidatePointPreview(candidate, to, "end");
    return candidate;
  }

  function applyCandidatePointAdjustment(candidate, point, adjustmentSeconds, options = {}) {
    return point === "start"
      ? applyCandidateStartAdjustment(candidate, adjustmentSeconds, options)
      : applyCandidateEndAdjustment(candidate, adjustmentSeconds, options);
  }

  // Backward-compatible endpoint helpers kept for older regression tests and internal callers.
  function applyCandidateAdjustment(candidate, adjustmentSeconds, options = {}) {
    return applyCandidateEndAdjustment(candidate, adjustmentSeconds, options);
  }

  function adjustCandidatePointBy(candidate, point, deltaSeconds, options = {}) {
    const current = point === "start"
      ? Number(candidate.startAdjustmentSeconds) || 0
      : Number(candidate.endAdjustmentSeconds ?? candidate.adjustmentSeconds) || 0;
    return applyCandidatePointAdjustment(candidate, point, current + (Number(deltaSeconds) || 0), options);
  }

  function adjustCandidateBy(candidate, deltaSeconds, options = {}) {
    return adjustCandidatePointBy(candidate, "end", deltaSeconds, options);
  }

  function previewCandidatePoint(candidate, point) {
    if (!candidate) return;
    const target = Number(point === "start" ? candidate.fromTime : candidate.toTime);
    if (!Number.isFinite(target)) return;
    prepareCandidatePointPreview(candidate, target, point === "start" ? "start" : "end");
  }

  function formatAdjustmentOffset(seconds) {
    const value = Number(seconds) || 0;
    if (Math.abs(value) < 0.0005) return "0";
    const rounded = Number(value.toFixed(3));
    return `${rounded > 0 ? "+" : ""}${rounded}`;
  }

  async function saveCandidate(candidate, mode = "add", replaceIndex = 0) {
    if (!candidate?.kind || !candidate?.work) return { ok: false, reason: "INVALID_CANDIDATE" };

    // v2.2.6: do not pretend a single exact frame is a reliable opening/ending profile.
    // While the user is saving, briefly revisit the first six seconds of the selected
    // segment and capture several post-start visual anchors, then restore the chosen end.
    const learnedAnchors = await collectCandidateLearningAnchors(candidate);
    const startFrame = candidate?.startFrame?.fingerprint ? candidate.startFrame : candidate?.frame;
    const informativeAnchors = learnedAnchors.filter((anchor) => isInformativeFingerprint(anchor?.fingerprint));
    if (!startFrame?.fingerprint) return { ok: false, reason: "NO_FRAME" };
    if (informativeAnchors.length < PROFILE_MIN_RELIABLE_ANCHORS) {
      return { ok: false, reason: "INSUFFICIENT_ANCHORS", anchorCount: informativeAnchors.length };
    }

    // The player has been restored to the proposed endpoint by collectCandidateLearningAnchors.
    // Refresh the end preview once more so storage and the visible timeline agree.
    captureCandidateEndFrameNow(candidate);

    const all = await getProfiles(candidate.kind);
    const existing = all[candidate.work.key] || {
      workKey: candidate.work.key,
      workId: candidate.work.workId,
      title: candidate.work.title,
      profiles: []
    };

    const startFingerprint = startFrame.fingerprint;
    const endFrame = candidate.endFrame?.fingerprint ? candidate.endFrame : null;
    const profile = {
      id: `${candidate.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: candidate.kind,
      profileSchemaVersion: PROFILE_SCHEMA_VERSION,
      anchorVersion: PROFILE_ANCHOR_VERSION,
      createdAt: Date.now(),
      duration: Number(candidate.duration.toFixed(3)),
      startTimeHint: Number(candidate.fromTime.toFixed(3)),
      endTimeHint: Number(candidate.toTime.toFixed(3)),
      startAdjustmentSeconds: Number(candidate.startAdjustmentSeconds || 0),
      endAdjustmentSeconds: Number(candidate.endAdjustmentSeconds ?? candidate.adjustmentSeconds ?? 0),
      // Compatibility alias retained for older backups: end-point adjustment.
      adjustmentSeconds: Number(candidate.endAdjustmentSeconds ?? candidate.adjustmentSeconds ?? 0),
      startFingerprint,
      endFingerprint: endFrame?.fingerprint || null,
      anchors: informativeAnchors,
      // Compatibility aliases. Automatic matching uses the timestamped anchor list above.
      fingerprint: startFingerprint,
      fingerprints: informativeAnchors.map((anchor) => anchor.fingerprint),
      fingerprintVersion: 3,
      previewDataUrl: startFrame.previewDataUrl || null,
      previewWidth: startFrame.width,
      previewHeight: startFrame.height,
      startPreviewDataUrl: startFrame.previewDataUrl || null,
      startPreviewWidth: startFrame.width,
      startPreviewHeight: startFrame.height,
      endPreviewDataUrl: endFrame?.previewDataUrl || null,
      endPreviewWidth: endFrame?.width || startFrame.width,
      endPreviewHeight: endFrame?.height || startFrame.height,
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
    if (candidate.kind === "outro") {
      outroMatchVotes = new Map();
      lastOutroMatchByProfile = new Map();
    } else {
      matchVotes = new Map();
      lastMatchByProfile = new Map();
    }
    return { ok: true, profile, mode: savedMode, index: savedIndex, anchorCount: informativeAnchors.length };
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
    if (candidateLayoutResizeObserver) {
      candidateLayoutResizeObserver.disconnect?.();
      candidateLayoutResizeObserver = null;
    }
    if (candidateLayoutResizeHandler) {
      window.removeEventListener?.("resize", candidateLayoutResizeHandler);
      candidateLayoutResizeHandler = null;
    }
    if (candidateFullscreenHandler) {
      document.removeEventListener?.("fullscreenchange", candidateFullscreenHandler, true);
      candidateFullscreenHandler = null;
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

  function getCandidateCardMountPoint() {
    const fullscreenElement = document.fullscreenElement;
    if (fullscreenElement && activeVideo && (fullscreenElement === activeVideo || fullscreenElement.contains?.(activeVideo))) {
      return fullscreenElement;
    }
    return getCardMountPoint();
  }

  function rectanglesOverlap(a, b) {
    if (!a || !b) return false;
    const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return width > 1 && height > 1;
  }

  function candidateCardWouldCoverVideo(card) {
    if (!card || !activeVideo || !activeVideo.isConnected) return false;
    const videoRect = activeVideo.getBoundingClientRect?.();
    const cardRect = card.getBoundingClientRect?.();
    if (!videoRect || !cardRect || !videoRect.width || !videoRect.height || !cardRect.width || !cardRect.height) return false;

    const storedWidth = Number(card.dataset.fullWidth) || cardRect.width;
    const storedHeight = Number(card.dataset.fullHeight) || cardRect.height;
    const predictedFullRect = card.classList.contains("is-auto-compact")
      ? {
          right: cardRect.right,
          bottom: cardRect.bottom,
          left: cardRect.right - storedWidth,
          top: cardRect.bottom - storedHeight
        }
      : cardRect;
    return rectanglesOverlap(predictedFullRect, videoRect);
  }

  function setCandidateAutoCompact(card, compact) {
    if (!card) return;
    card.dataset.autoCompact = compact ? "true" : "false";
    const userExpanded = card.dataset.userExpanded === "true";
    const visuallyCompact = compact && !userExpanded;
    card.classList.toggle("is-auto-compact", visuallyCompact);
    card.setAttribute("aria-expanded", visuallyCompact ? "false" : "true");
  }

  function refreshCandidateLayout(card) {
    if (!card || card !== candidateCard) return;
    const mountPoint = getCandidateCardMountPoint();
    if (mountPoint && card.parentNode !== mountPoint) mountPoint.appendChild(card);

    // Measure the complete card once so later overlap checks do not oscillate after compaction.
    const wasCompact = card.classList.contains("is-auto-compact");
    if (!wasCompact) {
      const rect = card.getBoundingClientRect?.();
      if (rect?.width && rect?.height) {
        card.dataset.fullWidth = String(rect.width);
        card.dataset.fullHeight = String(rect.height);
      }
    }

    const shouldCompact = candidateCardWouldCoverVideo(card);
    setCandidateAutoCompact(card, shouldCompact);
  }

  function installCandidateAdaptiveLayout(card) {
    if (!card) return;

    card.addEventListener("mouseenter", () => {
      if (card.dataset.autoCompact !== "true") return;
      card.dataset.userExpanded = "true";
      setCandidateAutoCompact(card, true);
    });
    card.addEventListener("mouseleave", () => {
      if (card.dataset.autoCompact !== "true") return;
      card.dataset.userExpanded = "false";
      setCandidateAutoCompact(card, true);
    });

    candidateLayoutResizeHandler = () => requestAnimationFrame(() => refreshCandidateLayout(card));
    window.addEventListener?.("resize", candidateLayoutResizeHandler);

    candidateFullscreenHandler = () => requestAnimationFrame(() => refreshCandidateLayout(card));
    document.addEventListener?.("fullscreenchange", candidateFullscreenHandler, true);

    if (typeof ResizeObserver === "function" && activeVideo) {
      candidateLayoutResizeObserver = new ResizeObserver(() => requestAnimationFrame(() => refreshCandidateLayout(card)));
      candidateLayoutResizeObserver.observe(activeVideo);
    }

    requestAnimationFrame(() => refreshCandidateLayout(card));
  }

  async function skipCurrentCandidateEpisode() {
    // 「略過本集」明確抑制本集同類型（片頭或片尾）的後續學習詢問。
    // 片頭與片尾分開記錄，因此略過片頭不會阻止本集片尾學習。
    if (!activeCandidate) return;
    const candidate = activeCandidate;
    if (candidateExpireTimer !== null) {
      clearTimeout(candidateExpireTimer);
      candidateExpireTimer = null;
    }
    await recordCandidateHandled(candidate, "skip-episode", { suppressKindForEpisode: true });
    fadeCandidateCard(false);
  }

  function showCandidateCard(candidate) {
    removeCandidateCard();
    activeCandidate = candidate;

    const isOutro = candidate.kind === "outro";
    const card = document.createElement("aside");
    card.className = "bahamut-helper-candidate";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", t(isOutro ? "candidateAriaOutro" : "candidateAria"));

    const hasPreciseFrame = Boolean(candidate.frame?.previewDataUrl && candidate.frame?.fingerprint);
    const frameAvailable = hasPreciseFrame;
    const existingCount = Number(candidate.existingProfilesCount) || 0;
    const similarIndex = Number.isInteger(candidate.bestExistingIndex) && candidate.bestExistingIndex >= 0
      ? candidate.bestExistingIndex
      : 0;
    const isSimilar = existingCount > 0 && Number(candidate.bestExistingSimilarity) >= AUTO_MATCH_SOFT_THRESHOLD;
    const canAdd = existingCount < MAX_PROFILES_PER_WORK;
    const isExistingPrompt = existingCount > 0;
    let selectedAdjustPoint = "end";

    const startPreviewUrl = candidate.startFrame?.previewDataUrl || candidate.frame?.previewDataUrl || "";
    const endPreviewUrl = candidate.endFrame?.previewDataUrl || "";
    const preview = `
      <div class="bahamut-helper-preview-pair" data-preview-pair>
        <button type="button" class="bahamut-helper-preview-select" data-adjust-point="start" aria-label="${escapeHtml(t("startAdjustLabel"))}">
          <span>${escapeHtml(t("startAdjustLabel"))}</span>
          ${startPreviewUrl
            ? `<img class="bahamut-helper-preview" data-start-preview src="${startPreviewUrl}" alt="${escapeHtml(t("previewAlt"))}">`
            : `<span class="bahamut-helper-preview bahamut-helper-preview--empty" data-start-preview-empty>${escapeHtml(t("previewUnavailable"))}</span>`}
        </button>
        <span class="bahamut-helper-preview-arrow">→</span>
        <button type="button" class="bahamut-helper-preview-select is-selected" data-adjust-point="end" aria-label="${escapeHtml(t("endAdjustLabel"))}">
          <span>${escapeHtml(t("endAdjustLabel"))}</span>
          <img class="bahamut-helper-preview" data-end-preview src="${endPreviewUrl}" alt="${escapeHtml(t("endPreviewAlt"))}" ${endPreviewUrl ? "" : "hidden"}>
        </button>
      </div>`;

    const adjustControls = `
      <div class="bahamut-helper-adjust-panel">
        <div class="bahamut-helper-adjust-head">
          <span data-adjust-point-label>${escapeHtml(t("endAdjustLabel"))}</span>
          <div class="bahamut-helper-adjust-readout">
            <strong data-preview-point>${escapeHtml(t("previewEnd", { time: formatTime(candidate.toTime) }))}</strong>
            <em data-adjust-total>${escapeHtml(t("adjustmentTotal", { offset: formatAdjustmentOffset(candidate.endAdjustmentSeconds ?? candidate.adjustmentSeconds) }))}</em>
          </div>
        </div>
        <div class="bahamut-helper-adjust-buttons" role="group">
          <button type="button" data-adjust-delta="-2">${escapeHtml(t("adjustMinus2"))}</button>
          <button type="button" data-adjust-reset="true" class="is-active">${escapeHtml(t("originalEnd"))}</button>
          <button type="button" data-adjust-delta="2">${escapeHtml(t("adjustPlus2"))}</button>
        </div>
        <div class="bahamut-helper-adjust-help">${escapeHtml(t("pointAdjustHelp"))}</div>
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
            <button class="bahamut-helper-secondary" data-action="skip" type="button">${escapeHtml(t("skipEpisode"))}</button>
            <button class="bahamut-helper-ghost" data-action="later" type="button">${escapeHtml(t("askLater"))}</button>
          </div>
        </div>
        ${preview}
        <div class="bahamut-helper-time-row bahamut-helper-time-row--compact">
          <span data-from-to>${formatTime(candidate.fromTime)} → ${formatTime(candidate.toTime)}</span>
          <strong data-skip-duration>${escapeHtml(t("skipLabel", { duration: formatDuration(candidate.duration) }))}</strong>
        </div>
        ${adjustControls}
        <div class="bahamut-helper-progress"><span></span></div>
      `;
    } else {
      const capabilityNote = frameAvailable
        ? (isInformativeFingerprint(candidate.frame.fingerprint) ? t("capabilityOk") : t("capabilityUninformative"))
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
        <div class="bahamut-helper-capability ${frameAvailable && isInformativeFingerprint(candidate.frame.fingerprint) ? "is-ok" : "is-warning"}">${escapeHtml(capabilityNote)}</div>
        <div class="bahamut-helper-actions has-three">
          <button class="bahamut-helper-primary" data-action="add" type="button" ${frameAvailable ? "" : "disabled"}>${escapeHtml(t(isOutro ? "saveOutro" : "saveIntro"))}</button>
          <button class="bahamut-helper-secondary" data-action="skip" type="button">${escapeHtml(t("skipEpisode"))}</button>
          <button class="bahamut-helper-ghost" data-action="later" type="button">${escapeHtml(t("askLater"))}</button>
        </div>
        <div class="bahamut-helper-progress"><span></span></div>
      `;
    }

    card.insertAdjacentHTML("afterbegin", `
      <div class="bahamut-helper-mini-row" aria-hidden="true">
        <span>${escapeHtml(t(isOutro ? "overlayCompactOutro" : "overlayCompactIntro"))}</span>
        <strong>${formatTime(candidate.fromTime)} → ${formatTime(candidate.toTime)}</strong>
      </div>`);

    getCandidateCardMountPoint().appendChild(card);
    candidateCard = card;
    installCandidateAdaptiveLayout(card);

    const restartExpiry = () => {
      if (candidateExpireTimer !== null) clearTimeout(candidateExpireTimer);
      candidateExpireTimer = setTimeout(() => {
        candidateExpireTimer = null;
        recordCandidateHandled(candidate, "dismissed").catch(() => {});
        fadeCandidateCard(false);
      }, CANDIDATE_LIFETIME_MS);
    };

    const adjustmentForPoint = (point) => point === "start"
      ? Number(candidate.startAdjustmentSeconds) || 0
      : Number(candidate.endAdjustmentSeconds ?? candidate.adjustmentSeconds) || 0;

    const updateAdjustmentUi = () => {
      const fromTo = card.querySelector("[data-from-to]");
      const durationNode = card.querySelector("[data-skip-duration]");
      const pointLabel = card.querySelector("[data-adjust-point-label]");
      const pointNode = card.querySelector("[data-preview-point]");
      const totalNode = card.querySelector("[data-adjust-total]");
      const currentTime = selectedAdjustPoint === "start" ? candidate.fromTime : candidate.toTime;
      const currentAdjustment = adjustmentForPoint(selectedAdjustPoint);
      if (fromTo) fromTo.textContent = `${formatTime(candidate.fromTime)} → ${formatTime(candidate.toTime)}`;
      const miniTime = card.querySelector(".bahamut-helper-mini-row strong");
      if (miniTime) miniTime.textContent = `${formatTime(candidate.fromTime)} → ${formatTime(candidate.toTime)}`;
      if (durationNode) durationNode.textContent = t("skipLabel", { duration: formatDuration(candidate.duration) });
      if (pointLabel) pointLabel.textContent = t(selectedAdjustPoint === "start" ? "startAdjustLabel" : "endAdjustLabel");
      if (pointNode) pointNode.textContent = t(selectedAdjustPoint === "start" ? "previewStart" : "previewEnd", { time: formatTime(currentTime) });
      if (totalNode) totalNode.textContent = t("adjustmentTotal", { offset: formatAdjustmentOffset(currentAdjustment) });
      const resetButton = card.querySelector("[data-adjust-reset]");
      if (resetButton) resetButton.classList.toggle("is-active", Math.abs(currentAdjustment) < 0.0005);
      for (const pointButton of card.querySelectorAll("[data-adjust-point]")) {
        const selected = pointButton.dataset.adjustPoint === selectedAdjustPoint;
        pointButton.classList.toggle("is-selected", selected);
        pointButton.setAttribute("aria-pressed", selected ? "true" : "false");
      }
    };

    for (const pointButton of card.querySelectorAll("[data-adjust-point]")) {
      pointButton.addEventListener("click", () => {
        selectedAdjustPoint = pointButton.dataset.adjustPoint === "start" ? "start" : "end";
        previewCandidatePoint(candidate, selectedAdjustPoint);
        updateAdjustmentUi();
        restartExpiry();
      });
    }

    for (const button of card.querySelectorAll("[data-adjust-delta]")) {
      button.addEventListener("click", () => {
        adjustCandidatePointBy(candidate, selectedAdjustPoint, Number(button.dataset.adjustDelta), { preview: true });
        updateAdjustmentUi();
        restartExpiry();
      });
    }

    card.querySelector("[data-adjust-reset]")?.addEventListener("click", () => {
      applyCandidatePointAdjustment(candidate, selectedAdjustPoint, 0, { preview: true });
      updateAdjustmentUi();
      restartExpiry();
    });

    updateAdjustmentUi();

    const closeCandidateForLater = () => {
      if (candidateExpireTimer !== null) {
        clearTimeout(candidateExpireTimer);
        candidateExpireTimer = null;
      }
      fadeCandidateCard(false);
    };

    card.querySelector(".bahamut-helper-close")?.addEventListener("click", closeCandidateForLater);
    card.querySelector('[data-action="skip"]')?.addEventListener("click", () => {
      skipCurrentCandidateEpisode().catch(() => removeCandidateCard());
    });
    card.querySelector('[data-action="later"]')?.addEventListener("click", closeCandidateForLater);

    async function runSave(button, mode, replaceIndex = 0) {
      if (!frameAvailable || !button || button.disabled) return;
      if (candidateExpireTimer !== null) {
        clearTimeout(candidateExpireTimer);
        candidateExpireTimer = null;
      }

      const actionButtons = [...card.querySelectorAll("[data-action], [data-adjust-point], [data-adjust-delta], [data-adjust-reset]")];
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
    trainingCaptureGeneration += 1;
    trainingCaptureBusy = false;
    suppressLearningUntil = 0;
    activeVideo.removeEventListener("timeupdate", handleTimeUpdate);
    activeVideo.removeEventListener("seeking", handleSeeking);
    activeVideo.removeEventListener("seeked", handleSeeked);
    activeVideo.removeEventListener("loadeddata", handleLoadedData);
    activeVideo.removeEventListener("play", handlePlay);
    activeVideo.removeEventListener("pause", handlePause);
    stopFrameSampler();
    removeOutroCountdown();
    removeNextEpisodeButton();
    activeVideo = null;
    lastStableTime = null;
    lastFrame = null;
    pendingSeekStartFrame = null;
    pendingSeekStartCapturedAt = 0;
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
            pendingSeekStartFrame = null;
        pendingSeekStartCapturedAt = 0;
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
        lastMatchByProfile = new Map();
      }
      if (changes.outroProfiles) {
        outroProfilesCache = { workKey: null, entry: null, loadedAt: 0 };
        outroMatchVotes = new Map();
        lastOutroMatchByProfile = new Map();
      }
      if (changes[PROMPT_HISTORY_KEY]) promptHistoryCache = null;
    });
  }

  function summarizeProfile(profile, index, kind, lastProbeMap) {
    const stats = profileAnchorStats(profile);
    const profileId = typeof profile?.id === "string" ? profile.id : `${profile?.createdAt || 0}:${profile?.startTimeHint || 0}`;
    const probe = lastProbeMap instanceof Map ? lastProbeMap.get(profileId) : null;
    return {
      id: typeof profile?.id === "string" ? profile.id : null,
      index,
      kind,
      precise: stats.count > 0,
      reliable: stats.reliable,
      legacy: !stats.reliable,
      anchorCount: stats.count,
      anchorVersion: stats.version,
      createdAt: Number(profile?.createdAt) || 0,
      startTimeHint: Number(profile?.startTimeHint) || 0,
      endTimeHint: Number(profile?.endTimeHint),
      duration: Number(profile?.duration) || 0,
      startAdjustmentSeconds: Number(profile?.startAdjustmentSeconds) || 0,
      endAdjustmentSeconds: Number(profile?.endAdjustmentSeconds ?? profile?.adjustmentSeconds) || 0,
      adjustmentSeconds: Number(profile?.endAdjustmentSeconds ?? profile?.adjustmentSeconds) || 0,
      startPreviewDataUrl: profile?.startPreviewDataUrl || profile?.previewDataUrl || null,
      endPreviewDataUrl: profile?.endPreviewDataUrl || null,
      sourceEpisodeUrl: typeof profile?.sourceEpisodeUrl === "string" ? profile.sourceEpisodeUrl : "",
      latestSimilarity: probe ? Number(probe.similarity) : null
    };
  }

  async function deleteCurrentWorkProfile(kind, profileId, profileIndex) {
    if (kind !== "intro" && kind !== "outro") return { deleted: false, reason: "INVALID_KIND" };
    const work = identifyWork();
    const all = await getProfiles(kind);
    const entry = all[work.key];
    const profiles = Array.isArray(entry?.profiles) ? [...entry.profiles] : [];
    let index = -1;
    if (typeof profileId === "string" && profileId) index = profiles.findIndex((profile) => profile?.id === profileId);
    if (index < 0 && Number.isInteger(Number(profileIndex))) {
      const candidateIndex = Number(profileIndex);
      if (candidateIndex >= 0 && candidateIndex < profiles.length) index = candidateIndex;
    }
    if (index < 0) return { deleted: false, reason: "NOT_FOUND", work };
    profiles.splice(index, 1);
    if (profiles.length) {
      all[work.key] = { ...entry, profiles, updatedAt: Date.now() };
    } else {
      delete all[work.key];
    }
    await extensionApi.storage.local.set({ [profileStorageKey(kind)]: all });
    setProfileCache(kind, { workKey: null, entry: null, loadedAt: 0 });
    if (kind === "intro") {
      matchVotes = new Map();
      lastMatchByProfile = new Map();
    } else {
      outroMatchVotes = new Map();
      lastOutroMatchByProfile = new Map();
    }
    return { deleted: true, kind, index, work };
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
      introProfiles: (Array.isArray(introEntry?.profiles) ? introEntry.profiles : []).map((profile, index) => summarizeProfile(profile, index, "intro", lastMatchByProfile)),
      outroProfiles: (Array.isArray(outroEntry?.profiles) ? outroEntry.profiles : []).map((profile, index) => summarizeProfile(profile, index, "outro", lastOutroMatchByProfile)),
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
      } else if (message.type === "delete-current-work-profile") {
        responseTask = deleteCurrentWorkProfile(message.kind, message.profileId, message.profileIndex);
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
    document.addEventListener("pointerdown", handlePotentialSeekPointerDown, true);
    document.addEventListener("keydown", handlePotentialSeekKeyDown, true);
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
