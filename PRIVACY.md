# Privacy Policy — Netflix + 動畫瘋自動播放助手

Version: 2.2.11

本擴充功能以本機執行為原則，不包含 Analytics、Telemetry、廣告追蹤或遠端程式碼。

## Data collection

本擴充功能不收集、出售、傳送或遠端儲存使用者資料。Firefox manifest 明確宣告：

```json
"data_collection_permissions": {
  "required": ["none"]
}
```

## Local storage

擴充功能使用 Firefox `storage.local` 保存設定與動畫瘋學習資料。

### Netflix

- `skipIntro`
- `skipRecap`
- `skipNextEpisode`
- `dismissStillWatching`
- `showToast`

### 共用介面

- `unifiedLastPlatform`：記住 Popup 上次查看的平台。

### 動畫瘋

- `autoAgree`
- `introLearning` / `autoSkipIntro`
- `outroLearning` / `autoSkipOutro`
- `language`
- `minLearnSkipSeconds`
- `introProfiles` / `outroProfiles`
- `bahamutLearningPromptHistoryV2`：保存本集已完成或明確「略過本集」的學習提示狀態。

## Netflix module

Netflix 模組不保存帳號、密碼、Cookie、字幕、影片／音訊內容或觀看紀錄。它只在 Netflix 頁面辨識已知播放器控制項並依本機設定操作。

## Bahamut Anime learning data

動畫瘋學習資料可能包含：

- 作品 ID、名稱與來源集數 URL
- 人工快轉入點、結束點、跳過秒數，以及入點／結束點各自的累積 ±2 秒調整值
- **精確入點的低解析度 JPEG 預覽圖與視覺指紋**
- **片段開始後數秒內的多個低解析度視覺指紋 anchors**（只保存 16 × 9 二值視覺指紋與時間 offset，不保存這些中間影格的 JPEG 圖）
- **目前選定結束點的低解析度 JPEG 預覽圖**
- Profile schema / anchor metadata

v2.2.4 起不再把快轉前數秒的歷史影格混入新 Profile。v2.2.6 起在使用者按下儲存時，短暫於本機重新定位到片段開始後前 6 秒，建立多個 post-start anchors，再恢復使用者原本的片段結束位置與播放狀態。所有影格處理都只在目前動畫瘋分頁與本機記憶體完成；中間採樣影格不會上傳，也不會以 JPEG 形式逐張保存。

## Video frame processing

啟用動畫瘋學習或自動跳過時，模組會從頁面 `<video>` 讀取低解析度影格，在本機計算 16 × 9 感知視覺指紋。

- 片頭辨識：影片前 10 分鐘。
- 片頭學習候選：單次人工向前快轉超過 3 分鐘時視為一般找進度，不顯示學習詢問。
- 片尾辨識：影片最後 6 分鐘。
- 新 Profile 的入點影格必須足夠接近實際人工快轉起點；儲存時還必須取得至少 3 個有效的 post-start 視覺 anchors。
- 若 CORS 阻止讀取影片像素，擴充功能不會繞過瀏覽器限制。

影格讀取不是桌面擷取，正常情況不包含彈幕 DOM、控制列、擴充功能 UI 或其他分頁。

## Learning-data export and import

v2.2.9 的備份 schema 仍為 `4`，可保存精確入點、起訖預覽圖、視覺指紋、跳過時間，以及入點／結束點各自的調整值；仍可匯入舊版備份。

v2.2.9 將匯入／還原移至擴充功能自己的固定備份管理頁。使用者選取的 JSON 只在本機解析與預覽；只有按下「合併」或「完整還原」後才會寫入 `browser.storage.local`。寫入後會再次讀回資料驗證。所有操作都不會上傳到網路。

## Network access

擴充功能不呼叫外部 API，也不載入遠端 JavaScript。Toastify JS 隨擴充功能本地打包。

## Page access

Content Script 僅匹配：

- `https://www.netflix.com/*`
- `https://ani.gamer.com.tw/*`

兩個網站使用獨立 Content Script。

## Legacy Bahamut storage

Firefox `storage.local` 依擴充功能 identity 隔離。舊的獨立動畫瘋擴充功能資料不會被秘密跨 extension 讀取。

## Disclaimer

Netflix 與巴哈姆特／動畫瘋相關商標屬各自權利人。本專案與官方沒有隸屬或背書關係。
