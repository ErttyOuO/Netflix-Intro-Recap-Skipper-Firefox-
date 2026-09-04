// Unified Netflix + Bahamut popup controller - v2.0.0

const NETFLIX_DEFAULTS = Object.freeze({
  skipIntro: true,
  skipRecap: true,
  skipNextEpisode: true,
  dismissStillWatching: false,
  showToast: true
});

const BAHAMUT_DEFAULTS = Object.freeze({
  autoAgree: true,
  introLearning: true,
  autoSkipIntro: true,
  language: "zh-TW"
});

const BAHAMUT_TEXT = Object.freeze({
    "zh-TW": {
      title: "動畫瘋自動播放助手",
      subtitle: "分級自動同意 + 片頭學習與自動跳過",
      language: "語言",
      autoAgreeTitle: "自動按下「同意」",
      autoAgreeDesc: "偵測到分級提示後立即確認",
      introLearningTitle: "片頭快轉學習",
      introLearningDesc: "人工快轉後詢問是否記錄",
      autoSkipTitle: "自動跳過已學習片頭",
      autoSkipDesc: "辨識片頭畫面後直接跳過",
      diagTitle: "目前作品",
      work: "作品",
      workId: "作品 ID",
      video: "播放器",
      frame: "純影格讀取",
      profiles: "已學習片頭",
      matchSimilarity: "最近片頭相似度",
      notMatchedYet: "尚未比對",
      autoSkipState: "本集自動跳過",
      testFrame: "測試純影片影格",
      scan: "重新掃描頁面",
      clear: "刪除目前作品的片頭學習資料",
      noticePrimary: "v1.4.0 新片頭詢問每集只出現一次；只有按「稍後再問」才會再次詢問。",
      noticePrivacy: "影片影格與學習資料只儲存在本機，不會上傳到外部服務。",
      notRead: "尚未讀取",
      notDetected: "未辨識",
      openPlayer: "請開啟動畫瘋播放頁",
      found: "✓ 已找到",
      supported: "✓ 可用",
      blocked: "⚠ CORS 限制",
      failed: "⚠ 讀取失敗",
      waiting: "等待測試",
      notTriggered: "尚未觸發",
      triggered: "✓ 已跳過",
      onAgree: "已開啟自動同意。",
      offAgree: "已暫停自動同意。",
      onLearning: "已開啟片頭快轉學習。",
      offLearning: "已暫停片頭快轉學習。",
      onSkip: "已開啟自動片頭辨識與跳過。",
      offSkip: "已暫停自動片頭跳過。",
      languageChanged: "介面語言已更新。",
      scanning: "正在重新掃描目前頁面…",
      clickedAgree: "已偵測並按下「同意」。",
      scanDone: "掃描完成。",
      scanFail: "請先開啟動畫瘋播放頁再重新掃描。",
      testing: "正在從播放器測試純影片影格…",
      noPlayer: "目前找不到動畫瘋播放器。請先開始播放影片。",
      testSuccess: "成功：可取得純影片影格，視覺辨識可使用。",
      corsFail: "此影片來源受到 CORS 限制，無法直接讀取純影片像素。",
      testGenericFail: "目前尚無法取得有效影片影格。",
      testPageFail: "測試失敗。請確認目前分頁是動畫瘋播放頁。",
      clearing: "正在刪除目前作品的片頭學習資料…",
      cleared: "已刪除目前作品的片頭學習資料。",
      nothingToClear: "目前作品沒有已儲存的片頭資料。",
      clearFail: "刪除失敗。請確認目前分頁是動畫瘋播放頁。",
      loadFail: "設定讀取失敗，已使用預設值。"
    },
    "zh-CN": {
      title: "动画疯自动播放助手",
      subtitle: "分级自动同意 + 片头学习与自动跳过",
      language: "语言",
      autoAgreeTitle: "自动按下“同意”",
      autoAgreeDesc: "侦测到分级提示后立即确认",
      introLearningTitle: "片头快转学习",
      introLearningDesc: "人工快转后询问是否记录",
      autoSkipTitle: "自动跳过已学习片头",
      autoSkipDesc: "辨识片头画面后直接跳过",
      diagTitle: "目前作品",
      work: "作品",
      workId: "作品 ID",
      video: "播放器",
      frame: "纯影格读取",
      profiles: "已学习片头",
      matchSimilarity: "最近片头相似度",
      notMatchedYet: "尚未比对",
      autoSkipState: "本集自动跳过",
      testFrame: "测试纯影片影格",
      scan: "重新扫描页面",
      clear: "删除目前作品的片头学习资料",
      noticePrimary: "v1.4.0 新片头询问每集只出现一次；只有按“稍后再问”才会再次询问。",
      noticePrivacy: "影片影格与学习资料只储存在本机，不会上传到外部服务。",
      notRead: "尚未读取",
      notDetected: "未辨识",
      openPlayer: "请开启动画疯播放页",
      found: "✓ 已找到",
      supported: "✓ 可用",
      blocked: "⚠ CORS 限制",
      failed: "⚠ 读取失败",
      waiting: "等待测试",
      notTriggered: "尚未触发",
      triggered: "✓ 已跳过",
      onAgree: "已开启自动同意。",
      offAgree: "已暂停自动同意。",
      onLearning: "已开启片头快转学习。",
      offLearning: "已暂停片头快转学习。",
      onSkip: "已开启自动片头辨识与跳过。",
      offSkip: "已暂停自动片头跳过。",
      languageChanged: "界面语言已更新。",
      scanning: "正在重新扫描目前页面…",
      clickedAgree: "已侦测并按下“同意”。",
      scanDone: "扫描完成。",
      scanFail: "请先开启动画疯播放页再重新扫描。",
      testing: "正在从播放器测试纯影片影格…",
      noPlayer: "目前找不到动画疯播放器。请先开始播放影片。",
      testSuccess: "成功：可取得纯影片影格，视觉辨识可使用。",
      corsFail: "此影片来源受到 CORS 限制，无法直接读取纯影片像素。",
      testGenericFail: "目前尚无法取得有效影片影格。",
      testPageFail: "测试失败。请确认目前分页是动画疯播放页。",
      clearing: "正在删除目前作品的片头学习资料…",
      cleared: "已删除目前作品的片头学习资料。",
      nothingToClear: "目前作品没有已储存的片头资料。",
      clearFail: "删除失败。请确认目前分页是动画疯播放页。",
      loadFail: "设置读取失败，已使用预设值。"
    },
    en: {
      title: "Bahamut Anime Auto Player",
      subtitle: "Rating consent + opening learning and auto-skip",
      language: "Language",
      autoAgreeTitle: "Automatically click Agree",
      autoAgreeDesc: "Confirms the rating prompt when it appears",
      introLearningTitle: "Learn opening skips",
      introLearningDesc: "Ask to save after a manual opening seek",
      autoSkipTitle: "Auto-skip learned openings",
      autoSkipDesc: "Skip when a learned opening is recognized",
      diagTitle: "Current title",
      work: "Title",
      workId: "Work ID",
      video: "Player",
      frame: "Pure frame access",
      profiles: "Learned openings",
      matchSimilarity: "Latest opening similarity",
      notMatchedYet: "Not compared yet",
      autoSkipState: "Auto-skip this episode",
      testFrame: "Test pure video frame",
      scan: "Rescan page",
      clear: "Delete opening data for this title",
      noticePrimary: "v1.4.0 asks about opening candidates once per episode unless you choose Ask later.",
      noticePrivacy: "Video frames and learning data stay on this device and are never uploaded to an external service.",
      notRead: "Not loaded",
      notDetected: "Not detected",
      openPlayer: "Open a Bahamut Anime playback page",
      found: "✓ Found",
      supported: "✓ Available",
      blocked: "⚠ CORS blocked",
      failed: "⚠ Read failed",
      waiting: "Waiting for test",
      notTriggered: "Not triggered",
      triggered: "✓ Skipped",
      onAgree: "Automatic consent enabled.",
      offAgree: "Automatic consent paused.",
      onLearning: "Opening skip learning enabled.",
      offLearning: "Opening skip learning paused.",
      onSkip: "Automatic opening matching and skipping enabled.",
      offSkip: "Automatic opening skipping paused.",
      languageChanged: "Interface language updated.",
      scanning: "Rescanning the current page…",
      clickedAgree: "Detected and clicked Agree.",
      scanDone: "Scan complete.",
      scanFail: "Open a Bahamut Anime playback page before rescanning.",
      testing: "Testing a pure frame from the video player…",
      noPlayer: "No Bahamut Anime player found. Start video playback first.",
      testSuccess: "Success: pure video frames are readable and visual matching is available.",
      corsFail: "This video source is blocked by CORS, so pure video pixels cannot be read directly.",
      testGenericFail: "A valid video frame is not available yet.",
      testPageFail: "Test failed. Make sure the active tab is a Bahamut Anime playback page.",
      clearing: "Deleting opening learning data for this title…",
      cleared: "Opening learning data for this title was deleted.",
      nothingToClear: "This title has no saved opening data.",
      clearFail: "Delete failed. Make sure the active tab is a Bahamut Anime playback page.",
      loadFail: "Settings could not be loaded; defaults are being used."
    }
  });

