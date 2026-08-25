# Netflix Intro & Recap Skipper — Firefox v1.2.1

針對 Firefox 維護的 Netflix 自動跳過擴充功能，來源改編自 JohnnyTseng 的 SafariNflxAutoSkip。

## v1.2.1 修正：下一集偶發漏按

- 修正 Netflix 先建立「下一集」按鈕、但父層 Post-play 容器仍隱藏時可能漏按的競態問題。
- v1.2.0 只監控候選按鈕本身的屬性，而且最多 15 秒；Netflix 若稍後只改父層 `class` / `style` / `aria-hidden`，插件可能不知道按鈕已經可見。
- v1.2.1 改為只針對已找到的候選控制項，監控它到播放器根節點之間的有限父層鏈。
- Next Episode 隱藏候選的監控生命週期延長至 90 秒，適應 Netflix 提前建立 Post-play UI 的情況。
- 加入有限次、單一候選元素的可見性重查，處理純 CSS 顯示狀態變化；不重新掃描整頁 DOM。
- 不恢復 500ms 輪詢、不增加權限、不加入文字模糊比對。

## v1.2.0 主要更新：Player Quick Settings

- Netflix `/watch/` 播放頁新增播放器內快速設定入口，不必再特別打開 Firefox 工具列 Popup。
- 快速設定提供與 Popup 相同的 5 個開關：片頭、前情提要、下一集、仍在觀看、跳過提示。
- 播放器面板與 Popup 共用同一份 `browser.storage.local` 設定，任一入口修改後都會套用到核心功能。
- 快速設定使用 Shadow DOM 隔離樣式，降低 Netflix CSS 改版造成樣式污染的風險。
- 優先掛在 Netflix 明確的 `[data-uia="control-flag"]` 控制項旁；若不存在則退回播放器右上角安全位置。
- Netflix SPA 換集或重建控制列時只維持單一設定按鈕，不建立重複 UI。
- 離開 `/watch/` 頁會移除播放器設定 UI，返回播放頁後再重新掛載。
- 不新增額外權限、不新增外部請求、不新增固定 interval / 高頻 polling。

## v1.1.0 核心重構仍保留

- 移除原本每 500ms 的全頁輪詢，不再固定重複掃描整個 DOM。
- 使用事件驅動 `MutationObserver`，主要處理新增的 Netflix 控制項。
- 針對 Netflix SPA 導航處理 `/watch/` 播放頁。
- selector fallback + action cooldown，降低 DOM 改版與重複點擊風險。
- 「下一集」只接受明確 Netflix selector，不使用文字模糊搜尋。
- 「仍在觀看嗎 / Continue Playing」可自動處理，預設關閉。
- Popup 有播放狀態、本頁自動處理次數、繁中/英文 i18n。

## 功能

- 自動跳過片頭（預設開啟）
- 自動跳過前情提要（預設開啟）
- 自動播放下一集（預設開啟）
- 自動處理「仍在觀看嗎」提示（預設關閉）
- 可關閉畫面 Toast 提示
- Firefox Popup 設定
- Netflix 播放器內快速設定
- 每個 Netflix 分頁保留本頁工作階段計數

## 播放器快速設定的設計

快速設定只在 Netflix `/watch/...` 播放頁工作。

1. 若 Netflix 當前 DOM 有 `[data-uia="control-flag"]`，設定按鈕會優先放在同一個控制區旁（優先位於檢舉旗幟左側）。
2. 若該控制項不存在，則以播放器根節點 `[data-uia="watch-video"]` / `.watch-video` 作為安全 fallback host，將按鈕放在播放器右上角。
3. 設定面板本身使用 Shadow DOM，不依賴 Netflix 內部 class 名稱來維持樣式。
4. 找不到可靠 Netflix host 時不會把整個設定面板硬塞進未知的原生控制列 DOM。

## 隱私與安全

本擴充功能：

- 不包含分析/追蹤 SDK。
- 不呼叫外部 API。
- 不上傳 Netflix 帳號、影片、字幕或觀看紀錄。
- 僅使用 `browser.storage.local` 儲存功能開關。
- API 權限只有 `storage`；Content Script 網站存取只限 `https://www.netflix.com/*`。
- `data_collection_permissions.required` 宣告為 `none`。
- Firefox 最低版本為 140。
- 播放器快速設定不需要新權限，也不讀取 Cookie、帳號資料或 Netflix 私有 API。

詳細內容請見 `PRIVACY.md`。

## 本地測試

1. Firefox 開啟 `about:debugging#/runtime/this-firefox`。
2. 選擇「載入暫用附加元件」。
3. 選擇本專案根目錄的 `manifest.json`。
4. 開啟 Netflix，依照 `TEST_CHECKLIST.md` 完整測試。

> 暫用附加元件在 Firefox 重啟後會被移除。正式安裝仍需經 AMO 簽署。

## 專案結構

- `manifest.json` — Firefox MV2 設定
- `content.js` — Netflix 自動跳過核心 + Player Quick Settings
- `popup.html` / `popup.css` / `popup.js` — Firefox Popup 設定介面
- `toastify.js` / `toastify.css` — 本地 Toast 元件，不連線外部 CDN
- `_locales/` — `zh-TW`、`en`
- `images/` — 擴充功能圖示
- `PRIVACY.md` — 隱私說明
- `THIRD_PARTY_NOTICES.md` — 第三方元件來源與授權
- `TEST_CHECKLIST.md` — 上架前測試清單
- `PROJECT_STRUCTURE.md` — 專案結構與修改限制
- `CHANGELOG.md` — 版本變更紀錄

## 注意事項

Netflix 若沒有提供對應的 Skip / Next / Continue 控制項，本擴充功能不會自行改變影片時間軸。Netflix 若更改播放器 DOM 或 `data-uia` 名稱，selector 仍可能需要更新。
