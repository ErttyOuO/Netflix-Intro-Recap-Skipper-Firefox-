<div align="center">
  <img src="images/icon-128.png" alt="Netflix + 動畫瘋自動播放助手" width="96">

# Netflix + 動畫瘋自動播放助手

**Firefox WebExtension · v2.2.0**

一個擴充功能，同時支援 **Netflix** 與 **巴哈姆特動畫瘋**。  
Netflix 提供片頭／前情提要／下一集自動處理與播放器內快速設定；動畫瘋提供分級自動同意、片頭／片尾人工學習、視覺辨識自動跳過與本機備份。

[Firefox Add-ons](https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%88%87%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE/) · [GitHub Repository](https://github.com/ErttyOuO/Netflix-Intro-Recap-Skipper-Firefox-)
</div>

---

## 支援平台

| 平台 | 網址範圍 | 主要功能 |
| --- | --- | --- |
| Netflix | `https://www.netflix.com/*` | 片頭、前情提要、下一集、仍在觀看、提示、播放器快速設定 |
| 巴哈姆特動畫瘋 | `https://ani.gamer.com.tw/*` | 分級自動同意、片頭／片尾學習、視覺辨識、自動跳過、備份／還原 |

兩個網站使用**不同的 Content Script**。Netflix 不會載入動畫瘋的影格辨識器；動畫瘋也不會載入 Netflix 的播放器監控程式。

---

## Netflix 功能

- 🍿 **自動跳過片頭**：偵測 Netflix `Skip Intro` 控制項後自動處理。
- 🕵️ **自動跳過前情提要**：有 `Skip Recap` 時自動處理。
- 📺 **自動播放下一集**：處理 Netflix Post-play / Next Episode 控制項。
- ▶️ **自動繼續播放**：可選擇處理「仍在觀看嗎」提示；預設關閉。
- 🔔 **跳過提示**：可自行開關畫面 Toast。
- ⚙️ **Player Quick Settings**：在 Netflix `/watch/...` 播放器內直接調整同一組設定，不必打開瀏覽器工具列 Popup。
- 🧭 **SPA 相容**：支援 Netflix 換集、返回首頁與播放器 DOM 重建。
- 🛡️ **下一集可靠性修正**：能處理 Netflix 預先建立但暫時由父層隱藏的 Post-play 控制項，降低「移動滑鼠後才突然感應」的情況。

Netflix 模組沒有固定的 500 ms 全頁輪詢；主要使用事件驅動 DOM 監控與有限候選重查。

---

## 動畫瘋功能

### 分級自動同意

偵測動畫瘋分級提示後，可自動按下「同意」，不需要每集手動確認。

### 片頭快轉學習

當使用者人工向前快轉符合條件的片段時，擴充功能可詢問是否將該片段儲存為片頭學習資料。

- 每部作品最多保存 **3 組片頭**。
- 同一集可以學習第二段／第三段不同片頭。
- 相同快轉片段會去重，不會一直重複詢問。
- 「稍後再問」不會把該片段永久略過。

### v2.2.0：片頭只在前 3 分鐘自動辨識

- 自動片頭視覺比對只在 `00:00–03:00` 進行。
- 本集成功自動跳過一次片頭後，立即停止本集後續片頭自動匹配。
- 若片頭學習仍開啟，03:00 前可以保留較低頻率取樣，讓同一集的第二／第三段人工片頭仍可學習。
- 超過 03:00 後片頭取樣停止，直到進入片尾偵測區間。

### 視覺辨識

動畫瘋模組從頁面 `<video>` 讀取低解析度影片影格，在**本機**建立 16 × 9 感知視覺指紋並比對，不會把影格送到伺服器。

v2.1.0 起的多層辨識規則：

- **Strong**：相似度 `≥ 0.93` 可立即觸發。
- **Medium**：`0.88–0.93`，每次累積 2 分。
- **Soft**：`0.84–0.88`，每次累積 1 分；只在學習時間提示附近的安全範圍計分。
- `1.9 秒`內累積 `3 分`且至少 `2 次命中`即可觸發。
- 每組學習資料最多保留 `10 組`影格指紋。

Popup 會顯示最近相似度與累積辨識分數，例如：`89.6% · 累積 2/3`。

### v2.2.0：±2 秒結束點預覽

片頭／片尾學習卡新增：

- `−2 秒`
- `原位置`
- `+2 秒`

按下時會直接同步移動動畫瘋原生播放器時間軸，讓使用者確認結束點是否切得太早或太晚。儲存時會保存調整後的跳過長度、結束時間提示與 `adjustmentSeconds`。

### v2.2.0：片尾學習與自動跳過

- 新增「片尾快轉學習」。
- 新增「自動跳過已學習片尾」。
- 片尾偵測只在**影片最後 4 分鐘**進行；24 分鐘影片會從 `20:00` 開始。
- 片尾資料獨立儲存在 `outroProfiles`，不會和片頭資料混用。

辨識成功後不會立刻跳：

- 若學習後的目標點距影片結束 **少於 5 秒**：顯示 **4 秒「即將到下一集」**倒數，再移到片尾，讓動畫瘋自然進入下一集流程。
- 若目標點後仍有 **5 秒以上**內容：顯示 **2 秒「即將跳過片尾」**倒數，再跳到學習的片尾結束點，保留花絮／彩蛋。
- 兩種倒數都可以按 **「繼續觀看片尾」**取消；取消後本集不再進行片尾自動辨識。

---

## 統一 Popup

同一個 Firefox Popup 可以切換：

- **Netflix**：五個 Netflix 自動處理開關與目前播放器狀態。
- **動畫瘋**：分級同意、片頭／片尾學習、自動跳過、目前作品診斷、相似度、影格測試與學習資料管理。

Popup 會嘗試偵測目前分頁的平台並自動切換到對應頁籤；若目前不是支援網站，仍可手動查看設定。

動畫瘋介面支援：

- 繁體中文
- 简体中文
- English

---

## 片頭／片尾學習資料備份

v2.2.0 可在 Popup 中：

- **匯出片頭／片尾學習資料**
- **匯入片頭／片尾學習資料**

新備份格式：

```text
netflix-bahamut-auto-player/bahamut-skip-learning
schemaVersion: 2
```

備份可包含：

- 作品 key / ID / 名稱
- 片頭與片尾視覺指紋
- 預覽縮圖
- 跳過秒數
- 起訖時間提示
- ±2 秒調整值
- 來源集數 URL

匯入採合併模式，重複 Profile 會自動略過；仍相容 v2.1.0 的片頭-only 備份格式。

> 備份與匯入都由使用者在本機手動操作，不需要 `downloads` 或檔案系統權限，也不會自動上傳。

---

## 隱私與權限

本擴充功能採本機優先設計：

- 不包含 Analytics / Telemetry。
- 不載入遠端 JavaScript。
- 不呼叫外部 API。
- 不傳送 Netflix 帳號、動畫瘋帳號、觀看紀錄、字幕、影片或影格到開發者伺服器。
- 動畫瘋視覺辨識、預覽圖、Profile 與備份資料都在本機處理。

Manifest API 權限只有：

```json
"permissions": [
  "storage"
]
```

網站執行範圍只有：

```text
https://www.netflix.com/*
https://ani.gamer.com.tw/*
```

Firefox 資料收集聲明：

```json
"data_collection_permissions": {
  "required": ["none"]
}
```

詳情請見 [`PRIVACY.md`](PRIVACY.md)。

---

## 安裝

### Firefox Add-ons

正式版本請從 Firefox Add-ons 安裝：

[Netflix 與動畫瘋自動播放](https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%88%87%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE/)

> v2.x 延續原 Netflix Firefox 擴充功能的 AMO 更新線。更新到支援動畫瘋的版本後，Firefox 可能顯示新增 `ani.gamer.com.tw` 網站存取範圍，這是動畫瘋播放器、分級提示與本機影格學習功能所需。

### 本機開發測試

1. 下載或 Clone 此 Repository。
2. Firefox 開啟 `about:debugging#/runtime/this-firefox`。
3. 選擇 **載入暫用附加元件**。
4. 選擇專案根目錄的 `manifest.json`。
5. 分別在 Netflix 與動畫瘋進行功能測試。

暫用附加元件在 Firefox 重啟後會被移除；正式持久安裝需要 Mozilla / AMO 簽署。

---

## 專案結構

```text
.
├─ manifest.json
├─ popup.html
├─ popup.css
├─ popup.js
├─ _locales/
│  ├─ zh-TW/messages.json
│  └─ en/messages.json
├─ images/
├─ sites/
│  ├─ netflix/
│  │  ├─ content.js
│  │  ├─ toastify.js
│  │  └─ toastify.css
│  └─ bahamut/
│     ├─ content.js
│     └─ content.css
├─ PRIVACY.md
├─ THIRD_PARTY_NOTICES.md
├─ BAHAMUT-LICENSE.txt
└─ README.md
```

### 網站模組隔離

```text
Netflix 頁面
└─ sites/netflix/*

動畫瘋頁面
└─ sites/bahamut/*
```

請不要把兩個網站的 Content Script 合併成單一全站腳本，也不要把動畫瘋的影格取樣器載入 Netflix。

---

## v2.2.0 重點更新

- 動畫瘋片頭自動辨識限制為前 3 分鐘。
- 本集成功跳過一次片頭後停止本集自動片頭匹配。
- 同一集仍可人工學習第二／第三段不同片頭。
- 學習卡新增 `−2 / 原位置 / +2 秒`真實時間軸預覽。
- 新增動畫瘋片尾學習與最後 4 分鐘視覺辨識。
- 新增片尾 `2 秒`跳過倒數與 `4 秒`下一集倒數。
- 可取消倒數並繼續觀看片尾；本集之後停止片尾自動辨識。
- 備份格式升級為片頭＋片尾 schema v2，並保留 v2.1.0 匯入相容性。
- Firefox 版維持 Manifest V2 AMO 更新線與 `browser.*` Promise API 優先。

詳細版本內容請見 [`CHANGELOG_V2.2.0.md`](CHANGELOG_V2.2.0.md)。

---

## 開發與安全原則

- Netflix 不重新引入固定 500 ms 全頁 polling。
- 不以模糊全頁文字搜尋自動點擊未知控制項。
- 動畫瘋影格取樣只在動畫瘋 Content Script 中執行。
- 不增加 `<all_urls>`。
- 不增加 Analytics、Telemetry、遠端程式碼或 CDN JavaScript。
- Netflix 與動畫瘋設定使用 `storage.local`，但保留各自獨立的 key 與邏輯。
- 若瀏覽器 CORS 規則禁止影片像素讀取，不嘗試繞過安全限制。

---

## Credits

### Netflix

- Original author: [JohnnyTseng](https://github.com/JohnnyTseng)
- Original Safari project: `SafariNflxAutoSkip`
- Firefox maintained build / unified project: [ErttyOuO](https://github.com/ErttyOuO)

### Toastify JS

- Toastify JS 1.12.0
- MIT License
- Upstream: [apvarun/toastify-js](https://github.com/apvarun/toastify-js)

### 動畫瘋模組

動畫瘋模組沿用原專案 MIT 授權；授權文字見 [`BAHAMUT-LICENSE.txt`](BAHAMUT-LICENSE.txt)。

---

## Disclaimer

Netflix、巴哈姆特與動畫瘋相關名稱、商標及服務均屬其各自權利人。此專案為非官方瀏覽器擴充功能，與 Netflix 或巴哈姆特官方沒有隸屬、合作或背書關係。