const $ = (id) => document.getElementById(id);
const NETFLIX_KEYS = Object.keys(NETFLIX_DEFAULTS);
const BAHAMUT_KEYS = ["autoAgree", "introLearning", "autoSkipIntro"];

let currentPlatform = "netflix";
let currentBahamutLanguage = "zh-TW";
let activeTab = null;
let platformStatus = null;

const UNIFIED_TEXT = Object.freeze({
  "zh-TW": {
    connected: "已連接動畫瘋頁面",
    unavailable: "請開啟動畫瘋播放頁",
    subtitle: "分級自動同意 + 片頭學習與自動跳過"
  },
  "zh-CN": {
    connected: "已连接动画疯页面",
    unavailable: "请开启动画疯播放页",
    subtitle: "分级自动同意 + 片头学习与自动跳过"
  },
  en: {
    connected: "Connected to Bahamut Anime",
    unavailable: "Open a Bahamut Anime playback page",
    subtitle: "Rating consent + opening learning and auto-skip"
  }
});

function getBahamutText(key) {
  return BAHAMUT_TEXT[currentBahamutLanguage]?.[key]
    ?? BAHAMUT_TEXT["zh-TW"]?.[key]
    ?? key;
}

function getUnifiedText(key) {
  return UNIFIED_TEXT[currentBahamutLanguage]?.[key]
    ?? UNIFIED_TEXT["zh-TW"]?.[key]
    ?? key;
}

