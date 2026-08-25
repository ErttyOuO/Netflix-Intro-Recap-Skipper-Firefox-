# Firefox v1.2.1 測試清單

建議正式上架 AMO 前至少完整跑一次以下項目。v1.2.1 主要修正 Next Episode 偶發漏按；B 區的 Next Episode 回歸測試是本版最重要項目，I、J 區仍需確認 Player Quick Settings。

## A. 安裝與權限

- [ ] `about:debugging#/runtime/this-firefox` 可以用 `manifest.json` 載入。
- [ ] Firefox 沒有顯示 manifest / JavaScript 錯誤。
- [ ] API 權限只有 `storage`；網站存取只限 `https://www.netflix.com/*`。
- [ ] 沒有要求瀏覽紀錄、下載、剪貼簿、Cookie、所有網站或通知權限。
- [ ] `about:addons` 的「Permissions and data」可看到此版本宣告不收集資料。
- [ ] Netflix 以外網站不會注入此 Content Script。

## B. 原有三個核心功能

### Skip Intro
- [ ] 開啟「自動跳過片頭」。
- [ ] 播放至少一集會出現「跳過片頭」的作品。
- [ ] 按鈕出現後只自動點擊一次。
- [ ] 關閉該選項後，重新測試另一集，確認不會自動點擊。

### Skip Recap
- [ ] 開啟「自動跳過前情提要」。
- [ ] 找一集會顯示 Recap 的作品測試。
- [ ] 按鈕出現後只自動點擊一次。
- [ ] 關閉後確認 Recap 保持可手動操作。

### Next Episode
- [ ] 開啟「自動播放下一集」。
- [ ] 播放到片尾出現 Next Episode/Post-play 控制項。
- [ ] **v1.2.1 回歸測試：完全不要移動滑鼠或叫出控制列，等待片尾；下一集按鈕一旦真正顯示就應自動觸發。**
- [ ] 重複測至少 3 集，確認不再出現「滑鼠一動才突然感應到」的情況。
- [ ] 下一集只啟動一次，沒有連續跳兩集。
- [ ] 關閉後確認 Netflix 原生倒數維持正常。

## C. Continue Playing / Still Watching

- [ ] 第一次安裝時「自動繼續播放」預設關閉。
- [ ] 關閉時若 Netflix 顯示「仍在觀看嗎」，插件不能替你點擊。
- [ ] 手動開啟後，只在 Netflix 明確的 Continue Playing 控制項出現時自動處理。
- [ ] 一般播放按鈕、下一集、推薦卡不會被誤點。

## D. Toast

- [ ] Toast 開啟時，成功處理控制項後顯示約 1.8 秒。
- [ ] Toast 關閉時，自動跳過仍正常但不顯示提示。
- [ ] Toast 不會永久覆蓋字幕或播放器控制項。

## E. Popup Status

- [ ] Netflix `/watch/...` 顯示「正在監控 Netflix 播放器」。
- [ ] Netflix 首頁/搜尋頁顯示未進入播放模式。
- [ ] 非 Netflix 分頁開 Popup 不報錯。
- [ ] 本頁處理次數會隨自動動作增加；重新整理後歸零屬正常。

## F. SPA 導航

- [ ] Netflix 首頁 → 點作品 → `/watch/`，功能開始工作。
- [ ] `/watch/` → 返回首頁，插件停止自動點擊且播放器內設定 UI 消失。
- [ ] 首頁 → 再進另一部作品，不需重新整理即可工作。
- [ ] 同一分頁連續播放至少 3 集，功能沒有逐集變慢或重複觸發。
- [ ] 換集後播放器內只有一顆 Netflix Skipper 設定按鈕。

## G. 效能與穩定性

- [ ] Firefox Task Manager / `about:performance` 中，Netflix Skipper 不應長時間維持異常 CPU 使用率。
- [ ] 播放 30–60 分鐘後，Netflix 操作、字幕、音量、全螢幕沒有明顯卡頓。
- [ ] 開關反覆切換 10 次不會造成重複 Toast 或重複 click。
- [ ] Netflix 分頁開關多次後，Console 沒有持續增加的插件錯誤。
- [ ] Console 中沒有每 500ms / 1 秒固定輸出的 Netflix Skipper 訊息。
- [ ] DevTools 搜尋 `setInterval(`，Netflix Skipper 自有程式碼中應為 0。

## H. 誤觸安全測試

- [ ] Netflix 首頁、搜尋、我的片單、作品詳情頁停留 2–3 分鐘，沒有自動點擊任何內容。
- [ ] 播放器暫停時，插件不會自行按「播放」。
- [ ] 插件不會自動選擇推薦影片。
- [ ] 插件不會修改字幕、音量、畫質、播放速度。
- [ ] 插件不會自行改變時間軸；只在 Netflix 顯示明確 Skip/Next/Continue 控制項時點擊。

