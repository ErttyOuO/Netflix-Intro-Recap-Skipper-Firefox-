# Netflix + 動畫瘋自動播放助手 v2.0.0

> 一個 Firefox 擴充功能，同時支援 Netflix 自動跳過與巴哈姆特動畫瘋的分級自動同意、片頭學習與視覺辨識自動跳過。

![Firefox](https://img.shields.io/badge/Firefox-140%2B-FF7139?logo=firefoxbrowser&logoColor=white)
![Version](https://img.shields.io/badge/version-2.0.0-2f6cf4)
![Data Collection](https://img.shields.io/badge/data%20collection-none-4caf50)
![License](https://img.shields.io/badge/Bahamut%20module-MIT-blue)

本專案以既有的 **Netflix Intro / Recap Skipper Firefox v1.2.1** 為主幹，保留原本 GitHub / Firefox 發布線與 Netflix Player Quick Settings，並將 **動畫瘋自動播放助手 v1.4.0** 的完整核心功能模組化整合進同一個擴充功能。

---

## 支援網站

| 平台 | 網站 | 載入模組 |
| --- | --- | --- |
| Netflix | `https://www.netflix.com/*` | `sites/netflix/*` |
| 巴哈姆特動畫瘋 | `https://ani.gamer.com.tw/*` | `sites/bahamut/*` |

兩個網站的 Content Script **完全分離**：Netflix 頁面不會執行動畫瘋的影格取樣器；動畫瘋頁面也不會執行 Netflix 的播放器 DOM 偵測。

---

## Netflix 功能

v2.0.0 完整保留 Netflix v1.2.1 的功能與可靠性修正：

- 🍿 自動跳過片頭。
- 🕵️ 自動跳過前情提要。
- 📺 自動播放下一集。
- ▶️ 可選擇自動處理「仍在觀看嗎 / Continue Playing」，預設關閉。
- 🔔 可開關跳過提示。
- Netflix `/watch/` 播放器內的 **Player Quick Settings**。
- Popup 與播放器內設定共用同一份 `browser.storage.local`。
- Netflix SPA 導航與控制列重建處理。
- Next Episode hidden-parent / Post-play 偶發漏按修正。
- 每個自動操作都有 cooldown，避免 Netflix 重建 DOM 時重複觸發。
- 不使用全頁 500ms polling，也不以模糊文字搜尋下一集按鈕。

### Netflix Player Quick Settings

播放 Netflix 時，不必特別打開 Firefox 工具列 Popup，可以直接從播放器內調整：

```text
🍿 自動跳過片頭
🕵️ 自動跳過前情提要
📺 自動播放下一集
▶️ 自動繼續播放
🔔 顯示跳過提示
```

面板使用 Shadow DOM 隔離樣式，降低 Netflix CSS 改版造成 UI 污染的風險。

---

## 動畫瘋功能

動畫瘋模組完整保留 v1.4.0 功能與資料格式。

### 1. 分級提示自動同意

- 偵測動畫瘋分級遮罩。
- 功能開啟時，自動按下網站原本的「同意」按鈕。
- 支援動態換集與局部 DOM 更新。
- 成功自動確認後顯示短暫提示。

### 2. 片頭快轉學習

- 自動尋找頁面中最大的可見 `<video>`。
- 正常播放時低頻率保存最近的純影片影格。
- 監聽 `seeking` / `seeked`，將連續向前快轉視為同一次人工跳過。
- 快轉至少 20 秒後，詢問是否儲存為片頭資料。
- 使用者明確儲存後才會寫入本機 storage。
- 儲存多個 16×9 感知視覺指紋與低解析度預覽。

### 3. 每部作品最多 3 組片頭

- 第一組片頭使用完整學習卡。
- 已有片頭後，新候選改用右下角極簡單行卡。
- 差異明顯時可新增片頭 2 / 3。
- 高度相似時可更新對應片頭。
- 已滿 3 組時，必須由使用者明確選擇取代哪一組。

### 4. 每集只詢問一次

以下情況後，同一集後續快轉不再顯示片頭詢問：

- 已成功儲存。
- 選擇本集略過。
- 5 秒內完全沒有操作。
- 已成功自動跳過片頭。

只有明確按下「稍後再問」才會保留本集再次詢問的機會。

### 5. 視覺辨識與自動跳過

影片影格會縮小為 16×9 灰階感知指紋，再以 Hamming 相似度比對：

| 條件 | 門檻 |
| --- | ---: |
| 強命中 | `0.94` |
| 一般命中 | `0.88`，需短時間內連續命中兩次 |
| 有 `startTimeHint` | 提示時間前 240 秒至後 360 秒 |
| 無時間提示 | 最多掃描影片前 10 分鐘 |

命中後執行：

```js
video.currentTime += learnedSkipDuration;
```

不是使用倍速播放。

### 6. 動畫瘋 Popup 診斷

統一 Popup 的「動畫瘋」分頁保留：

- 目前作品與 ACG ID。
- 播放器是否找到。
- 純影片影格是否可讀。
- 已學習片頭組數。
- 最近一次片頭相似度。
- 本集是否已自動跳過。
- 純影片影格測試。
- 重新掃描頁面。
- 清除目前作品全部片頭學習資料。
- 繁體中文 / 简体中文 / English 切換。

---

## 統一 Popup

v2.0.0 以原 Netflix Popup 的深色介面為基礎，新增雙平台分頁：

```text
┌──────────────────────────────┐
│ 串流自動播放助手      v2.0.0 │
├──────────────┬───────────────┤
│   Netflix    │    動畫瘋      │
├──────────────┴───────────────┤
│ 對應平台設定與狀態            │
└──────────────────────────────┘
```

打開 Popup 時會向目前分頁的 Content Script 詢問平台狀態：

- 在 Netflix → 自動選 Netflix。
- 在動畫瘋 → 自動選動畫瘋。
- 在其他網站 → 使用上次選擇的平台，但顯示未連接狀態。

兩邊設定共用同一個擴充功能 storage，但使用不同 key，不互相覆蓋。

### Netflix storage keys

```text
skipIntro
skipRecap
skipNextEpisode
dismissStillWatching
showToast
```

### 動畫瘋 storage keys

```text
autoAgree
introLearning
autoSkipIntro
language
minLearnSkipSeconds
introProfiles
introPromptEpisodeStates
```

---

## 隱私與資料處理

本擴充功能不包含 Analytics、Telemetry、廣告追蹤或遠端程式碼。

### Netflix

Netflix 模組只操作已知的播放器控制項與本機功能設定，不讀取或保存影片內容、字幕、Cookie、密碼或帳號資料。

### 動畫瘋

啟用片頭學習或自動辨識時，動畫瘋模組會在瀏覽器本機：

- 從 `<video>` 讀取低解析度影格。
- 計算感知視覺指紋。
- 在使用者確認儲存時保存低解析度 JPEG 預覽與學習資料。

這些資料只保存在 `browser.storage.local`，**不會上傳到開發者或任何第三方服務**。

如果瀏覽器因 CORS 安全規則禁止讀取影片像素，擴充功能會停止使用該影格，不嘗試繞過瀏覽器安全限制。

Firefox manifest 明確宣告：

```json
"data_collection_permissions": {
  "required": ["none"]
}
```

詳細說明請見 [`PRIVACY.md`](PRIVACY.md)。

---

## 權限

API 權限只有：

```json
"permissions": ["storage"]
```

Content Script 只匹配：

```text
https://www.netflix.com/*
https://ani.gamer.com.tw/*
```

不要求：

- `<all_urls>`
- Cookie 權限
- 瀏覽紀錄
- 下載權限
- 剪貼簿
- 桌面擷取
- 外部帳號
- 遠端伺服器

---

## 專案結構

```text
Netflix-Bahamut-Auto-Player-v2.0.0/
├─ manifest.json
├─ popup.html
├─ popup.css
├─ popup.js
├─ sites/
│  ├─ netflix/
│  │  ├─ content.js
│  │  ├─ toastify.js
│  │  └─ toastify.css
│  └─ bahamut/
│     ├─ content.js
│     └─ content.css
├─ images/
│  ├─ icon-*.png
│  └─ bahamut-icon-*.png
├─ _locales/
│  ├─ zh-TW/messages.json
│  └─ en/messages.json
├─ README.md
├─ CHANGELOG.md
├─ PRIVACY.md
├─ PROJECT_STRUCTURE.md
├─ TEST_CHECKLIST.md
├─ THIRD_PARTY_NOTICES.md
└─ BAHAMUT-LICENSE.txt
```

---

## 本地安裝 / 測試

1. 在 Firefox 開啟：
   ```text
   about:debugging#/runtime/this-firefox
   ```
2. 選擇「載入暫用附加元件」。
3. 選擇專案根目錄的 `manifest.json`。
4. 分別開啟 Netflix 與動畫瘋測試。
5. 正式發布前依 [`TEST_CHECKLIST.md`](TEST_CHECKLIST.md) 完整跑一次。

> 暫用附加元件會在 Firefox 重啟後移除。正式安裝仍需經 Firefox Add-ons / AMO 簽署。

---

## 從既有版本升級

### 從 Netflix v1.2.1 更新

因 v2.0.0 沿用 Netflix 專案作為主線，Netflix 的既有設定 key 不變；正常更新時設定可繼續使用。

v2.0.0 新增 `https://ani.gamer.com.tw/*` 的 Content Script 存取範圍，因此 Firefox 在更新時可能顯示新的動畫瘋網站存取提示；這是動畫瘋分級提示、播放器偵測與片頭學習所需要的新增網站範圍，不是 `<all_urls>`。

### 原動畫瘋獨立擴充功能的學習資料

Firefox 的 `storage.local` 依擴充功能身份隔離。原本獨立安裝的「動畫瘋自動播放助手」與此 Netflix 主線擴充功能是不同 identity，因此 **v2.0.0 無法直接讀取舊動畫瘋擴充功能的 `introProfiles`**。

這不影響新合併版功能，但舊動畫瘋插件中已學習的 OP Profile 不會自動出現在新擴充功能中。若需要搬移既有資料，應使用獨立的資料匯出 / 匯入遷移流程，而不是放寬網站權限或嘗試跨擴充功能讀取 storage。

---

## 開發注意事項

- Netflix 與動畫瘋模組必須保持網站級隔離。
- 不要把兩個 Content Script 合成一個全站共用腳本。
- 不要把動畫瘋的 `FRAME_SAMPLE_MS = 420` 取樣機制帶到 Netflix。
- 不要重新引入 Netflix 500ms 全頁 polling。
- 不要移除 Netflix v1.2.1 Next Episode hidden-parent 修正。
- 不要用全頁模糊文字搜尋去點 Netflix 下一集。
- 不要改變動畫瘋既有 `introProfiles` / `introPromptEpisodeStates` 資料格式，除非同時提供 migration。
- 不要新增 Analytics、Telemetry、遠端程式碼或未必要的 host permission。
- 所有文字檔維持 UTF-8。

更完整的工程限制請見 [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md)。

---

## Credits

### Netflix module

- Original project / concept: [JohnnyTseng](https://github.com/JohnnyTseng)
- Firefox maintained repository: [ErttyOuO/Netflix-Intro-Recap-Skipper-Firefox-](https://github.com/ErttyOuO/Netflix-Intro-Recap-Skipper-Firefox-)
- Toast notifications: Toastify JS 1.12.0 (MIT), bundled locally.

### Bahamut module

動畫瘋 v1.4.0 模組以原獨立專案原始碼整合，保留其 MIT License；詳見 [`BAHAMUT-LICENSE.txt`](BAHAMUT-LICENSE.txt)。

---

## Disclaimer

Netflix is a trademark of Netflix, Inc. 巴哈姆特、動畫瘋及其相關商標屬原權利人所有。本專案與 Netflix、巴哈姆特官方沒有隸屬或背書關係。