function applyBrowserI18n() {
  const uiLanguage = browser.i18n.getUILanguage();
  if (uiLanguage) document.documentElement.lang = uiLanguage;

  for (const element of document.querySelectorAll('[data-i18n]')) {
    const key = element.dataset.i18n;
    const message = browser.i18n.getMessage(key);
    if (message) element.textContent = message;
  }
}

function renderVersion() {
  $("versionText").textContent = `v${browser.runtime.getManifest().version}`;
}

async function getActiveTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab || typeof tab.id !== "number") throw new Error("NO_ACTIVE_TAB");
  return tab;
}

async function detectPlatform(tab) {
  try {
    const response = await browser.tabs.sendMessage(tab.id, { type: "unified:getPlatformStatus" });
    if (response?.platform === "netflix" || response?.platform === "bahamut") return response;
  } catch (_error) {
    // Unsupported tabs are expected to have no content script receiver.
  }
  return null;
}

function selectPlatform(platform, { remember = false } = {}) {
  currentPlatform = platform === "bahamut" ? "bahamut" : "netflix";

  for (const button of document.querySelectorAll(".platform-tab")) {
    const active = button.dataset.platform === currentPlatform;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  }

  $("netflixPanel").classList.toggle("is-hidden", currentPlatform !== "netflix");
  $("bahamutPanel").classList.toggle("is-hidden", currentPlatform !== "bahamut");

  if (remember) {
    browser.storage.local.set({ unifiedLastPlatform: currentPlatform }).catch(() => {});
  }
}

