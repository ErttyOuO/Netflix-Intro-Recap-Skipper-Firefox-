# Netflix Intro & Recap Skipper

<p align="center">
  <strong>讓 Netflix 的片頭、前情提要與下一集切換更自動，也能直接在播放器裡隨時調整。</strong>
</p>

<p align="center">
  <a href="https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%B7%B3%E9%81%8E%E7%89%87%E9%A0%AD%E7%89%87%E5%B0%BE/">
    <img src="https://img.shields.io/badge/Firefox_Add--ons-立即安裝-FF7139?logo=firefox-browser&logoColor=white" alt="Firefox Add-ons">
  </a>
  <a href="https://github.com/ErttyOuO/Netflix-Intro-Recap-Skipper-Firefox-/releases">
    <img src="https://img.shields.io/badge/Vivaldi_%2F_Chromium-GitHub_Releases-24292F?logo=github&logoColor=white" alt="Vivaldi / Chromium Releases">
  </a>
  <img src="https://img.shields.io/badge/version-v1.2.1-E50914" alt="Version 1.2.1">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License">
</p>

---

## 簡介

**Netflix Intro & Recap Skipper** 是一個輕量化的 Netflix 自動跳過擴充功能。

它可以自動處理 Netflix 播放器中的：

- 🍿 **跳過片頭 / Skip Intro**
- 🕵️ **跳過前情提要 / Skip Recap**
- 📺 **自動播放下一集 / Next Episode**
- ▶️ **自動繼續播放 / Still Watching**（預設關閉）
- 🔔 **跳過提示通知**

除了瀏覽器工具列中的 Popup，v1.2.x 也加入了 **Player Quick Settings**，可以直接在 Netflix 播放畫面中調整功能，不需要離開影片或特別打開瀏覽器擴充功能選單。

---

## 安裝

### Firefox

Firefox 版本已正式上架 Mozilla Firefox Add-ons：

**[前往 Firefox Add-ons 安裝](https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%B7%B3%E9%81%8E%E7%89%87%E9%A0%AD%E7%89%87%E5%B0%BE/)**

安裝完成後開啟 Netflix 即可使用。

### Vivaldi / Chromium

Vivaldi / Chromium 版本由 GitHub Releases 提供：

