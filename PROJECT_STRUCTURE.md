# PROJECT_STRUCTURE.md

## Netflix Intro & Recap Skipper — Firefox v1.2.1

```text
Netflix-Intro-Recap-Skipper-Firefox-v1.2.1/
├─ manifest.json
├─ content.js
├─ popup.html
├─ popup.css
├─ popup.js
├─ toastify.js
├─ toastify.css
├─ _locales/
│  ├─ zh-TW/messages.json
│  └─ en/messages.json
├─ images/
├─ README.md
├─ CHANGELOG.md
├─ PRIVACY.md
├─ THIRD_PARTY_NOTICES.md
├─ TEST_CHECKLIST.md
└─ PROJECT_STRUCTURE.md
```

## Runtime responsibilities

### `content.js`

- Netflix `/watch/` page detection.
- Event-driven Skip Intro / Recap / Next Episode / Continue Playing detection.
- Per-action cooldown and visibility checks.
- Toast trigger.
- Player Quick Settings mount/unmount and Shadow DOM UI.
- `browser.storage.local` change synchronization.
- SPA navigation and fullscreen placement refresh.

### Popup

- `popup.html` / `popup.css`: browser toolbar settings UI.
- `popup.js`: reads/writes the same five setting keys used by Player Quick Settings.

### Storage keys

```text
skipIntro
skipRecap
skipNextEpisode
dismissStillWatching
showToast
```

Both Popup and Player Quick Settings MUST use these same keys. Do not create duplicate player-only settings unless a future feature explicitly requires it.

## Player Quick Settings placement

Priority:

```text
[1] [data-uia="control-flag"] parent
        ↓ unavailable
[2] [data-uia="watch-video"] / .watch-video fallback
```

- Native anchor: insert the single `#netflix-skipper-quick-settings-host` immediately before the flag control.
- Fallback: append the same host to the Netflix watch root and use viewport-fixed top-right placement.
- The settings panel must remain inside the host Shadow DOM.
- Never create a second host for fullscreen or after SPA navigation.

## Hard constraints for future edits

- Maintain UTF-8. Do not introduce mojibake.
- Read original text before changing uncertain strings; make minimal edits.
- Do not reintroduce 500ms / 1s fixed polling for player controls.
- Do not add full-page repeated DOM scans on every mutation.
- Do not add continuous RAF positioning loops.
- Do not bind duplicate listeners during SPA remounts.
- Do not broaden host permissions without a feature that actually requires it.
- Do not add external analytics, telemetry, tracking, remote code or CDN scripts.
- Do not use fuzzy global text matching to click Netflix controls.
- Do not modify Netflix inline layout styles solely to position the extension UI.
- On selector/host uncertainty, fail closed: hide or use the documented safe fallback rather than guessing unrelated DOM.

## Release packaging

AMO ZIP root should directly contain `manifest.json` and runtime files. Exclude:

```text
.git/
old release ZIPs
local logs
screenshots used only for development
editor temp files
```
## v1.2.1 Next Episode hidden-parent reliability fix

- 問題根因：Netflix 可先建立 `[data-uia="next-episode-seamless-button"]`，但透過父層 Post-play 容器維持隱藏。v1.2.0 只監控候選按鈕本身屬性且 15 秒後停止，父層稍後變成可見時可能漏掉。
- 修正：候選 watcher 只針對該控制項與到 `[data-uia="watch-video"]` / `.watch-video` 為止的有限祖先鏈監聽可見性相關屬性。
- Next Episode watcher 最長 90 秒，並加入有限次單元素可見性重查，處理沒有 DOM attribute mutation 的 CSS 顯示轉換。
- 重查禁止使用 `document.querySelectorAll`、全頁掃描、`setInterval`、持續 RAF。
- 必須維持 action cooldown，避免 Netflix Post-play 重建造成連續跳兩集。
- 不增加 permissions、外部網路請求、文字模糊 selector 或 Netflix 私有 API。
- 維持 UTF-8；不確定 Netflix 原始 DOM 時先讀取原文再最小幅度修改。

