<div align="center">
  <img src="images/icon-128.png" alt="Netflix + 動畫瘋自動播放助手" width="96">

# Netflix + 動畫瘋自動播放助手

**Firefox WebExtension · v2.2.6**

一個擴充功能，同時支援 **Netflix** 與 **巴哈姆特動畫瘋**。  
Netflix 提供片頭／前情提要／下一集自動處理與播放器內快速設定；動畫瘋提供分級自動同意、片頭／片尾人工學習、視覺辨識自動跳過、Profile 管理與本機備份。

[Firefox Add-ons](https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%88%87%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE/) · [GitHub Repository](https://github.com/ErttyOuO/Netflix-Intro-Recap-Skipper-Firefox-)
</div>

---


## v2.2.6：多影格錨點自動辨識

v2.2.4～v2.2.5 雖然修正了「片頭前劇情影格被誤存」問題，但仍只用**一張片段入點畫面**做自動辨識。動畫片頭常有轉場、淡入或不同集數略微錯位，只靠第一幀會造成 Profile 已儲存、下一集卻始終只有低相似度而不跳過。

v2.2.6 改成真正的多影格學習：

- 儲存片頭／片尾時，先保留使用者選定的精確入點。
- 擴充功能會暫停播放器，短暫回到片段開始後約前 **6 秒**，擷取最多 **6 個時間錨點**（0、1.2、2.4、3.6、4.8、6.0 秒）。
- 擷取完成後會自動回到使用者選定的片段結束點，並恢復原本播放／暫停狀態。
- 至少取得 **3 個可辨識錨點**才會真正寫入 Profile；不足時不會假裝「儲存成功」。
- 下一集播放時，每 180 ms 取樣一次，只要匹配到任何已學習錨點，就依該錨點在片頭內的 offset 扣掉已播放時間，再跳過剩餘部分。
- 多個 Profile 同時符合時仍選最高相似度，不依 storage 順序。
- Popup 會把 v2.2.6 Profile 標成「多影格 · N 錨點」；舊的單影格 Profile 會標示「單影格舊資料 · 建議重新學習」。
- Popup 現在會分別記錄每一個 Profile 的最近比對相似度，不會再把「尚未比對」誤顯示成 0.0%。
- 匯出／匯入會完整保留多個 anchors 與各自的 `offsetSeconds`，不再降級回單一 anchor。

這項修改同時套用片頭與片尾。

---

## v2.2.5：片頭學習排除超大幅度快轉

為了避免使用者只是在影片內找進度時誤跳出片頭學習 UI，動畫瘋片頭學習新增一條明確規則：

- 單次人工向前快轉 **超過 3 分鐘（180 秒）**：視為一般找進度，不顯示「是否儲存片頭」詢問。
- 單次人工向前快轉 **剛好 3 分鐘**：仍允許成為片頭候選。
- 這個限制只套用在**片頭學習**；片尾仍依「最後 6 分鐘」規則運作。
- 片頭的可偵測起點範圍仍維持影片前 **10 分鐘**。

這個判斷在候選卡建立前完成，因此被排除的大幅度快轉不會寫入片頭候選、也不會彈出 UI。

---

## v2.2.4：精確片頭／片尾入點 + Profile 管理

這一版重做動畫瘋的學習 anchor 邏輯，目標是避免「片頭本身一樣，但因為片頭前劇情不同就無法套用」的問題。

舊版可能接受距人工快轉起點約 2 秒以上的背景取樣影格，甚至把快轉前的歷史影格一起存進 Profile；之後自動比對時，這些畫面可能其實屬於前一段劇情，而不是片頭本身。

v2.2.4 改成：

- 在使用者操作時間軸／快轉鍵之前先擷取**真正的入點影格**。
- 入點影格與實際快轉起點允許誤差縮小到 **0.45 秒**。
- 抓不到足夠精確的入點時，**不允許儲存**，避免默默保存錯誤資料。
- 新 Profile 不再保存快轉前數秒的歷史影格，只保存精確 start anchor。
- 過於單色／缺乏辨識資訊的入點影格會拒絕儲存。
- 多個 Profile 同時符合時，選擇**最高相似度**的 Profile，而不是依儲存順序先到先跳。
- 結束縮圖會在 `seeked` 後立即擷取，避免播放繼續前進後抓到錯的結束畫面。

### 舊版 Profile

v2.2.3 以前建立的 Profile 因為無法可靠判斷其中哪些影格是片頭、哪些是片頭前劇情，因此 v2.2.4：

- 仍然保留在 `storage.local`
- 仍可匯出／匯入
- 仍會顯示在 Popup
- 可以**單獨刪除**
- 但**不再直接參與自動跳過**

建議在 Popup 中刪除標示「舊版資料」的片頭／片尾，重新學習一次。

---

## 動畫瘋 Profile 管理

Popup 的動畫瘋頁面現在會直接顯示目前作品每一組 Profile：

```text
片頭 1   多影格 · 6 錨點
[入點圖] [結束圖]
00:43 → 02:12 · 89.0s
[刪除]

片頭 2   單影格舊資料 · 建議重新學習
[舊入點圖] [無預覽]
...
```

每一組片頭／片尾都可以：

- 查看**入點圖**
- 查看**結束圖**
- 查看起訖時間、跳過長度與累積 ±2 秒調整值
- 查看最近一次與該 Profile 對應的相似度（若本頁已有比對）
- **單獨刪除**，不需要把整部作品的所有資料一起清掉

---

## 學習詢問 UI

v2.2.4 再縮小動畫瘋學習卡尺寸，減少遮住影片畫面的範圍。

按鈕語意也重新整理：

- **儲存片頭／片尾**：保存這次候選。
- **略過本集**：本集後續不再詢問同類型候選；片頭與片尾分開記錄。
- **稍後再問**：只關閉目前卡片，之後再次人工快轉仍可詢問。
- **× 關閉**：與「稍後再問」相同，不會標記整集。

---

## 累積 ±2 秒結束點調整

`−2 秒` 與 `+2 秒` 可以連續重複點擊：

```text
原位置 02:00
+2 → 02:02
+2 → 02:04
+2 → 02:06
−2 → 02:04
```

每一次調整都會同步：

- 動畫瘋實際播放器 `currentTime`
- 原生時間軸位置
- UI 顯示的結束時間
- 跳過長度
- 累積 `adjustmentSeconds`

按「原位置」可以回到原始快轉結束點。

---

## 片頭／片尾時間窗

### 片頭

- 學習與自動辨識範圍：`00:00–10:00`
- 本集成功自動跳過一次片頭後，停止本集片頭自動比對
- 同一集仍可人工學習第二／第三組不同片頭
- 每部作品最多保存 **3 組片頭**

### 片尾

- 學習與自動辨識範圍：影片**最後 6 分鐘**
- 24 分鐘影片從 `18:00` 開始進入片尾區間
- 每部作品最多保存 **3 組片尾**
- 可使用 2 秒／4 秒倒數後跳過，並可取消繼續觀看

---

## 視覺辨識

動畫瘋模組從 `<video>` 讀取低解析度純影片影格，在本機建立 **16 × 9 感知視覺指紋**。

目前多層辨識門檻：

- **Strong**：相似度 `≥ 0.93` 可立即觸發
- **Medium**：`0.88–0.93`，每次累積 2 分
- **Soft**：`0.84–0.88`，每次累積 1 分
- `1.9 秒`內累積 `3 分`且至少 `2 次命中`可觸發

v2.2.4 的自動跳過只使用具備新版精確 anchor 的 Profile。

---

## Netflix 功能

- 🍿 自動跳過片頭
- 🕵️ 自動跳過前情提要
- 📺 自動播放下一集
- ▶️ 可選擇處理「仍在觀看嗎」
- 🔔 跳過提示
- ⚙️ Netflix Player Quick Settings
- 🧭 Netflix SPA 換集／播放器 DOM 重建相容
- 🛡️ Next Episode hidden-parent 可靠性修正

Netflix 與動畫瘋使用不同 Content Script；動畫瘋影格取樣不會在 Netflix 網頁執行。

---

## 統一 Popup

同一個 Popup 可切換：

- **Netflix**：五個 Netflix 設定與播放器狀態
- **動畫瘋**：自動同意、片頭／片尾學習、自動跳過、目前作品診斷、相似度、影格測試、Profile 管理與備份

動畫瘋介面支援：

- 繁體中文
- 简体中文
- English

---

## 學習資料備份

v2.2.4 備份格式：

```text
netflix-bahamut-auto-player/bahamut-skip-learning
schemaVersion: 3
```

備份可包含：

- 作品 key / ID / 名稱
- 多影格 start anchors（包含每個 anchor 的時間 offset）
- 入點與結束點視覺指紋
- 入點與結束點預覽縮圖
- 跳過秒數
- 起訖時間提示
- 完整累積 `adjustmentSeconds`
- 來源集數 URL

仍可匯入舊版備份。舊版 Profile 會被保留，但會標記為 legacy，不直接參與自動跳過。

---

## 隱私與權限

本擴充功能：

- 不包含 Analytics / Telemetry
- 不載入遠端 JavaScript
- 不呼叫外部 API
- 不上傳影片影格、學習資料或觀看紀錄
- 動畫瘋視覺指紋與預覽圖只保存在本機 `storage.local`

Manifest API 權限只有：

```json
"permissions": ["storage"]
```

網站範圍只有：

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

[Netflix 與動畫瘋自動播放](https://addons.mozilla.org/zh-TW/firefox/addon/netflix%E8%88%87%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE/)

### 本機測試

1. Clone 或下載 Repository。
2. Firefox 開啟 `about:debugging#/runtime/this-firefox`。
3. 選擇「載入暫用附加元件」。
4. 選擇根目錄 `manifest.json`。
5. 分別測試 Netflix 與動畫瘋。

---

## 專案結構

```text
.
├─ manifest.json
├─ popup.html
├─ popup.css
├─ popup.js
├─ _locales/
├─ images/
├─ sites/
│  ├─ netflix/
│  │  ├─ content.js
│  │  ├─ toastify.js
│  │  └─ toastify.css
│  └─ bahamut/
│     ├─ content.js
│     └─ content.css
├─ tests/
├─ PRIVACY.md
├─ THIRD_PARTY_NOTICES.md
├─ BAHAMUT-LICENSE.txt
└─ README.md
```

---

## v2.2.6 開發安全規則

- 不再讓快轉前的歷史影格進入新版 Profile。
- 沒有精確 start anchor 時不建立候選。
- 新 Profile 少於 3 個有效多影格 anchors 時不宣告儲存成功。
- 單影格舊 Profile 在 Popup 明確標示建議重學，不會被誤認成 v2.2.6 多影格 Profile。
- 多 Profile 依相似度選擇，不依 storage 順序。
- Netflix 不重新引入固定 500 ms 全頁 polling。
- 不增加 `<all_urls>`。
- 不增加 Analytics、Telemetry、遠端程式碼或 CDN JavaScript。
- 不繞過瀏覽器 CORS 影片像素限制。

詳細修改請見 [`CHANGELOG_V2.2.6.md`](CHANGELOG_V2.2.6.md)。

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
