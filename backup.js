// Standalone Bahamut backup manager - v2.2.9
(() => {
  "use strict";

  const extensionApi = globalThis.browser ?? globalThis.chrome;
  const core = globalThis.BahamutBackupCore;
  if (!extensionApi?.storage?.local || !core) return;

  const TEXT = {
    "zh-TW": {
      pageTitle: "動畫瘋學習資料備份管理",
      pageSubtitle: "在固定頁面完成匯入、還原、匯出與預覽，不受瀏覽器工具列 Popup 關閉影響。",
      localTitle: "目前瀏覽器中的學習資料",
      localDesc: "這裡直接讀取擴充功能的 browser.storage.local。",
      exportButton: "匯出目前資料",
      importTitle: "匯入／還原備份",
      importDesc: "可一次選取一個或多個 JSON。選檔後會先驗證與預覽，不會立刻覆寫資料。",
      dropTitle: "選擇備份 JSON",
      dropHint: "也可以把多個 JSON 拖曳到這裡",
      previewTitle: "匯入前預覽",
      mergeButton: "合併到現有資料",
      replaceButton: "用備份完整還原",
      modeHelp: "「合併」保留目前資料並加入備份中缺少的片段；「完整還原」會以這份備份取代目前所有動畫瘋片頭／片尾學習資料。",
      privacyText: "所有匯入、預覽、合併與匯出都只在本機 Firefox 中完成，不會上傳到任何伺服器。",
      works: "作品",
      intro: "片頭",
      outro: "片尾",
      profiles: "片段",
      previews: "預覽圖",
      start: "入點",
      end: "結束",
      noImage: "沒有預覽圖",
      noData: "目前沒有已儲存的動畫瘋片頭／片尾資料。",
      anchors: "錨點",
      duration: "長度",
      adjustment: "微調",
      delete: "刪除",
      loading: "正在讀取本機資料…",
      reading: "正在驗證備份檔…",
      invalid: "無法讀取備份：{name}。這不是有效的動畫瘋學習資料 JSON。",
      selected: "已讀取 {files} 個檔案，合併後可還原 {works} 部作品、{intro} 組片頭、{outro} 組片尾。",
      oldSchema: "備份包含舊 schema {schema}，已在預覽階段轉換成目前可使用的格式。",
      missingPreview: "有 {count} 個入點／結束點沒有預覽圖；指紋與錨點仍可保留，但畫面管理頁會顯示空白提示。",
      legacy: "有 {count} 組舊式或不足 3 個可靠錨點的 Profile；會匯入保存，但自動辨識可靠度可能較低。",
      exportEmpty: "目前沒有資料可匯出。",
      exportDone: "已下載備份：{works} 部作品、{intro} 組片頭、{outro} 組片尾。",
      mergeDone: "合併完成並重新讀取驗證：新增 {added}、升級 {upgraded}、已存在 {duplicates}、因每部最多 3 組而略過 {capped}。目前共有 {works} 部作品、{intro} 組片頭、{outro} 組片尾。",
      replaceConfirm: "完整還原會取代目前所有動畫瘋片頭／片尾學習資料。確定要繼續嗎？",
      replaceDone: "完整還原完成並重新讀取驗證：{works} 部作品、{intro} 組片頭、{outro} 組片尾。",
      deleteConfirm: "確定刪除這一組學習片段嗎？",
      deleteDone: "已刪除，並重新讀取本機資料。",
      writeFail: "寫入失敗，原資料沒有被確認為成功還原。",
      sameData: "備份已成功讀取，但這些 Profile 已經存在，所以合併模式不會重複新增。若要讓本機資料完全等於備份，請使用「完整還原」。"
    },
    "zh-CN": {
      pageTitle: "动画疯学习资料备份管理",
      pageSubtitle: "在固定页面完成导入、还原、导出与预览，不受浏览器工具栏 Popup 关闭影响。",
      localTitle: "目前浏览器中的学习资料", localDesc: "这里直接读取扩展的 browser.storage.local。", exportButton: "导出目前资料",
      importTitle: "导入／还原备份", importDesc: "可一次选择一个或多个 JSON。选档后会先验证与预览，不会立刻覆盖资料。",
      dropTitle: "选择备份 JSON", dropHint: "也可以把多个 JSON 拖到这里", previewTitle: "导入前预览",
      mergeButton: "合并到现有资料", replaceButton: "用备份完整还原", modeHelp: "“合并”保留目前资料并加入备份中缺少的片段；“完整还原”会用这份备份替换目前所有动画疯片头／片尾学习资料。",
      privacyText: "所有导入、预览、合并与导出都只在本机 Firefox 中完成，不会上传到任何服务器。",
      works: "作品", intro: "片头", outro: "片尾", profiles: "片段", previews: "预览图", start: "入点", end: "结束", noImage: "没有预览图", noData: "目前没有已储存的动画疯片头／片尾资料。",
      anchors: "锚点", duration: "长度", adjustment: "微调", delete: "删除", loading: "正在读取本机资料…", reading: "正在验证备份档…",
      invalid: "无法读取备份：{name}。这不是有效的动画疯学习资料 JSON。", selected: "已读取 {files} 个档案，合并后可还原 {works} 部作品、{intro} 组片头、{outro} 组片尾。",
      oldSchema: "备份包含旧 schema {schema}，已在预览阶段转换成目前可使用的格式。", missingPreview: "有 {count} 个入点／结束点没有预览图；指纹与锚点仍可保留，但画面管理页会显示空白提示。",
      legacy: "有 {count} 组旧式或不足 3 个可靠锚点的 Profile；会导入保存，但自动辨识可靠度可能较低。", exportEmpty: "目前没有资料可导出。",
      exportDone: "已下载备份：{works} 部作品、{intro} 组片头、{outro} 组片尾。", mergeDone: "合并完成并重新读取验证：新增 {added}、升级 {upgraded}、已存在 {duplicates}、因每部最多 3 组而略过 {capped}。目前共有 {works} 部作品、{intro} 组片头、{outro} 组片尾。",
      replaceConfirm: "完整还原会替换目前所有动画疯片头／片尾学习资料。确定要继续吗？", replaceDone: "完整还原完成并重新读取验证：{works} 部作品、{intro} 组片头、{outro} 组片尾。",
      deleteConfirm: "确定删除这一组学习片段吗？", deleteDone: "已删除，并重新读取本机资料。", writeFail: "写入失败，原资料没有被确认为成功还原。",
      sameData: "备份已成功读取，但这些 Profile 已经存在，所以合并模式不会重复新增。若要让本机资料完全等于备份，请使用“完整还原”。"
    },
    en: {
      pageTitle: "Bahamut Learning Backup Manager", pageSubtitle: "Import, restore, export, and preview in a persistent extension page instead of the toolbar popup.",
      localTitle: "Learning data stored in this browser", localDesc: "This view reads the extension's browser.storage.local directly.", exportButton: "Export current data",
      importTitle: "Import / restore backup", importDesc: "Select one or more JSON files. They are validated and previewed before anything is written.",
      dropTitle: "Choose backup JSON", dropHint: "You can also drop multiple JSON files here", previewTitle: "Import preview", mergeButton: "Merge with current data", replaceButton: "Restore backup exactly",
      modeHelp: "Merge keeps current profiles and adds missing ones. Exact restore replaces all current Bahamut opening/ending learning data with this backup.", privacyText: "Import, preview, merge, and export happen only inside your local Firefox profile and are never uploaded.",
      works: "Titles", intro: "Openings", outro: "Endings", profiles: "Profiles", previews: "Preview images", start: "Start", end: "End", noImage: "No preview", noData: "No Bahamut opening/ending learning data is currently stored.",
      anchors: "anchors", duration: "duration", adjustment: "adjustment", delete: "Delete", loading: "Reading local data…", reading: "Validating backup…",
      invalid: "Could not read {name}. It is not a valid Bahamut learning backup JSON.", selected: "Read {files} file(s). Combined restore contains {works} titles, {intro} openings, and {outro} endings.",
      oldSchema: "Backup includes older schema {schema}; it has been migrated in the preview.", missingPreview: "{count} start/end preview(s) are missing. Fingerprints and anchors are preserved, but the manager will show an empty image placeholder.",
      legacy: "{count} profile(s) are legacy or have fewer than 3 reliable anchors. They are preserved, but automatic matching may be less reliable.", exportEmpty: "There is no data to export.",
      exportDone: "Downloaded backup with {works} titles, {intro} openings, and {outro} endings.", mergeDone: "Merge completed and verified by reading storage back: added {added}, upgraded {upgraded}, already present {duplicates}, capped {capped}. Current total: {works} titles, {intro} openings, {outro} endings.",
      replaceConfirm: "Exact restore replaces all current Bahamut opening/ending learning data. Continue?", replaceDone: "Exact restore completed and verified: {works} titles, {intro} openings, {outro} endings.",
      deleteConfirm: "Delete this learned profile?", deleteDone: "Deleted and re-read local storage.", writeFail: "Write verification failed; the restore was not confirmed.",
      sameData: "The backup was read successfully, but these profiles already exist, so merge mode adds nothing. Use Exact restore if local data should become identical to the backup."
    }
  };

  let language = "zh-TW";
  let selectedImport = null;
  let selectedFiles = [];

  const $ = (id) => document.getElementById(id);
  const tx = (key, vars = {}) => {
    let value = TEXT[language]?.[key] ?? TEXT["zh-TW"]?.[key] ?? key;
    for (const [name, replacement] of Object.entries(vars)) value = value.replaceAll(`{${name}}`, String(replacement));
    return value;
  };

  function formatTime(seconds) {
    const value = Number(seconds);
    if (!Number.isFinite(value) || value < 0) return "—";
    const total = Math.floor(value);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function applyText() {
    const map = {
      pageTitle: "pageTitle", pageSubtitle: "pageSubtitle", localTitle: "localTitle", localDesc: "localDesc",
      exportButton: "exportButton", importTitle: "importTitle", importDesc: "importDesc", dropTitle: "dropTitle", dropHint: "dropHint",
      previewTitle: "previewTitle", mergeButton: "mergeButton", replaceButton: "replaceButton", modeHelp: "modeHelp", privacyText: "privacyText"
    };
    for (const [id, key] of Object.entries(map)) if ($(id)) $(id).textContent = tx(key);
  }

  function setStatus(message, type = "") {
    const el = $("importStatus");
    el.textContent = message || "";
    el.className = `status${type ? ` ${type}` : ""}`;
  }

  function summaryCards(container, summary) {
    container.replaceChildren();
    const items = [
      [tx("works"), summary.works], [tx("intro"), summary.intro], [tx("outro"), summary.outro], [tx("previews"), `${summary.previews}/${summary.total * 2}`]
    ];
    for (const [label, value] of items) {
      const card = document.createElement("div");
      card.className = "summary-card";
      const span = document.createElement("span"); span.textContent = label;
      const strong = document.createElement("strong"); strong.textContent = String(value);
      card.append(span, strong); container.appendChild(card);
    }
  }

  function makeFrame(label, src) {
    const frame = document.createElement("div"); frame.className = "frame";
    const name = document.createElement("span"); name.className = "frame-label"; name.textContent = label;
    frame.appendChild(name);
    if (src) {
      const img = document.createElement("img"); img.src = src; img.alt = label; img.loading = "lazy"; frame.appendChild(img);
    } else {
      const empty = document.createElement("div"); empty.className = "frame-empty"; empty.textContent = tx("noImage"); frame.appendChild(empty);
    }
    return frame;
  }

  function allWorkKeys(introWorks, outroWorks) {
    return [...new Set([...Object.keys(introWorks || {}), ...Object.keys(outroWorks || {})])].sort((a, b) => {
      const at = introWorks?.[a]?.title || outroWorks?.[a]?.title || a;
      const bt = introWorks?.[b]?.title || outroWorks?.[b]?.title || b;
      return at.localeCompare(bt, language);
    });
  }

  function renderKindBlock(workKey, entry, kind, interactive) {
    if (!entry?.profiles?.length) return null;
    const block = document.createElement("section"); block.className = "kind-block";
    const title = document.createElement("div"); title.className = "kind-title"; title.textContent = kind === "intro" ? tx("intro") : tx("outro"); block.appendChild(title);
    entry.profiles.forEach((profile, index) => {
      const row = document.createElement("div"); row.className = "profile-row";
      row.append(makeFrame(tx("start"), profile.startPreviewDataUrl || profile.previewDataUrl), makeFrame(tx("end"), profile.endPreviewDataUrl));
      const meta = document.createElement("div"); meta.className = "profile-meta";
      const anchors = Array.isArray(profile.anchors) ? profile.anchors.length : 0;
      const startAdj = Number(profile.startAdjustmentSeconds) || 0;
      const endAdj = Number(profile.endAdjustmentSeconds ?? profile.adjustmentSeconds) || 0;
      const adj = `${startAdj >= 0 ? "+" : ""}${startAdj}s / ${endAdj >= 0 ? "+" : ""}${endAdj}s`;
      const metaTitle = document.createElement("strong");
      metaTitle.textContent = `${kind === "intro" ? tx("intro") : tx("outro")} ${index + 1}`;
      const lines = [
        `${formatTime(profile.startTimeHint)} → ${formatTime(profile.endTimeHint)}`,
        `${tx("duration")}: ${Number(profile.duration || 0).toFixed(1)}s · ${tx("anchors")}: ${anchors}`,
        `${tx("adjustment")}: ${adj}`
      ];
      meta.appendChild(metaTitle);
      for (const line of lines) {
        const div = document.createElement("div");
        div.textContent = line;
        meta.appendChild(div);
      }
      row.appendChild(meta);
      if (interactive) {
        const button = document.createElement("button"); button.type = "button"; button.className = "profile-delete"; button.textContent = tx("delete");
        button.dataset.workKey = workKey; button.dataset.kind = kind; button.dataset.profileId = profile.id || ""; button.dataset.index = String(index);
        row.appendChild(button);
      }
      block.appendChild(row);
    });
    return block;
  }

  function renderLibrary(container, introWorks, outroWorks, interactive = false) {
    container.replaceChildren();
    const keys = allWorkKeys(introWorks, outroWorks);
    if (!keys.length) {
      const empty = document.createElement("div"); empty.className = "library-empty"; empty.textContent = tx("noData"); container.appendChild(empty); return;
    }
    for (const workKey of keys) {
      const intro = introWorks?.[workKey]; const outro = outroWorks?.[workKey]; const entry = intro || outro;
      const card = document.createElement("article"); card.className = "work-card";
      const head = document.createElement("div"); head.className = "work-head";
      const strong = document.createElement("strong"); strong.textContent = entry?.title || workKey;
      const id = document.createElement("span"); id.textContent = `${entry?.workId ? `acg:${entry.workId}` : workKey} · ${tx("intro")} ${intro?.profiles?.length || 0} · ${tx("outro")} ${outro?.profiles?.length || 0}`;
      head.append(strong, id); card.appendChild(head);
      const introBlock = renderKindBlock(workKey, intro, "intro", interactive); if (introBlock) card.appendChild(introBlock);
      const outroBlock = renderKindBlock(workKey, outro, "outro", interactive); if (outroBlock) card.appendChild(outroBlock);
      container.appendChild(card);
    }
  }

  async function getLocalData() {
    const stored = await extensionApi.storage.local.get({ introProfiles: {}, outroProfiles: {} });
    return {
      introWorks: core.sanitizeImportedWorks(stored.introProfiles, "intro"),
      outroWorks: core.sanitizeImportedWorks(stored.outroProfiles, "outro")
    };
  }

  async function refreshLocal() {
    const local = await getLocalData();
    const summary = core.summarize(local.introWorks, local.outroWorks);
    summaryCards($("localSummary"), summary);
    renderLibrary($("localLibrary"), local.introWorks, local.outroWorks, true);
    $("exportButton").disabled = !summary.total;
    return { ...local, summary };
  }

  function downloadJson(payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `bahamut-opening-ending-learning-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  async function exportCurrent() {
    const local = await getLocalData();
    const summary = core.summarize(local.introWorks, local.outroWorks);
    if (!summary.total) return setStatus(tx("exportEmpty"), "warn");
    downloadJson(core.createBackupPayload(local.introWorks, local.outroWorks, extensionApi.runtime.getManifest().version));
    setStatus(tx("exportDone", summary), "success");
  }

  async function readFiles(files) {
    selectedFiles = [...files].filter((file) => file?.name?.toLowerCase().endsWith(".json"));
    if (!selectedFiles.length) return;
    setStatus(tx("reading"));
    const parsed = [];
    for (const file of selectedFiles) {
      try {
        parsed.push(core.parseBackupPayload(JSON.parse(await file.text())));
      } catch (_error) {
        selectedImport = null; $("previewSection").hidden = true;
        return setStatus(tx("invalid", { name: file.name }), "error");
      }
    }
    selectedImport = core.mergePayloads(parsed);
    const summary = core.summarize(selectedImport.introWorks, selectedImport.outroWorks);
    $("previewSection").hidden = false;
    $("selectedFiles").textContent = selectedFiles.map((file) => file.name).join(" · ");
    summaryCards($("importSummary"), summary);
    renderLibrary($("importLibrary"), selectedImport.introWorks, selectedImport.outroWorks, false);
    const warnings = $("importWarnings"); warnings.replaceChildren();
    const schemas = [...new Set(parsed.map((item) => item.schemaVersion).filter((value) => value && value < core.LEARNING_BACKUP_VERSION))];
    for (const schema of schemas) {
      const el = document.createElement("div"); el.className = "warning"; el.textContent = tx("oldSchema", { schema }); warnings.appendChild(el);
    }
    if (summary.missingPreviews) { const el = document.createElement("div"); el.className = "warning"; el.textContent = tx("missingPreview", { count: summary.missingPreviews }); warnings.appendChild(el); }
    if (summary.legacy) { const el = document.createElement("div"); el.className = "warning"; el.textContent = tx("legacy", { count: summary.legacy }); warnings.appendChild(el); }
    setStatus(tx("selected", { files: selectedFiles.length, ...summary }), "success");
    $("previewSection").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function verifyWrite(expected) {
    const stored = await getLocalData();
    const summary = core.summarize(stored.introWorks, stored.outroWorks);
    const actualSignature = core.librarySignature(stored.introWorks, stored.outroWorks);
    const expectedSignature = core.librarySignature(expected.introWorks, expected.outroWorks);
    if (actualSignature !== expectedSignature) throw new Error("VERIFY_FAILED");
    return { stored, summary };
  }

  async function applyMerge() {
    if (!selectedImport) return;
    $("mergeButton").disabled = $("replaceButton").disabled = true;
    try {
      const current = await getLocalData();
      const intro = core.mergeLearningWorks(current.introWorks, selectedImport.introWorks, "intro");
      const outro = core.mergeLearningWorks(current.outroWorks, selectedImport.outroWorks, "outro");
      await extensionApi.storage.local.set({ introProfiles: intro.merged, outroProfiles: outro.merged });
      const verified = await verifyWrite({ introWorks: intro.merged, outroWorks: outro.merged });
      await refreshLocal();
      const stats = {
        added: intro.added + outro.added,
        upgraded: intro.upgraded + outro.upgraded,
        duplicates: intro.duplicates + outro.duplicates,
        capped: intro.capped + outro.capped,
        ...verified.summary
      };
      setStatus(tx("mergeDone", stats), "success");
      if (!stats.added && !stats.upgraded && stats.duplicates) setTimeout(() => setStatus(tx("sameData"), "warn"), 100);
    } catch (error) {
      console.error("[Backup Manager] merge failed", error); setStatus(tx("writeFail"), "error");
    } finally {
      $("mergeButton").disabled = $("replaceButton").disabled = false;
    }
  }

  async function applyReplace() {
    if (!selectedImport || !confirm(tx("replaceConfirm"))) return;
    $("mergeButton").disabled = $("replaceButton").disabled = true;
    try {
      const introWorks = core.sanitizeImportedWorks(selectedImport.introWorks, "intro");
      const outroWorks = core.sanitizeImportedWorks(selectedImport.outroWorks, "outro");
      await extensionApi.storage.local.set({ introProfiles: introWorks, outroProfiles: outroWorks });
      const verified = await verifyWrite({ introWorks, outroWorks });
      await refreshLocal();
      setStatus(tx("replaceDone", verified.summary), "success");
    } catch (error) {
      console.error("[Backup Manager] replace failed", error); setStatus(tx("writeFail"), "error");
    } finally {
      $("mergeButton").disabled = $("replaceButton").disabled = false;
    }
  }

  async function deleteProfile(button) {
    if (!confirm(tx("deleteConfirm"))) return;
    const kind = button.dataset.kind; const workKey = button.dataset.workKey;
    const storageKey = kind === "outro" ? "outroProfiles" : "introProfiles";
    const stored = await extensionApi.storage.local.get({ [storageKey]: {} });
    const all = core.sanitizeImportedWorks(stored[storageKey], kind);
    const entry = all[workKey]; if (!entry?.profiles?.length) return;
    let index = button.dataset.profileId ? entry.profiles.findIndex((p) => p.id === button.dataset.profileId) : -1;
    if (index < 0) index = Number(button.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index >= entry.profiles.length) return;
    entry.profiles.splice(index, 1);
    if (entry.profiles.length) { entry.updatedAt = Date.now(); all[workKey] = entry; } else delete all[workKey];
    await extensionApi.storage.local.set({ [storageKey]: all });
    await refreshLocal(); setStatus(tx("deleteDone"), "success");
  }

  function bind() {
    $("exportButton").addEventListener("click", exportCurrent);
    $("backupFiles").addEventListener("change", (event) => readFiles(event.currentTarget.files));
    $("mergeButton").addEventListener("click", applyMerge);
    $("replaceButton").addEventListener("click", applyReplace);
    $("localLibrary").addEventListener("click", (event) => {
      const button = event.target.closest(".profile-delete"); if (button) deleteProfile(button).catch(console.error);
    });
    const zone = $("dropZone");
    zone.addEventListener("dragover", (event) => { event.preventDefault(); zone.classList.add("dragging"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("dragging"));
    zone.addEventListener("drop", (event) => { event.preventDefault(); zone.classList.remove("dragging"); readFiles(event.dataTransfer.files); });
  }

  async function init() {
    const settings = await extensionApi.storage.local.get({ language: "zh-TW" });
    language = TEXT[settings.language] ? settings.language : "zh-TW";
    document.documentElement.lang = language;
    applyText();
    $("versionBadge").textContent = `v${extensionApi.runtime.getManifest().version}`;
    setStatus(tx("loading"));
    await refreshLocal();
    setStatus("");
    bind();
    const mode = new URLSearchParams(location.search).get("mode");
    if (mode === "import") $("importPanel").scrollIntoView({ block: "start" });
  }

  document.addEventListener("DOMContentLoaded", () => init().catch((error) => {
    console.error("[Backup Manager] init failed", error); setStatus(String(error?.message || error), "error");
  }));
})();
