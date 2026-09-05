// Unified Netflix + Bahamut popup controller - v2.2.0

const extensionApi = globalThis.browser || globalThis.chrome;
if (!extensionApi) throw new Error("WebExtension API unavailable");

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
  outroLearning: true,
  autoSkipOutro: true,
  language: "zh-TW"
});

const BAHAMUT_TEXT = Object.freeze({
    "zh-TW": {
      title: "動畫瘋自動播放助手",
      subtitle: "分級自動同意 + 片頭／片尾學習與自動跳過",
      language: "語言",
      autoAgreeTitle: "自動按下「同意」",
      autoAgreeDesc: "偵測到分級提示後立即確認",
      introLearningTitle: "片頭快轉學習",
      introLearningDesc: "人工快轉後詢問是否記錄",
      autoSkipTitle: "自動跳過已學習片頭",
      autoSkipDesc: "只在影片前 3 分鐘辨識；成功一次後本集停止片頭偵測",
      outroLearningTitle: "片尾快轉學習",
      outroLearningDesc: "影片最後 4 分鐘的人工快轉可記錄為片尾",
      autoSkipOutroTitle: "自動跳過已學習片尾",
      autoSkipOutroDesc: "最後 4 分鐘辨識片尾；可取消倒數並繼續觀看",
      diagTitle: "目前作品",
      work: "作品",
      workId: "作品 ID",
      video: "播放器",
      frame: "純影格讀取",
      profiles: "已學習片頭",
      matchSimilarity: "最近片頭相似度",
      matchProgress: "累積 {score}/{required}",
      notMatchedYet: "尚未比對",
      autoSkipState: "本集片頭自動跳過",
      outroProfiles: "已學習片尾",
      outroMatchSimilarity: "最近片尾相似度",
      outroAutoSkipState: "本集片尾動作",
      testFrame: "測試純影片影格",
      scan: "重新掃描頁面",
      clear: "刪除目前作品的片頭／片尾學習資料",
      noticePrimary: "v2.2.0：片頭只掃描前 3 分鐘；新增片尾學習、倒數跳過、同集多段學習與 ±2 秒結束點預覽。",
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
      onOutroLearning: "已開啟片尾快轉學習。",
      offOutroLearning: "已暫停片尾快轉學習。",
      onOutroSkip: "已開啟自動片尾辨識與倒數跳過。",
      offOutroSkip: "已暫停自動片尾跳過。",
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
      clearing: "正在刪除目前作品的片頭／片尾學習資料…",
      cleared: "已刪除目前作品的片頭／片尾學習資料。",
      nothingToClear: "目前作品沒有已儲存的片頭／片尾資料。",
      clearFail: "刪除失敗。請確認目前分頁是動畫瘋播放頁。",
      exportLearning: "匯出片頭／片尾學習資料",
      importLearning: "匯入片頭／片尾學習資料",
      exportEmpty: "目前沒有可匯出的片頭／片尾學習資料。",
      exportDone: "已匯出 {works} 部作品、{intro} 組片頭、{outro} 組片尾。",
      exportFail: "片頭／片尾學習資料匯出失敗。",
      importReading: "正在讀取片頭／片尾學習資料…",
      importDone: "匯入完成：{works} 部作品、{intro} 組片頭、{outro} 組片尾；重複資料已自動略過。",
      importInvalid: "這不是有效的動畫瘋片頭／片尾學習資料檔。",
      importFail: "片頭／片尾學習資料匯入失敗。",
      learningBackupNote: "可將作品名稱、作品 ID、片頭／片尾影格指紋、預覽圖與跳過時間完整備份／還原。",
      outroPending: "倒數中",
      outroSkipped: "✓ 已跳過",
      outroNext: "✓ 前往下一集",
      outroCancelled: "已取消",
      loadFail: "設定讀取失敗，已使用預設值。"
    },
    "zh-CN": {
      title: "动画疯自动播放助手",
      subtitle: "分级自动同意 + 片头／片尾学习与自动跳过",
      language: "语言",
      autoAgreeTitle: "自动按下“同意”",
      autoAgreeDesc: "侦测到分级提示后立即确认",
      introLearningTitle: "片头快转学习",
      introLearningDesc: "人工快转后询问是否记录",
      autoSkipTitle: "自动跳过已学习片头",
      autoSkipDesc: "只在影片前 3 分钟辨识；成功一次后本集停止片头侦测",
      outroLearningTitle: "片尾快转学习",
      outroLearningDesc: "影片最后 4 分钟的人工快转可记录为片尾",
      autoSkipOutroTitle: "自动跳过已学习片尾",
      autoSkipOutroDesc: "最后 4 分钟辨识片尾；可取消倒数并继续观看",
      diagTitle: "目前作品",
      work: "作品",
      workId: "作品 ID",
      video: "播放器",
      frame: "纯影格读取",
      profiles: "已学习片头",
      matchSimilarity: "最近片头相似度",
      matchProgress: "累计 {score}/{required}",
      notMatchedYet: "尚未比对",
      autoSkipState: "本集片头自动跳过",
      outroProfiles: "已学习片尾",
      outroMatchSimilarity: "最近片尾相似度",
      outroAutoSkipState: "本集片尾动作",
      testFrame: "测试纯影片影格",
      scan: "重新扫描页面",
      clear: "删除目前作品的片头／片尾学习资料",
      noticePrimary: "v2.2.0：片头只扫描前 3 分钟；新增片尾学习、倒数跳过、同集多段学习与 ±2 秒结束点预览。",
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
      onOutroLearning: "已开启片尾快转学习。",
      offOutroLearning: "已暂停片尾快转学习。",
      onOutroSkip: "已开启自动片尾辨识与倒数跳过。",
      offOutroSkip: "已暂停自动片尾跳过。",
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
      clearing: "正在删除目前作品的片头／片尾学习资料…",
      cleared: "已删除目前作品的片头／片尾学习资料。",
      nothingToClear: "目前作品没有已储存的片头／片尾资料。",
      clearFail: "删除失败。请确认目前分页是动画疯播放页。",
      exportLearning: "导出片头／片尾学习资料",
      importLearning: "导入片头／片尾学习资料",
      exportEmpty: "目前没有可导出的片头／片尾学习资料。",
      exportDone: "已导出 {works} 部作品、{intro} 组片头、{outro} 组片尾。",
      exportFail: "片头／片尾学习资料导出失败。",
      importReading: "正在读取片头／片尾学习资料…",
      importDone: "导入完成：{works} 部作品、{intro} 组片头、{outro} 组片尾；重复资料已自动略过。",
      importInvalid: "这不是有效的动画疯片头／片尾学习资料档。",
      importFail: "片头／片尾学习资料导入失败。",
      learningBackupNote: "可将作品名称、作品 ID、片头／片尾影格指纹、预览图与跳过时间完整备份／还原。",
      outroPending: "倒数中",
      outroSkipped: "✓ 已跳过",
      outroNext: "✓ 前往下一集",
      outroCancelled: "已取消",
      loadFail: "设置读取失败，已使用预设值。"
    },
    en: {
      title: "Bahamut Anime Auto Player",
      subtitle: "Rating consent + opening/ending learning and auto-skip",
      language: "Language",
      autoAgreeTitle: "Automatically click Agree",
      autoAgreeDesc: "Confirms the rating prompt when it appears",
      introLearningTitle: "Learn opening skips",
      introLearningDesc: "Ask to save after a manual opening seek",
      autoSkipTitle: "Auto-skip learned openings",
      autoSkipDesc: "Only scan the first 3 minutes; stop opening matching after one successful skip",
      outroLearningTitle: "Learn ending skips",
      outroLearningDesc: "Manual forward seeks in the final 4 minutes can be saved as endings",
      autoSkipOutroTitle: "Auto-skip learned endings",
      autoSkipOutroDesc: "Match endings in the final 4 minutes with a cancelable countdown",
      diagTitle: "Current title",
      work: "Title",
      workId: "Work ID",
      video: "Player",
      frame: "Pure frame access",
      profiles: "Learned openings",
      matchSimilarity: "Latest opening similarity",
      matchProgress: "vote {score}/{required}",
      notMatchedYet: "Not compared yet",
      autoSkipState: "Opening auto-skip this episode",
      outroProfiles: "Learned endings",
      outroMatchSimilarity: "Latest ending similarity",
      outroAutoSkipState: "Ending action this episode",
      testFrame: "Test pure video frame",
      scan: "Rescan page",
      clear: "Delete opening/ending data for this title",
      noticePrimary: "v2.2.0 limits opening scans to 3 minutes and adds ending learning, countdown skipping, same-episode multi-segment learning, and ±2 sec endpoint preview.",
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
      onOutroLearning: "Ending skip learning enabled.",
      offOutroLearning: "Ending skip learning paused.",
      onOutroSkip: "Automatic ending matching and countdown skipping enabled.",
      offOutroSkip: "Automatic ending skipping paused.",
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
      clearing: "Deleting opening/ending learning data for this title…",
      cleared: "Opening/ending learning data for this title was deleted.",
      nothingToClear: "This title has no saved opening/ending data.",
      clearFail: "Delete failed. Make sure the active tab is a Bahamut Anime playback page.",
      exportLearning: "Export opening/ending learning data",
      importLearning: "Import opening/ending learning data",
      exportEmpty: "There is no opening/ending learning data to export.",
      exportDone: "Exported {works} titles, {intro} openings, and {outro} endings.",
      exportFail: "Opening/ending learning data export failed.",
      importReading: "Reading opening/ending learning data…",
      importDone: "Import complete: {works} titles, {intro} openings, and {outro} endings; duplicates were skipped.",
      importInvalid: "This is not a valid Bahamut opening/ending learning backup file.",
      importFail: "Opening/ending learning data import failed.",
      learningBackupNote: "Back up and restore title names, work IDs, opening/ending frame fingerprints, preview images, and skip durations.",
      outroPending: "Countdown",
      outroSkipped: "✓ Skipped",
      outroNext: "✓ Next episode",
      outroCancelled: "Canceled",
      loadFail: "Settings could not be loaded; defaults are being used."
    }
  });

