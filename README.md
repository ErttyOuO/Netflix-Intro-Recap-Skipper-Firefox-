# Netflix Intro & Recap Skipper (Firefox WebExtension)

這是針對 Firefox 整理出的純 WebExtension 版本。來源改編自：
- 原作者：https://github.com/JohnnyTseng
- Safari 專案：https://github.com/JohnnyTseng/SafariNflxAutoSkip

## 結構
- manifest.json (MV2 for Firefox)
- background.js / content.js / popup.*
- toastify.css / toastify.js
- _locales/en/messages.json
- images/ (請從 Resources/images 複製圖檔)

## 開發測試
1. 打開 Firefox → `about:debugging#/runtime/this-firefox`
2. Load Temporary Add-on → 選擇此資料夾下的 `manifest.json`
3. 到 Netflix 影片頁確認是否自動 Skip Intro/Recap

## 署名與授權
- 請在發佈與 README 中標註原作者與來源連結。
- 繼承並遵守原專案授權條款（LICENSE）。