## I. Player Quick Settings — v1.2.0 必測

### 顯示與位置
- [ ] 只在 `/watch/...` 播放頁看得到 Netflix Skipper 設定按鈕。
- [ ] 首頁、搜尋頁、作品詳情頁沒有殘留設定按鈕。
- [ ] 設定按鈕不遮住 Netflix 返回、檢舉、字幕、速度、全螢幕等原生按鈕。
- [ ] 點擊設定按鈕後只出現一個設定面板。
- [ ] 再點一次或按右上角 × 可關閉面板。
- [ ] 按 Escape 可關閉面板。
- [ ] 點面板外部可關閉面板。

### 五個開關
- [ ] 面板有：🍿片頭、🕵️前情提要、📺下一集、▶️自動繼續播放、🔔提示，共 5 個開關。
- [ ] 「自動繼續播放」第一次安裝仍為 OFF。
- [ ] 其他預設值與 Popup 完全一致。

### Popup / Player 同步
- [ ] 在 Player Quick Settings 關閉片頭後，關閉面板並打開 Firefox Popup，片頭也是 OFF。
- [ ] 在 Popup 開啟片頭後，回到播放器再打開 Player Quick Settings，片頭是 ON。
- [ ] 對 5 個設定逐一做至少一次雙向同步測試。
- [ ] 修改設定後不用重新整理 Netflix 就立即影響核心行為。

### 不干擾播放器
- [ ] 在設定面板內點 Toggle 不會同時觸發 Netflix 播放/暫停。
- [ ] 在設定面板內雙擊不會讓 Netflix 進入其他播放操作。
- [ ] 面板開啟時字幕仍可正常顯示。
- [ ] 關閉面板後 Netflix 原生滑鼠/鍵盤操作完全正常。

## J. 全螢幕與控制列重建 — v1.2.0 必測

- [ ] 一般播放模式可開啟 Player Quick Settings。
- [ ] 進入 Firefox/Netflix 全螢幕後，設定入口仍可使用或會在控制列重建後自動恢復。
- [ ] 全螢幕內面板沒有跑到畫面外。
- [ ] 退出全螢幕後不會出現第二顆重複設定按鈕。
- [ ] 快速連續「進全螢幕 → 退出 → 再進入」3 次，始終只有一顆設定按鈕。
- [ ] Netflix 控制列隱藏/重新顯示後，不會累積重複按鈕或重複事件。

## K. 語系與 UTF-8

- [ ] Firefox UI 為繁中時，Popup 與 Player Quick Settings 中文正常，沒有亂碼/mojibake。
- [ ] Firefox UI 為英文時，Popup 與 Player Quick Settings 顯示英文。
- [ ] 中文、英文 Netflix UI 都能完成核心 Skip 測試；核心功能不依賴按鈕顯示文字。

## L. Console 訊息判讀

以下 Netflix / Firefox 自身訊息不應直接判定為 Netflix Skipper 錯誤：

- `notifications.netflix.com/push` CORS 失敗。
- Firefox Fingerprinting Protection 調整 `screen.availWidth/availHeight`。
- Netflix 字型 preload 未使用警告。
- `mozAudioCaptured` deprecated。
- Netflix `playercore.js.map` 403 Source Map。
- 其他擴充功能（例如 PreMiD）的 performance warning。

真正需要回報的是包含 `[Netflix Skipper]` / `[Netflix Skipper Popup]` 的 Exception，或能穩定重現的 UI/自動點擊異常。

## M. 上架前安全回查

- [ ] ZIP 根目錄直接包含 `manifest.json`。
- [ ] ZIP 不包含 `.git/`、舊版 ZIP、暫存檔、本機帳號資訊。
- [ ] 程式沒有外部 API、Analytics、Telemetry、遠端程式碼載入。
- [ ] 搜尋 `eval(`、`new Function(`，結果為 0。
- [ ] 搜尋 `setInterval(`，自有程式碼結果為 0。
- [ ] `manifest.json` 版本為 `1.2.1`。
- [ ] API 權限仍只有 `storage`。
- [ ] host access 仍只有 `https://www.netflix.com/*`。
- [ ] `strict_min_version` 為 `140.0`。
- [ ] `data_collection_permissions.required` 為 `["none"]`。

## 建議最低通過標準

正式上架前 A、B、F、G、H、I、J、M 必須全部通過。Still Watching 若暫時無法觸發實際提示，可維持預設關閉並標記「待實機驗證」，不要為測試放寬 selector。