async function loadNetflixSettings() {
  try {
    const values = await browser.storage.local.get(NETFLIX_KEYS);
    for (const key of NETFLIX_KEYS) {
      const checkbox = $(key);
      if (checkbox) checkbox.checked = values[key] ?? NETFLIX_DEFAULTS[key];
    }
  } catch (error) {
    console.error("[Unified Popup] Failed to load Netflix settings:", error);
  }
}

function bindNetflixSettings() {
  for (const key of NETFLIX_KEYS) {
    const checkbox = $(key);
    if (!checkbox) continue;
    checkbox.addEventListener("change", async (event) => {
      try {
        await browser.storage.local.set({ [key]: Boolean(event.target.checked) });
        flashSaved(event.target.closest(".setting-item"), "netflix-saved");
      } catch (error) {
        console.error(`[Unified Popup] Failed to save Netflix setting ${key}:`, error);
      }
    });
  }
}

function flashSaved(item, className) {
  if (!item) return;
  item.classList.add("saved", className);
  window.setTimeout(() => item.classList.remove("saved", className), 300);
}

async function refreshNetflixStatus(tab = activeTab) {
  const text = $("netflixStatusText");
  const dot = $("netflixStatusDot");
  const count = $("netflixSessionCount");
  dot.classList.remove("active");

  try {
    if (!tab?.id) throw new Error("NO_TAB");
    const response = platformStatus?.platform === "netflix"
      ? platformStatus
      : await browser.tabs.sendMessage(tab.id, { type: "netflixSkipper:getStatus" });

    if (response?.active) {
      text.textContent = browser.i18n.getMessage("status_active");
      dot.classList.add("active");
      const total = Object.values(response.stats || {}).reduce((sum, value) => sum + Number(value || 0), 0);
      count.textContent = browser.i18n.getMessage("session_count", String(total));
    } else {
      text.textContent = browser.i18n.getMessage("status_inactive");
      count.textContent = browser.i18n.getMessage("session_count", "0");
    }
  } catch (_error) {
    text.textContent = browser.i18n.getMessage("status_unavailable");
    count.textContent = "";
  }
}

function applyBahamutLanguage(lang) {
  currentBahamutLanguage = BAHAMUT_TEXT[lang] ? lang : "zh-TW";

  for (const button of document.querySelectorAll("[data-lang]")) {
    const active = button.dataset.lang === currentBahamutLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }

  const mapping = {
    autoAgreeTitle: "autoAgreeTitle",
    autoAgreeDesc: "autoAgreeDesc",
    introLearningTitle: "introLearningTitle",
    introLearningDesc: "introLearningDesc",
    autoSkipTitle: "autoSkipTitle",
    autoSkipDesc: "autoSkipDesc",
    diagTitle: "diagTitle",
    workLabel: "work",
    workIdLabel: "workId",
    videoLabel: "video",
    frameLabel: "frame",
    profileLabel: "profiles",
    matchSimilarityLabel: "matchSimilarity",
    autoSkipStateLabel: "autoSkipState",
    testFrame: "testFrame",
    scanNow: "scan",
    clearLearning: "clear",
    noticePrimary: "noticePrimary",
    noticePrivacy: "noticePrivacy",
    languageLabel: "language"
  };

  for (const [id, key] of Object.entries(mapping)) {
    const node = $(id);
    if (node) node.textContent = getBahamutText(key);
  }

  $("bahamutStatusSub").textContent = getUnifiedText("subtitle");
}

