# Privacy Policy — Netflix Intro & Recap Skipper

Version: 1.2.1

Netflix Intro & Recap Skipper is designed to operate locally in the browser.

## Data collection

This extension does **not** collect, sell, transmit, or remotely store:

- Netflix account information
- Viewing history
- Video or audio content
- Subtitles
- Cookies
- Passwords
- Personal identifiers
- Analytics or telemetry

## Local storage

The extension uses Firefox `storage` only to remember local feature preferences such as whether Skip Intro, Skip Recap, Next Episode, Continue Playing, and toast notifications are enabled.

## Network access

The extension does not make external API requests and does not load remote code. Toastify is bundled locally with the extension.

## Page access

The content script is limited to `https://www.netflix.com/*` and only interacts with Netflix controls that match the extension's known selectors.

## Disclaimer

Netflix is a trademark of Netflix, Inc. This project is not affiliated with or endorsed by Netflix.


## v1.2.0 Player Quick Settings 補充

播放器內快速設定只讀寫與 Popup 相同的 `browser.storage.local` 功能開關。此介面不新增資料收集、外部傳輸、Cookie 存取或第三方服務。