const $ = (id) => document.getElementById(id);
const NETFLIX_KEYS = Object.keys(NETFLIX_DEFAULTS);
const BAHAMUT_KEYS = ["autoAgree", "introLearning", "autoSkipIntro", "outroLearning", "autoSkipOutro"];

let currentPlatform = "netflix";
let currentBahamutLanguage = "zh-TW";
let activeTab = null;
let platformStatus = null;

const UNIFIED_TEXT = Object.freeze({
  "zh-TW": {
    connected: "已連接動畫瘋頁面",
    unavailable: "請開啟動畫瘋播放頁",
    subtitle: "分級自動同意 + 片頭／片尾學習與自動跳過"
  },
  "zh-CN": {
    connected: "已连接动画疯页面",
    unavailable: "请开启动画疯播放页",
    subtitle: "分级自动同意 + 片头／片尾学习与自动跳过"
  },
  en: {
    connected: "Connected to Bahamut Anime",
    unavailable: "Open a Bahamut Anime playback page",
    subtitle: "Rating consent + opening/ending learning and auto-skip"
  }
});

function getBahamutText(key) {
  return BAHAMUT_TEXT[currentBahamutLanguage]?.[key]
    ?? BAHAMUT_TEXT["zh-TW"]?.[key]
    ?? key;
}

