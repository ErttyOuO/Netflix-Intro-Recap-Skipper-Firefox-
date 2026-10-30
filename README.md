<div align="center">
  <img src="images/icon-128.png" alt="Netflix + 動畫瘋自動播放助手" width="96">

# Netflix + 動畫瘋自動播放助手

**Firefox WebExtension｜v2.2.13｜Manifest V2**

同一套擴充功能，同時支援 **Netflix** 與 **巴哈姆特動畫瘋**。  
Netflix 提供自動跳過與播放器快速設定；動畫瘋提供片頭／片尾學習、視覺辨識、自動跳過，以及學習資料備份管理。

[![Firefox Add-ons](https://img.shields.io/amo/v/netflix%E8%88%87%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE?label=Firefox%20Add-ons)](https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%88%87%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE/)
[![Version](https://img.shields.io/badge/version-2.2.13-blue)](CHANGELOG.md)
[![Manifest](https://img.shields.io/badge/Firefox-Manifest%20V2-orange)](manifest.json)
[![License](https://img.shields.io/badge/license-MIT-green)](BAHAMUT-LICENSE.txt)

[Firefox Add-ons 安裝](https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%88%87%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE/) · [GitHub 原始碼](https://github.com/ErttyOuO/Netflix-Intro-Recap-Skipper-Firefox-)
</div>

---

## 支援平台

| 平台 | 支援網址 |
|---|---|
| Netflix | https://www.netflix.com/ |
| 巴哈姆特動畫瘋 | https://ani.gamer.com.tw/ |

## 功能特色

### Netflix

- **自動跳過片頭**：偵測並操作 Netflix 原生跳過片頭按鈕。
- **自動跳過前情提要**：自動處理可辨識的前情提要跳過按鈕。
- **自動播放下一集**：依照設定處理 Netflix 下一集控制項。
- **自動繼續播放**：可選擇處理「仍在觀看嗎？」提示，預設關閉。
- **跳過通知**：可開啟或關閉操作提示。
- **播放器快速設定**：在 Netflix 播放頁內直接調整設定，並與工具列 Popup 同步。

### 巴哈姆特動畫瘋

- **分級提示自動同意**：依設定自動處理分級確認。
- **片頭學習與自動跳過**：記錄人工快轉的片頭片段，供後續辨識及跳過。
- **片尾學習與自動跳過**：記錄人工快轉的片尾片段，保留片尾後預告或彩蛋的觀看空間。
- **多影格視覺辨識**：透過影片畫面特徵比對已學習片段，不只依賴單一畫面。
- **多組 Profile 管理**：同一作品可保存多組片頭及片尾，並查看入點、結束點、預覽圖與辨識資訊。
- **精確時間調整**：可累積調整片段結束位置，讓跳過範圍更符合實際需求。
- **學習資料備份**：支援匯出、匯入、預覽、合併及完整還原。

---

## 安裝方式

### 從 Firefox Add-ons 安裝

建議一般使用者直接從 Firefox 官方附加元件網站安裝：

**[安裝 Netflix + 動畫瘋自動播放助手](https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%88%87%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE/)**

### 從 GitHub 原始碼載入測試

1. Clone 或下載本 Repository。
2. 在 Firefox 網址列開啟 `about:debugging#/runtime/this-firefox`。
3. 點選 **載入暫用附加元件**。
4. 選擇專案根目錄中的 `manifest.json`。
5. 開啟 Netflix 或動畫瘋分頁，重新整理頁面後測試。

> 此 Repository 是 Firefox 版本，使用 Firefox Manifest V2。不要將這份原始碼直接當成 Vivaldi／Chromium Manifest V3 套件載入。

---

## 動畫瘋使用指南

### 1. 學習片頭或片尾

1. 開啟動畫瘋影片。
2. 點擊 Firefox 工具列上的擴充功能圖示，切換到 **動畫瘋** 頁籤。
3. 開啟 **片頭快轉學習** 或 **片尾快轉學習**。
4. 播放影片並人工快轉到想記錄的片段。
5. 依照播放器出現的學習提示，確認並儲存片段。

學習資料會依作品保存。同一作品可建立多組片頭或片尾 Profile。

### 2. 自動辨識與跳過

- 開啟 **自動跳過已學習片頭**，辨識到已保存的片頭後即可自動跳過。
- 開啟 **自動跳過已學習片尾**，辨識到已保存的片尾後即可依學習位置處理。
- 片頭辨識範圍為影片前 10 分鐘；片尾辨識範圍為影片最後 6 分鐘。
- 單次人工向前快轉超過 3 分鐘時，不會將該次操作當成片頭學習候選，避免一般找進度時誤觸發詢問。

### 3. 多影格學習

新版 Profile 使用多個視覺錨點協助辨識：

- 儲存時會以使用者選定的片段入點為基準建立多個影格錨點。
- 新 Profile 必須取得足夠的有效錨點才會完成儲存。
- 辨識時會比較已學習的錨點，並依相似度選擇符合的 Profile。
- 舊版單影格 Profile 會保留供查看及備份，但可能標示為舊資料，且不一定能參與新版自動跳過。

### 4. 片尾後的下一集流程

片尾辨識後，系統會依照學習片尾結束點與影片總長度的差距決定動作：

- **片尾後還有 10 秒以上內容：** 先跳過已學習片尾，保留後續預告或彩蛋，並顯示播放器內的「下一集」按鈕及 3 秒倒數。
- **片尾後剩餘時間少於 10 秒：** 進入 3 秒倒數，優先嘗試觸發動畫瘋原生下一集控制項；若找不到可用控制項，才退回影片結尾。
- 在播放器內的下一集按鈕倒數期間，於影片畫面範圍內移動滑鼠或按下滑鼠，可取消自動前往下一集。
- 取消倒數後，按鈕仍可手動點擊。

---

## 學習資料備份與還原

在擴充功能 Popup 的動畫瘋頁籤中，可以匯出或開啟備份管理頁。

| 功能 | 說明 |
|---|---|
| 匯出片頭／片尾學習資料 | 將目前學習資料下載為 JSON |
| 匯入／還原 | 選取一個或多個 JSON 備份，先預覽再決定如何寫入 |
| 合併到現有資料 | 保留目前資料，並加入備份中缺少的片段 |
| 完整還原 | 以備份內容取代目前所有動畫瘋片頭／片尾學習資料 |
| 管理全部作品與預覽圖 | 檢視備份管理頁中的作品及學習資料 |

**匯入檔案不會立即覆寫資料。** 系統會先驗證並顯示預覽，使用者確認後才執行合併或完整還原。

建議在更換瀏覽器、重新安裝或切換不同版本前，先匯出一份 JSON 備份。不同擴充功能 ID 的本機儲存空間彼此獨立，資料不保證會自動轉移。

---

## 設定與隱私

- 設定與動畫瘋學習資料儲存在 Firefox 的 `storage.local`。
- 影片影格在目前分頁本機讀取及處理，不會上傳至外部服務。
- 不包含 Analytics、Telemetry 或廣告追蹤。
- 不呼叫外部 API，也不載入遠端 JavaScript。
- 若網站或瀏覽器的 CORS 限制阻止讀取影片影格，擴充功能不會嘗試繞過限制。

本擴充功能的 Firefox 資料收集聲明為 `required: ["none"]`。

詳細資料請參閱 [PRIVACY.md](PRIVACY.md)。

---

## 相容性與權限

| 項目 | 說明 |
|---|---|
| 擴充功能版本 | 2.2.13 |
| 瀏覽器 | Firefox |
| Manifest | V2 |
| 最低 Firefox 版本 | 140.0 |
| API 權限 | `storage` |
| 網站存取範圍 | Netflix、巴哈姆特動畫瘋 |

擴充功能只在 Manifest 指定的 Netflix 與動畫瘋網站執行對應 Content Script。兩個網站使用獨立模組，動畫瘋的影格辨識不會在 Netflix 頁面執行。

---

## 專案結構

```text
.
├─ manifest.json
├─ popup.html / popup.css / popup.js
├─ backup.html / backup.css / backup.js / backup-core.js
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
├─ README.md
├─ CHANGELOG.md
├─ PRIVACY.md
├─ PROJECT_STRUCTURE.md
├─ THIRD_PARTY_NOTICES.md
└─ BAHAMUT-LICENSE.txt
```

---

## 版本紀錄與開發文件

- [CHANGELOG.md](CHANGELOG.md)：各版本功能與修正紀錄。
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)：程式結構、模組責任與後續修改限制。
- [PRIVACY.md](PRIVACY.md)：資料保存、影格處理及隱私說明。
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)：第三方程式與授權資訊。
- [BAHAMUT-LICENSE.txt](BAHAMUT-LICENSE.txt)：動畫瘋模組授權文字。

目前版本為 **v2.2.13**。本版修正版本識別號；動畫瘋片尾 3 秒下一集倒數及互動取消行為沿用 v2.2.12，沒有額外改變執行邏輯或學習資料格式。完整歷史請見 [CHANGELOG.md](CHANGELOG.md)。

---

## 致謝與授權

### Netflix 模組
- 原始作者：[JohnnyTseng](https://github.com/JohnnyTseng)
- 原始 Safari 專案：`SafariNflxAutoSkip`
- Firefox 維護與整合：[ErttyOuO](https://github.com/ErttyOuO)

### Toastify JS
- [apvarun/toastify-js](https://github.com/apvarun/toastify-js)
- Version 1.12.0 · MIT License

### 動畫瘋模組
動畫瘋模組沿用原專案 MIT 授權，授權文字見 [BAHAMUT-LICENSE.txt](BAHAMUT-LICENSE.txt)。

---

## Disclaimer

Netflix、巴哈姆特與動畫瘋相關名稱、商標及服務均屬其各自權利人。本專案為非官方瀏覽器擴充功能，與 Netflix 或巴哈姆特官方沒有隸屬、合作或背書關係。
