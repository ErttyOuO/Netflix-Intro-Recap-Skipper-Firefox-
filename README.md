# Netflix Intro & Recap Skipper (Firefox WebExtension)

針對 Firefox 整理出的插件版本。來源改編自：
- 原作者：https://github.com/JohnnyTseng
- Safari 專案：https://github.com/JohnnyTseng/SafariNflxAutoSkip

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

## 上架Firefox Add-ons
