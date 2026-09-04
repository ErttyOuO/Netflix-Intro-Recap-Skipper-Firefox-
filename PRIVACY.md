# Privacy Policy — Netflix + 動畫瘋自動播放助手

Version: 2.0.0

本擴充功能以本機執行為原則，不包含 Analytics、Telemetry、廣告追蹤或遠端程式碼。

## Data collection

本擴充功能不收集、出售、傳送或遠端儲存使用者資料。Firefox manifest 宣告：

```json
"data_collection_permissions": {
  "required": ["none"]
}
```

## Netflix module

Netflix 模組不收集或保存：

- Netflix 帳號資訊
- 觀看紀錄
- 影片或音訊內容
- 字幕
- Cookie
- 密碼
- 個人識別資訊

它只在 Netflix 頁面中辨識已知播放器控制項，並讀寫本機功能開關。

## Bahamut Anime module

動畫瘋模組使用 Firefox `browser.storage.local` 保存：

- `autoAgree`
- `introLearning`
- `autoSkipIntro`
- `language`
- `minLearnSkipSeconds`
- `introProfiles`
- `introPromptEpisodeStates`

使用者明確儲存片頭學習資料時，`introProfiles` 可能包含：

- 動畫作品 ID 與作品名稱
- 人工快轉起點時間提示與跳過秒數
- 從 `<video>` 取得的低解析度 JPEG 預覽縮圖
- 由影片影格計算的單張或多張感知視覺指紋
- 建立資料時的動畫瘋集數 URL

以上資料只留在使用者自己的 Firefox 擴充功能本機儲存空間，不會傳送到開發者或第三方服務。

## Video frame processing

啟用「片頭快轉學習」或「自動跳過已學習片頭」時，動畫瘋模組會定期從動畫瘋頁面的 `<video>` 讀取低解析度影格，用於本機視覺指紋計算與相似度比對。

它不是桌面擷取，因此正常情況下不包含：

- 網頁彈幕 DOM
- 播放器控制列
- 擴充功能提示 UI
- 其他網站分頁

如果瀏覽器因 CORS 安全規則禁止讀取影片像素，擴充功能會停止使用該影格，不嘗試繞過瀏覽器限制。

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

Netflix 與巴哈姆特 / 動畫瘋相關商標屬各自權利人。本專案與官方沒有隸屬或背書關係。