async function loadBahamutSettings() {
  try {
    const values = await browser.storage.local.get(BAHAMUT_DEFAULTS);
    applyBahamutLanguage(values.language);
    $("autoAgree").checked = values.autoAgree !== false;
    $("introLearning").checked = values.introLearning !== false;
    $("autoSkipIntro").checked = values.autoSkipIntro !== false;
  } catch (error) {
    applyBahamutLanguage("zh-TW");
    $("autoAgree").checked = true;
    $("introLearning").checked = true;
    $("autoSkipIntro").checked = true;
    setBahamutActionStatus(getBahamutText("loadFail"));
  }
}

function bindBahamutSettings() {
  for (const key of BAHAMUT_KEYS) {
    const checkbox = $(key);
    checkbox.addEventListener("change", async () => {
      try {
        await browser.storage.local.set({ [key]: checkbox.checked });
        flashSaved(checkbox.closest(".setting-item"), "bahamut-saved");
        if (key === "autoAgree") setBahamutActionStatus(checkbox.checked ? getBahamutText("onAgree") : getBahamutText("offAgree"));
        if (key === "introLearning") setBahamutActionStatus(checkbox.checked ? getBahamutText("onLearning") : getBahamutText("offLearning"));
        if (key === "autoSkipIntro") setBahamutActionStatus(checkbox.checked ? getBahamutText("onSkip") : getBahamutText("offSkip"));
      } catch (error) {
        console.error(`[Unified Popup] Failed to save Bahamut setting ${key}:`, error);
      }
    });
  }

  for (const button of document.querySelectorAll("[data-lang]")) {
    button.addEventListener("click", async () => {
      applyBahamutLanguage(button.dataset.lang);
      await browser.storage.local.set({ language: currentBahamutLanguage });
      await refreshBahamutStatus();
      setBahamutActionStatus(getBahamutText("languageChanged"));
    });
  }

  $("scanNow").addEventListener("click", scanBahamutNow);
  $("testFrame").addEventListener("click", testBahamutFrame);
  $("clearLearning").addEventListener("click", clearBahamutLearning);
}

function setBahamutActionStatus(message) {
  $("bahamutActionStatus").textContent = message || "";
}

function renderFrameStatus(capability) {
  const state = capability?.status || "waiting";
  if (state === "supported") return getBahamutText("supported");
  if (state === "blocked") return getBahamutText("blocked");
  if (state === "error") return getBahamutText("failed");
  return getBahamutText("waiting");
}

function renderBahamutDisconnected() {
  $("bahamutStatusDot").classList.remove("active");
  $("bahamutStatusText").textContent = getUnifiedText("unavailable");
  $("workTitle").textContent = getBahamutText("openPlayer");
  $("workId").textContent = "—";
  $("videoStatus").textContent = "—";
  $("frameStatus").textContent = "—";
  $("profileCount").textContent = "0";
  $("matchSimilarity").textContent = getBahamutText("notMatchedYet");
  $("matchSimilarity").title = "";
  $("autoSkipState").textContent = "—";
  $("clearLearning").disabled = true;
}

function renderBahamutStatus(result) {
  $("bahamutStatusDot").classList.add("active");
  $("bahamutStatusText").textContent = getUnifiedText("connected");
  $("workTitle").textContent = result?.work?.title || getBahamutText("notDetected");
  $("workId").textContent = result?.work?.workId || "—";
  $("videoStatus").textContent = result?.videoFound ? getBahamutText("found") : getBahamutText("notDetected");
  $("frameStatus").textContent = renderFrameStatus(result?.frameCapability);
  $("frameStatus").title = result?.frameCapability?.reason || "";
  $("profileCount").textContent = String(result?.profileCount || 0);
  const similarity = Number(result?.lastMatchProbe?.similarity);
  $("matchSimilarity").textContent = Number.isFinite(similarity)
    ? `${(similarity * 100).toFixed(1)}%`
    : getBahamutText("notMatchedYet");
  $("matchSimilarity").title = result?.lastMatchProbe?.mediaTime != null
    ? `@ ${Number(result.lastMatchProbe.mediaTime).toFixed(1)}s`
    : "";
  $("autoSkipState").textContent = result?.autoSkipPerformedThisEpisode
    ? getBahamutText("triggered")
    : getBahamutText("notTriggered");
  $("clearLearning").disabled = !result?.profileCount;
}

