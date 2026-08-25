# Changelog

## 1.2.1

### Fixed
- Fixed an intermittent Next Episode miss when Netflix pre-renders the Post-play button while an ancestor is still hidden.
- Hidden candidate controls now observe their own element plus the bounded ancestor chain up to the Netflix watch root for `class`, `style`, `aria-hidden`, `aria-disabled`, and `disabled` changes.
- Added finite single-element visibility rechecks for hidden candidates, with a longer window for Next Episode because Netflix can pre-render Post-play UI well before revealing it.
- Candidate watcher cleanup now clears all retry timers and disconnects observers when the control is handled, removed, or expires.

### Safety / performance
- No `setInterval`, document-wide retry scan, or continuous RAF loop was added.
- Delayed rechecks only inspect the already-known candidate element; they do not call `document.querySelectorAll`.
- No new permissions, network requests, fuzzy text matching, or Netflix private APIs.

## 1.2.0

### Added
- Added Player Quick Settings directly inside Netflix `/watch/` pages.
- Added five in-player toggles matching the Firefox popup settings.
- Added Shadow DOM style isolation for the player settings UI.
- Added a native-anchor-first placement strategy using `[data-uia="control-flag"]` with a safe player-overlay fallback.
- Added player settings i18n strings for Traditional Chinese and English.
- Added quick-settings mount diagnostics to the popup status message response.

### Changed
- Popup and Player Quick Settings now explicitly share the same `browser.storage.local` setting keys.
- SPA navigation and DOM rebuild handling now also keeps the quick settings UI single-mounted.
- Fullscreen changes trigger one event-driven placement refresh; no animation loop or interval is used.
- Updated documentation and release test checklist for the new player UI.

### Safety / performance
- No new permissions.
- No new external API/network requests.
- No `setInterval`, continuous `requestAnimationFrame`, or high-frequency polling added.
- No fuzzy text matching added for auto-click actions.

## 1.1.0

### Changed
- Replaced 500ms document polling with event-driven DOM handling.
- Added SPA-aware `/watch/` activation behavior.
- Added stable per-action cooldowns to reduce duplicate clicks after Netflix re-renders.
- Restricted Next Episode handling to explicit Netflix selectors instead of text matching.
- Added selector fallbacks for intro/recap controls.
- Reordered Toastify before the content script so notification code is always available when needed.
- Removed the unused background script and greeting message handler.
- Converted manifest and popup strings to Firefox i18n.

### Added
- Optional Continue Playing / Still Watching handling, disabled by default.
- Toast notification setting.
- Popup playback status and per-tab session action count.
- `PRIVACY.md` and `TEST_CHECKLIST.md`.

## 1.0.2
- Previous release baseline.
