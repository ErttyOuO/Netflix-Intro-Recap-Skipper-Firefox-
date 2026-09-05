# Privacy Policy — Netflix + 動畫瘋自動播放助手

Version: 2.2.0

本擴充功能以本機執行為原則，不包含 Analytics、Telemetry、廣告追蹤或遠端程式碼。

## Data collection

本擴充功能不收集、出售、傳送或遠端儲存使用者資料。Firefox manifest 明確宣告：

```json
"data_collection_permissions": {
  "required": ["none"]
}
```

這裡的「none」表示擴充功能不把使用者資料傳送到擴充功能之外做儲存或處理。

## Local storage

擴充功能使用 Firefox `storage.local` 保存本機設定與學習資料。主要項目如下。

### Netflix

- `skipIntro`
- `skipRecap`
- `skipNextEpisode`
- `dismissStillWatching`
- `showToast`

### 共用介面

- `unifiedLastPlatform`：記住 Popup 上次查看的 Netflix／動畫瘋分頁。

### 動畫瘋

- `autoAgree`
- `introLearning`
- `autoSkipIntro`
- `outroLearning`
- `autoSkipOutro`
- `language`
- `minLearnSkipSeconds`
- `introProfiles`
- `outroProfiles`
- `bahamutLearningPromptHistoryV2`：記錄單集已處理過的人工快轉片段，避免同一片段重複詢問。

以上資料都保存在使用者自己的 Firefox 擴充功能本機儲存空間。

## Netflix module

Netflix 模組不收集或保存 Netflix 帳號、密碼、Cookie、字幕、影片／音訊內容或觀看紀錄。它只在 Netflix 頁面中辨識已知播放器控制項，並依本機設定處理片頭、前情提要、下一集與「仍在觀看嗎」等控制項。

## Bahamut Anime module

動畫瘋模組支援本機片頭／片尾學習。使用者明確儲存學習資料時，`introProfiles` 與 `outroProfiles` 可能包含：

- 動畫作品 ID 與作品名稱
- 人工快轉起點、結束點與跳過秒數
- `−2 / 原位置 / +2 秒` 結束點調整值
- 從 `<video>` 取得的低解析度 JPEG 預覽縮圖
- 由影片影格計算的感知視覺指紋
- 建立資料時的動畫瘋集數 URL

這些資料只用於本機辨識與使用者自行備份，不會自動傳送給開發者或第三方。

## Video frame processing

啟用動畫瘋片頭／片尾學習或自動跳過時，模組會直接從頁面中的 `<video>` 讀取低解析度影格，用於本機視覺指紋計算與相似度比對。

- 片頭自動辨識只在單集前 3 分鐘進行。
- 片頭成功自動跳過一次後，本集停止片頭自動匹配。
- 若片頭學習仍開啟，03:00 前可以保留較低頻率的學習取樣，以支援同一集第二／第三段片頭學習。
- 片尾辨識只在影片最後 4 分鐘進行。
- 片尾動作完成或使用者取消後，本集停止後續片尾自動辨識。

影格讀取不是桌面擷取，因此正常情況下不包含網頁彈幕 DOM、播放器控制列、擴充功能 UI 或其他分頁。若瀏覽器因 CORS 安全規則禁止讀取影片像素，擴充功能會停止使用該影格，不嘗試繞過瀏覽器限制。

## Learning-data export and import

v2.2.0 可由使用者主動將動畫瘋片頭與片尾學習資料匯出成 JSON 檔案，也可以手動匯入。備份內容可能包含作品名稱／ID、影格指紋、預覽圖、跳過秒數、時間提示、±2 秒調整值與來源集數 URL。

匯出檔只由瀏覽器在本機產生，不會自動上傳；匯入只會寫回本機 `storage.local`。

## Network access

擴充功能不呼叫外部 API，也不載入遠端 JavaScript。Toastify JS 隨擴充功能本地打包。

## Page access

Content Script 僅匹配：

- `https://www.netflix.com/*`
- `https://ani.gamer.com.tw/*`

Netflix 與動畫瘋使用不同 Content Script，不會在另一個網站啟動不相關的播放器邏輯。

## Legacy Bahamut storage

Firefox 的 `storage.local` 依擴充功能 identity 隔離。舊的獨立動畫瘋擴充功能資料不會被本擴充功能秘密存取或跨 extension 讀取。

## Disclaimer

Netflix 與巴哈姆特／動畫瘋相關商標屬各自權利人。本專案與官方沒有隸屬或背書關係。
