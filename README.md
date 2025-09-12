# Netflix Intro & Recap Skipper (Firefox WebExtension)

針對 Firefox 整理出的插件版本。來源改編自：
- 原作者：https://github.com/JohnnyTseng
- Safari 專案：https://github.com/JohnnyTseng/SafariNflxAutoSkip

一個幫你在 Netflix 自動跳過「片頭 (Intro)」和「前情提要 (Recap)」的輕量化 Firefox 擴充套件。

## 功能特色

🔹 自動跳過片頭：偵測到「Skip Intro」按鈕時自動點擊

🔹 自動跳過前情提要：有「Skip Recap」時一樣自動幫你處理

🔹 即裝即用：安裝後開啟 Netflix 即可生效，不需要額外設定

## 已上架至Firefox Add-ons！
請至此處安裝：https://addons.mozilla.org/zh-TW/firefox/addon/netflix-%E7%89%87%E9%A0%AD%E7%89%87%E5%B0%BE%E8%87%AA%E5%8B%95%E8%B7%B3%E9%81%8E/

## 結構
- manifest.json (MV2 for Firefox)
- background.js / content.js / popup.*
- toastify.css / toastify.js
- _locales/en/messages.json
- images/ (請從 Resources/images 複製圖檔)

## 下載後套用方法(每次開啟瀏覽器需重新套用)
1. 打開 Firefox → `about:debugging#/runtime/this-firefox`
2. Load Temporary Add-on → 選擇此資料夾下的 `manifest.json`
3. 到 Netflix 影片頁確認是否自動 Skip Intro/Recap

## 注意事項

若 Netflix 沒有顯示「跳過」按鈕，插件無法作用
Netflix 若改版 UI（例如按鈕名稱或結構變動），插件可能需更新
僅支援 Firefox，其他瀏覽器請參考對應版本。