async function refreshBahamutStatus(tab = activeTab) {
  try {
    if (!tab?.id) throw new Error("NO_TAB");
    const result = platformStatus?.platform === "bahamut"
      ? platformStatus
      : await browser.tabs.sendMessage(tab.id, { type: "get-learning-status" });
    renderBahamutStatus(result);
    return result;
  } catch (_error) {
    renderBahamutDisconnected();
    return null;
  }
}

async function scanBahamutNow() {
  const button = $("scanNow");
  button.disabled = true;
  setBahamutActionStatus(getBahamutText("scanning"));
  try {
    const tab = activeTab || await getActiveTab();
    const response = await browser.tabs.sendMessage(tab.id, { type: "scan-now" });
    platformStatus = null;
    await refreshBahamutStatus(tab);
    setBahamutActionStatus(response?.clicked ? getBahamutText("clickedAgree") : getBahamutText("scanDone"));
  } catch (_error) {
    setBahamutActionStatus(getBahamutText("scanFail"));
  } finally {
    button.disabled = false;
  }
}

async function testBahamutFrame() {
  const button = $("testFrame");
  button.disabled = true;
  setBahamutActionStatus(getBahamutText("testing"));
  try {
    const tab = activeTab || await getActiveTab();
    const response = await browser.tabs.sendMessage(tab.id, { type: "test-frame-now" });
    platformStatus = null;
    await refreshBahamutStatus(tab);
    if (!response?.videoFound) setBahamutActionStatus(getBahamutText("noPlayer"));
    else if (response?.captured) setBahamutActionStatus(getBahamutText("testSuccess"));
    else if (response?.frameCapability?.status === "blocked") setBahamutActionStatus(getBahamutText("corsFail"));
    else setBahamutActionStatus(response?.frameCapability?.reason || getBahamutText("testGenericFail"));
  } catch (_error) {
    setBahamutActionStatus(getBahamutText("testPageFail"));
  } finally {
    button.disabled = false;
  }
}

async function clearBahamutLearning() {
  const button = $("clearLearning");
  button.disabled = true;
  setBahamutActionStatus(getBahamutText("clearing"));
  try {
    const tab = activeTab || await getActiveTab();
    const response = await browser.tabs.sendMessage(tab.id, { type: "clear-current-work-profiles" });
    platformStatus = null;
    await refreshBahamutStatus(tab);
    setBahamutActionStatus(response?.cleared ? getBahamutText("cleared") : getBahamutText("nothingToClear"));
  } catch (_error) {
    setBahamutActionStatus(getBahamutText("clearFail"));
  } finally {
    await refreshBahamutStatus();
  }
}

function bindPlatformTabs() {
  for (const button of document.querySelectorAll(".platform-tab")) {
    button.addEventListener("click", () => selectPlatform(button.dataset.platform, { remember: true }));
  }
}

async function init() {
  applyBrowserI18n();
  renderVersion();
  bindPlatformTabs();
  bindNetflixSettings();
  bindBahamutSettings();

  await Promise.all([loadNetflixSettings(), loadBahamutSettings()]);

  try {
    activeTab = await getActiveTab();
    platformStatus = await detectPlatform(activeTab);
  } catch (_error) {
    activeTab = null;
    platformStatus = null;
  }

  let initialPlatform = platformStatus?.platform;
  if (!initialPlatform) {
    try {
      const stored = await browser.storage.local.get({ unifiedLastPlatform: "netflix" });
      initialPlatform = stored.unifiedLastPlatform === "bahamut" ? "bahamut" : "netflix";
    } catch (_error) {
      initialPlatform = "netflix";
    }
  }

  selectPlatform(initialPlatform);
  await Promise.all([refreshNetflixStatus(), refreshBahamutStatus()]);
}

document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => console.error("[Unified Popup] Initialization failed:", error));
});