**[前往 GitHub Releases](https://github.com/ErttyOuO/Netflix-Intro-Recap-Skipper-Firefox-/releases)**

若下載的是手動安裝版：

1. 下載 Release 中標示為 **Chromium / Vivaldi** 的版本。
2. 解壓縮 ZIP。
3. 開啟瀏覽器的擴充功能管理頁。
4. 開啟 **開發人員模式 / Developer mode**。
5. 選擇 **載入未封裝項目 / Load unpacked**。
6. 指向剛才解壓縮的擴充功能資料夾。

> Chromium 系瀏覽器的實際選單名稱可能會依瀏覽器版本略有不同。

---

## 功能

| 功能 | 預設 | 說明 |
|---|:---:|---|
| 🍿 自動跳過片頭 | ✅ | Netflix 顯示 Skip Intro 時自動處理 |
| 🕵️ 自動跳過前情提要 | ✅ | Netflix 顯示 Skip Recap 時自動處理 |
| 📺 自動播放下一集 | ✅ | Next Episode 可使用時自動進入下一集 |
| ▶️ 自動繼續播放 | ❌ | 處理「仍在觀看嗎 / Still Watching」提示 |
| 🔔 顯示跳過提示 | ✅ | 自動處理成功時顯示簡短提示 |

所有設定會儲存在瀏覽器本機。

---

## Player Quick Settings

v1.2.x 起，可以直接在 Netflix 播放器內調整 Skipper。

播放器中的快速設定與瀏覽器 Popup 使用 **同一份設定**：

```text
Netflix Skipper

🍿 自動跳過片頭              ON
🕵️ 自動跳過前情提要          ON
📺 自動播放下一集            ON

▶️ 自動繼續播放              OFF
   處理「仍在觀看嗎」提示

🔔 顯示跳過提示              ON
```

因此：

```text
在 Netflix 播放器關閉「自動跳過片頭」
                    ↓
Firefox / Chromium Popup 也會同步成 OFF
                    ↓
核心功能立即套用新設定
```

反方向修改也會同步。

### UI 設計

Player Quick Settings：

- 只在 Netflix `/watch/...` 播放頁使用。
- 使用 Shadow DOM 隔離樣式，降低 Netflix CSS 改版造成互相干擾的機率。
- Netflix SPA 換集或重新建立播放器控制項時，不會故意建立多份設定面板。
- 不需要新增額外網站權限。
- 不會因為操作設定面板而刻意改變字幕、音量、畫質或播放速度。

---

## v1.2.1

### 修正 Next Episode 偶發漏按

Netflix 有時會提早建立「下一集」按鈕，但先把它放在隱藏的 Post-play 容器中。

舊版可能發生：

```text
Next Episode 按鈕已經存在
        ↓
父層目前仍然隱藏
        ↓
插件第一次判斷為不可見
        ↓
Netflix 稍後只改變父層顯示狀態
        ↓
插件沒有立即得知
        ↓
直到滑鼠移動或播放器 UI 再次更新才重新感應
```

v1.2.1 改善了這種競態情況：

- 監控已找到的候選控制項與有限的父層可見性變化。
- Next Episode 候選可等待較長的 Post-play 預先建立階段。
- 加入有限次的單元素可見性重新確認。
- 保留 cooldown，避免同一個 Next Episode 被重複點擊。
- 不恢復高頻率的整頁輪詢。

---

## 效能設計

這個專案刻意避免用固定高頻輪詢反覆掃描整個 Netflix 頁面。

核心方向是：

```text
Netflix DOM 發生變化
        ↓
MutationObserver
        ↓
只檢查新增／已知候選控制項
        ↓
確認功能已開啟
        ↓
確認控制項可見且可操作
        ↓
Click
```

目前的設計避免重新使用類似：

```js
setInterval(scanWholeDocument, 500);
```

的全頁持續掃描方式。

---

## 隱私與安全

Netflix Intro & Recap Skipper 的設計原則是盡量只在本機工作。

### 不收集

本擴充功能不主動收集或上傳：

- Netflix 帳號資料
- 密碼
- Cookie
- 觀看紀錄
- 影片或音訊
- 字幕內容
- 個人識別資訊
- Analytics / Telemetry

### 不使用

- 外部分析 SDK
- 遠端執行程式碼
- 外部 AI API
- Netflix 私有帳號 API

功能開關使用瀏覽器的本機儲存保存。

---

## 為什麼 Console 可能還是會看到警告？

Netflix 本身與其他擴充功能可能在開發者工具中產生訊息，例如：

```text
notifications.netflix.com/push CORS
mozAudioCaptured deprecated
Netflix font preload warning
playercore.js.map 403
Firefox Fingerprinting Protection
PreMiD performance warning
```

這些訊息不一定來自 Netflix Skipper。

如果要回報本專案 Bug，最好提供：

- 可穩定重現的操作步驟
- Netflix 播放畫面截圖
- Firefox / Chromium 版本
- 擴充功能版本
- Console 中包含 `Netflix Skipper` 的錯誤
- 問題是否在關閉其他 Netflix 相關擴充功能後仍然存在

---

## Firefox 本地測試

若你希望直接測試原始碼：

1. 開啟 Firefox。
2. 前往：

   ```text
   about:debugging#/runtime/this-firefox
   ```

3. 選擇 **載入暫用附加元件 / Load Temporary Add-on**。
4. 選擇專案中的 `manifest.json`。
5. 開啟 Netflix `/watch/...` 頁面測試。

> 暫用附加元件在 Firefox 重新啟動後會被移除。

---

## 建議測試項目

修改程式碼後，至少確認：

- Skip Intro 可以正常觸發。
- Skip Recap 可以正常觸發。
- Next Episode 在**不移動滑鼠**的情況下仍能可靠觸發。
- Next Episode 不會一次連跳兩集。
- Still Watching 關閉時不會自行按下 Continue。
- Popup 與 Player Quick Settings 的五個開關可以雙向同步。
- Netflix 首頁與搜尋頁不會出現播放器快速設定。
- 連續播放多集不會累積重複設定按鈕。
- 全螢幕進出後 UI 仍然正常。
- Netflix Skipper 沒有長時間異常 CPU 使用率。

---

## 專案結構

Firefox v1.2.1 主要檔案：

```text
.
├── manifest.json
├── content.js
├── popup.html
├── popup.css
├── popup.js
├── toastify.js
├── toastify.css
├── _locales/
│   ├── zh-TW/
│   │   └── messages.json
│   └── en/
│       └── messages.json
├── images/
├── README.md
├── CHANGELOG.md
├── PRIVACY.md
├── THIRD_PARTY_NOTICES.md
├── TEST_CHECKLIST.md
└── PROJECT_STRUCTURE.md
```

核心功能主要位於 `content.js`。

---

## 開發注意事項

若要修改播放器偵測邏輯，建議維持以下原則：

- 不要重新加入高頻率整頁 DOM polling。
- 不要使用模糊的全頁文字搜尋去自動點擊 Netflix 控制項。
- 不要因 Netflix 自己的 CORS / Source Map 警告擴張擴充功能權限。
- Netflix DOM selector 不確定時，優先 fail closed，而不是猜一個可能誤點的元素。
- SPA 換集後必須避免重複 observer、重複 listener 與重複 Player Quick Settings。
- 修改後至少測試連續 3 集 Next Episode。
- 保持所有文字檔 UTF-8。

---

## 已知限制

Netflix 的播放器 DOM、`data-uia`、Post-play 流程與 A/B Test 可能隨時間變更。

因此即使目前功能正常，未來仍可能因 Netflix 更新而需要調整 selector 或播放器掛載邏輯。

若 Netflix 本身沒有提供對應的：

- Skip Intro
- Skip Recap
- Next Episode
- Continue Playing

控制項，本擴充功能不會自行修改影片時間軸來模擬這些功能。

---

## 問題回報

如果遇到功能失效或 Netflix 改版：

**[前往 GitHub Issues](https://github.com/ErttyOuO/Netflix-Intro-Recap-Skipper-Firefox-/issues)**

回報時請盡量附上：

```text
Browser:
Extension version:
Netflix UI language:
Feature:
Reproduction steps:
Expected result:
Actual result:
Console error:
```

這會比較容易判斷是 Netflix DOM 改版、瀏覽器差異，還是擴充功能本身的 Bug。

---

## Credits

本專案來源改編自：

- **JohnnyTseng**
  - https://github.com/JohnnyTseng
- **SafariNflxAutoSkip**
  - https://github.com/JohnnyTseng/SafariNflxAutoSkip

Firefox / Chromium 維護版本：

- **ErttyOuO**
  - https://github.com/ErttyOuO

感謝原作者與相關開源專案提供基礎。

---

## License

本專案採用 **MIT License**。

第三方程式庫的授權資訊請參考專案內的 `THIRD_PARTY_NOTICES.md`。

---

## Disclaimer

Netflix 是 Netflix, Inc. 的商標。

本專案為非官方開源工具，與 Netflix, Inc. 無關，亦未獲 Netflix 官方贊助、認可或背書。

使用本擴充功能時，請自行確認符合 Netflix 與所在地區適用的服務條款及規範。