function formatBahamutText(key, values = {}) {
  let text = getBahamutText(key);
  for (const [name, value] of Object.entries(values)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

const INTRO_BACKUP_FORMAT = "netflix-bahamut-auto-player/bahamut-intro-learning";
const LEARNING_BACKUP_FORMAT = "netflix-bahamut-auto-player/bahamut-skip-learning";
const INTRO_BACKUP_VERSION = 1;
const LEARNING_BACKUP_VERSION = 2;
const INTRO_MAX_PROFILES_PER_WORK = 3;


function getUnifiedText(key) {
  return UNIFIED_TEXT[currentBahamutLanguage]?.[key]
    ?? UNIFIED_TEXT["zh-TW"]?.[key]
    ?? key;
}

function applyBrowserI18n() {
  const uiLanguage = extensionApi.i18n.getUILanguage();
  if (uiLanguage) document.documentElement.lang = uiLanguage;

  for (const element of document.querySelectorAll('[data-i18n]')) {
    const key = element.dataset.i18n;
    const message = extensionApi.i18n.getMessage(key);
    if (message) element.textContent = message;
  }
}

function renderVersion() {
  $("versionText").textContent = `v${extensionApi.runtime.getManifest().version}`;
}

async function getActiveTab() {
  const tabs = await extensionApi.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (!tab || typeof tab.id !== "number") throw new Error("NO_ACTIVE_TAB");
  return tab;
}

async function detectPlatform(tab) {
  try {
    const response = await extensionApi.tabs.sendMessage(tab.id, { type: "unified:getPlatformStatus" });
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
    extensionApi.storage.local.set({ unifiedLastPlatform: currentPlatform }).catch(() => {});
  }
}

async function loadNetflixSettings() {
  try {
    const values = await extensionApi.storage.local.get(NETFLIX_KEYS);
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
        await extensionApi.storage.local.set({ [key]: Boolean(event.target.checked) });
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
      : await extensionApi.tabs.sendMessage(tab.id, { type: "netflixSkipper:getStatus" });

    if (response?.active) {
      text.textContent = extensionApi.i18n.getMessage("status_active");
      dot.classList.add("active");
      const total = Object.values(response.stats || {}).reduce((sum, value) => sum + Number(value || 0), 0);
      count.textContent = extensionApi.i18n.getMessage("session_count", String(total));
    } else {
      text.textContent = extensionApi.i18n.getMessage("status_inactive");
      count.textContent = extensionApi.i18n.getMessage("session_count", "0");
    }
  } catch (_error) {
    text.textContent = extensionApi.i18n.getMessage("status_unavailable");
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
    outroLearningTitle: "outroLearningTitle",
    outroLearningDesc: "outroLearningDesc",
    autoSkipOutroTitle: "autoSkipOutroTitle",
    autoSkipOutroDesc: "autoSkipOutroDesc",
    diagTitle: "diagTitle",
    workLabel: "work",
    workIdLabel: "workId",
    videoLabel: "video",
    frameLabel: "frame",
    profileLabel: "profiles",
    matchSimilarityLabel: "matchSimilarity",
    autoSkipStateLabel: "autoSkipState",
    outroProfileLabel: "outroProfiles",
    outroMatchSimilarityLabel: "outroMatchSimilarity",
    outroAutoSkipStateLabel: "outroAutoSkipState",
    testFrame: "testFrame",
    scanNow: "scan",
    clearLearning: "clear",
    exportLearning: "exportLearning",
    importLearning: "importLearning",
    learningBackupNote: "learningBackupNote",
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
    const values = await extensionApi.storage.local.get(BAHAMUT_DEFAULTS);
    applyBahamutLanguage(values.language);
    $("autoAgree").checked = values.autoAgree !== false;
    $("introLearning").checked = values.introLearning !== false;
    $("autoSkipIntro").checked = values.autoSkipIntro !== false;
    $("outroLearning").checked = values.outroLearning !== false;
    $("autoSkipOutro").checked = values.autoSkipOutro !== false;
  } catch (error) {
    applyBahamutLanguage("zh-TW");
    $("autoAgree").checked = true;
    $("introLearning").checked = true;
    $("autoSkipIntro").checked = true;
    $("outroLearning").checked = true;
    $("autoSkipOutro").checked = true;
    setBahamutActionStatus(getBahamutText("loadFail"));
  }
}

function bindBahamutSettings() {
  for (const key of BAHAMUT_KEYS) {
    const checkbox = $(key);
    checkbox.addEventListener("change", async () => {
      try {
        await extensionApi.storage.local.set({ [key]: checkbox.checked });
        flashSaved(checkbox.closest(".setting-item"), "bahamut-saved");
        if (key === "autoAgree") setBahamutActionStatus(checkbox.checked ? getBahamutText("onAgree") : getBahamutText("offAgree"));
        if (key === "introLearning") setBahamutActionStatus(checkbox.checked ? getBahamutText("onLearning") : getBahamutText("offLearning"));
        if (key === "autoSkipIntro") setBahamutActionStatus(checkbox.checked ? getBahamutText("onSkip") : getBahamutText("offSkip"));
        if (key === "outroLearning") setBahamutActionStatus(checkbox.checked ? getBahamutText("onOutroLearning") : getBahamutText("offOutroLearning"));
        if (key === "autoSkipOutro") setBahamutActionStatus(checkbox.checked ? getBahamutText("onOutroSkip") : getBahamutText("offOutroSkip"));
      } catch (error) {
        console.error(`[Unified Popup] Failed to save Bahamut setting ${key}:`, error);
      }
    });
  }

  for (const button of document.querySelectorAll("[data-lang]")) {
    button.addEventListener("click", async () => {
      applyBahamutLanguage(button.dataset.lang);
      await extensionApi.storage.local.set({ language: currentBahamutLanguage });
      await refreshBahamutStatus();
      setBahamutActionStatus(getBahamutText("languageChanged"));
    });
  }

  $("scanNow").addEventListener("click", scanBahamutNow);
  $("testFrame").addEventListener("click", testBahamutFrame);
  $("clearLearning").addEventListener("click", clearBahamutLearning);
  $("exportLearning").addEventListener("click", exportBahamutLearning);
  $("importLearning").addEventListener("click", () => $("importLearningFile").click());
  $("importLearningFile").addEventListener("change", handleBahamutLearningImport);
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
  $("outroProfileCount").textContent = "0";
  $("outroMatchSimilarity").textContent = getBahamutText("notMatchedYet");
  $("outroMatchSimilarity").title = "";
  $("outroAutoSkipState").textContent = "—";
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
  const introCount = Number(result?.introProfileCount ?? result?.profileCount ?? 0);
  const outroCount = Number(result?.outroProfileCount ?? 0);
  $("profileCount").textContent = String(introCount);
  $("outroProfileCount").textContent = String(outroCount);

  const renderProbe = (nodeId, probe) => {
    const similarity = Number(probe?.similarity);
    const voteScore = Number(probe?.voteScore);
    const requiredScore = Number(probe?.requiredScore);
    const progress = Number.isFinite(voteScore) && voteScore > 0 && Number.isFinite(requiredScore)
      ? ` · ${formatBahamutText("matchProgress", { score: voteScore, required: requiredScore })}`
      : "";
    $(nodeId).textContent = Number.isFinite(similarity)
      ? `${(similarity * 100).toFixed(1)}%${progress}`
      : getBahamutText("notMatchedYet");
    $(nodeId).title = probe?.mediaTime != null
      ? `@ ${Number(probe.mediaTime).toFixed(1)}s · ${probe.matchLevel || "none"} · ${Number(probe.sampleIntervalMs || 0)}ms`
      : "";
  };
  renderProbe("matchSimilarity", result?.lastMatchProbe);
  renderProbe("outroMatchSimilarity", result?.lastOutroMatchProbe);

  $("autoSkipState").textContent = result?.autoSkipPerformedThisEpisode
    ? getBahamutText("triggered")
    : getBahamutText("notTriggered");
  const outroState = result?.outroActionThisEpisode;
  $("outroAutoSkipState").textContent = outroState === "pending"
    ? getBahamutText("outroPending")
    : outroState === "skipped"
      ? getBahamutText("outroSkipped")
      : outroState === "next"
        ? getBahamutText("outroNext")
        : outroState === "cancelled"
          ? getBahamutText("outroCancelled")
          : getBahamutText("notTriggered");
  $("clearLearning").disabled = !(introCount || outroCount);
}

async function refreshBahamutStatus(tab = activeTab) {
  try {
    if (!tab?.id) throw new Error("NO_TAB");
    const result = platformStatus?.platform === "bahamut"
      ? platformStatus
      : await extensionApi.tabs.sendMessage(tab.id, { type: "get-learning-status" });
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
    const response = await extensionApi.tabs.sendMessage(tab.id, { type: "scan-now" });
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
    const response = await extensionApi.tabs.sendMessage(tab.id, { type: "test-frame-now" });
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
    const response = await extensionApi.tabs.sendMessage(tab.id, { type: "clear-current-work-profiles" });
    platformStatus = null;
    await refreshBahamutStatus(tab);
    setBahamutActionStatus(response?.cleared ? getBahamutText("cleared") : getBahamutText("nothingToClear"));
  } catch (_error) {
    setBahamutActionStatus(getBahamutText("clearFail"));
  } finally {
    await refreshBahamutStatus();
  }
}

function isValidFingerprint(value) {
  return typeof value === "string" && value.length === 144 && /^[01]+$/.test(value);
}

function sanitizeImportedProfile(profile, kind = "intro") {
  if (!profile || typeof profile !== "object") return null;
  const fingerprints = Array.isArray(profile.fingerprints)
    ? [...new Set(profile.fingerprints.filter(isValidFingerprint))].slice(-10)
    : [];
  if (isValidFingerprint(profile.fingerprint) && !fingerprints.includes(profile.fingerprint)) fingerprints.push(profile.fingerprint);
  if (!fingerprints.length) return null;

  const duration = Number(profile.duration);
  const startTimeHint = Number(profile.startTimeHint);
  const endTimeHint = Number(profile.endTimeHint);
  const adjustmentSeconds = Number(profile.adjustmentSeconds);
  if (!Number.isFinite(duration) || duration <= 1 || duration > 15 * 60) return null;
  const previewDataUrl = typeof profile.previewDataUrl === "string" && profile.previewDataUrl.startsWith("data:image/")
    ? profile.previewDataUrl
    : null;

  return {
    id: typeof profile.id === "string" && profile.id ? profile.id : `${kind}-import-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    createdAt: Number.isFinite(Number(profile.createdAt)) ? Number(profile.createdAt) : Date.now(),
    duration: Number(duration.toFixed(3)),
    startTimeHint: Number.isFinite(startTimeHint) && startTimeHint >= 0 ? Number(startTimeHint.toFixed(3)) : 0,
    endTimeHint: Number.isFinite(endTimeHint) && endTimeHint >= 0 ? Number(endTimeHint.toFixed(3)) : undefined,
    adjustmentSeconds: Number.isFinite(adjustmentSeconds) ? Math.max(-2, Math.min(2, adjustmentSeconds)) : 0,
    fingerprint: fingerprints[fingerprints.length - 1],
    fingerprints,
    fingerprintVersion: 1,
    previewDataUrl,
    previewWidth: Number.isFinite(Number(profile.previewWidth)) ? Number(profile.previewWidth) : 240,
    previewHeight: Number.isFinite(Number(profile.previewHeight)) ? Number(profile.previewHeight) : 135,
    sourceEpisodeUrl: typeof profile.sourceEpisodeUrl === "string" ? profile.sourceEpisodeUrl : ""
  };
}

function profileSignature(profile) {
  const fingerprints = Array.isArray(profile?.fingerprints) ? profile.fingerprints : [];
  return `${profile?.fingerprint || fingerprints[0] || ""}|${Number(profile?.duration || 0).toFixed(1)}|${Number(profile?.startTimeHint || 0).toFixed(1)}`;
}

function sanitizeImportedWorks(rawWorks, kind = "intro") {
  if (!rawWorks || typeof rawWorks !== "object" || Array.isArray(rawWorks)) return {};
  const output = {};
  for (const [workKey, rawEntry] of Object.entries(rawWorks)) {
    if (typeof workKey !== "string" || !workKey || !rawEntry || typeof rawEntry !== "object") continue;
    const profiles = Array.isArray(rawEntry.profiles)
      ? rawEntry.profiles.map((profile) => sanitizeImportedProfile(profile, kind)).filter(Boolean).slice(0, INTRO_MAX_PROFILES_PER_WORK)
      : [];
    if (!profiles.length) continue;
    output[workKey] = {
      workKey,
      workId: rawEntry.workId == null ? null : String(rawEntry.workId),
      title: typeof rawEntry.title === "string" && rawEntry.title.trim() ? rawEntry.title.trim() : workKey,
      updatedAt: Number.isFinite(Number(rawEntry.updatedAt)) ? Number(rawEntry.updatedAt) : Date.now(),
      profiles
    };
  }
  return output;
}

function countProfiles(works) {
  return Object.values(works || {}).reduce((sum, entry) => sum + (Array.isArray(entry?.profiles) ? entry.profiles.length : 0), 0);
}

function mergeLearningWorks(currentRaw, incomingRaw, kind) {
  const merged = sanitizeImportedWorks(currentRaw, kind);
  const incoming = sanitizeImportedWorks(incomingRaw, kind);
  let importedProfiles = 0;
  const touchedWorks = new Set();

  for (const [workKey, importedEntry] of Object.entries(incoming)) {
    const existing = merged[workKey] || {
      workKey,
      workId: importedEntry.workId,
      title: importedEntry.title,
      updatedAt: 0,
      profiles: []
    };
    const profiles = Array.isArray(existing.profiles) ? [...existing.profiles] : [];
    const signatures = new Set(profiles.map(profileSignature));
    for (const profile of importedEntry.profiles) {
      const sig = profileSignature(profile);
      if (signatures.has(sig) || profiles.length >= INTRO_MAX_PROFILES_PER_WORK) continue;
      profiles.push(profile);
      signatures.add(sig);
      importedProfiles += 1;
      touchedWorks.add(workKey);
    }
    if (!merged[workKey] && profiles.length) touchedWorks.add(workKey);
    existing.workId = importedEntry.workId || existing.workId || null;
    existing.title = importedEntry.title || existing.title || workKey;
    existing.updatedAt = Math.max(Number(existing.updatedAt) || 0, Number(importedEntry.updatedAt) || 0, Date.now());
    existing.profiles = profiles.slice(0, INTRO_MAX_PROFILES_PER_WORK);
    merged[workKey] = existing;
  }
  return { merged, importedProfiles, touchedWorks };
}

async function exportBahamutLearning() {
  const button = $("exportLearning");
  button.disabled = true;
  try {
    const stored = await extensionApi.storage.local.get({ introProfiles: {}, outroProfiles: {} });
    const introWorks = sanitizeImportedWorks(stored.introProfiles, "intro");
    const outroWorks = sanitizeImportedWorks(stored.outroProfiles, "outro");
    const introCount = countProfiles(introWorks);
    const outroCount = countProfiles(outroWorks);
    const workCount = new Set([...Object.keys(introWorks), ...Object.keys(outroWorks)]).size;
    if (!workCount || (!introCount && !outroCount)) {
      setBahamutActionStatus(getBahamutText("exportEmpty"));
      return;
    }

    const payload = {
      format: LEARNING_BACKUP_FORMAT,
      schemaVersion: LEARNING_BACKUP_VERSION,
      extensionVersion: extensionApi.runtime.getManifest().version,
      exportedAt: new Date().toISOString(),
      introWorks,
      outroWorks
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bahamut-opening-ending-learning-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    setBahamutActionStatus(formatBahamutText("exportDone", { works: workCount, intro: introCount, outro: outroCount }));
  } catch (error) {
    console.error("[Unified Popup] Bahamut learning export failed:", error);
    setBahamutActionStatus(getBahamutText("exportFail"));
  } finally {
    button.disabled = false;
  }
}

async function handleBahamutLearningImport(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  $("importLearning").disabled = true;
  setBahamutActionStatus(getBahamutText("importReading"));
  try {
    const raw = JSON.parse(await file.text());
    let rawIntro = null;
    let rawOutro = null;
    if (raw?.format === LEARNING_BACKUP_FORMAT) {
      rawIntro = raw.introWorks || {};
      rawOutro = raw.outroWorks || {};
    } else if (raw?.format === INTRO_BACKUP_FORMAT) {
      rawIntro = raw.works || {};
      rawOutro = {};
    } else if (raw?.introProfiles || raw?.outroProfiles) {
      rawIntro = raw.introProfiles || {};
      rawOutro = raw.outroProfiles || {};
    } else {
      throw new Error("INVALID_FORMAT");
    }

    const incomingIntro = sanitizeImportedWorks(rawIntro, "intro");
    const incomingOutro = sanitizeImportedWorks(rawOutro, "outro");
    if (!Object.keys(incomingIntro).length && !Object.keys(incomingOutro).length) throw new Error("INVALID_DATA");

    const stored = await extensionApi.storage.local.get({ introProfiles: {}, outroProfiles: {} });
    const introResult = mergeLearningWorks(stored.introProfiles, incomingIntro, "intro");
    const outroResult = mergeLearningWorks(stored.outroProfiles, incomingOutro, "outro");
    await extensionApi.storage.local.set({ introProfiles: introResult.merged, outroProfiles: outroResult.merged });
    platformStatus = null;
    await refreshBahamutStatus();
    const touched = new Set([...introResult.touchedWorks, ...outroResult.touchedWorks]).size;
    setBahamutActionStatus(formatBahamutText("importDone", {
      works: touched,
      intro: introResult.importedProfiles,
      outro: outroResult.importedProfiles
    }));
  } catch (error) {
    console.error("[Unified Popup] Bahamut learning import failed:", error);
    setBahamutActionStatus(error?.message === "INVALID_FORMAT" || error?.message === "INVALID_DATA"
      ? getBahamutText("importInvalid")
      : getBahamutText("importFail"));
  } finally {
    input.value = "";
    $("importLearning").disabled = false;
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
      const stored = await extensionApi.storage.local.get({ unifiedLastPlatform: "netflix" });
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
