// Netflix Intro, Recap & Next Episode Auto-Skipper
// v2.0.0 unified extension - Netflix module based on v1.2.1, including reliable hidden Post-play detection.

(() => {
  'use strict';

  const DEFAULT_SETTINGS = Object.freeze({
    skipIntro: true,
    skipRecap: true,
    skipNextEpisode: true,
    dismissStillWatching: false,
    showToast: true
  });

  const ACTIONS = Object.freeze({
    skipIntro: {
      selectors: [
        '[data-uia="player-skip-intro"]',
        '.watch-video--skip-content-button'
      ],
      messageKey: 'toast_intro',
      cooldownMs: 5000
    },
    skipRecap: {
      selectors: [
        '[data-uia="player-skip-recap"]',
        '.watch-video--skip-preplay-button'
      ],
      messageKey: 'toast_recap',
      cooldownMs: 5000
    },
    skipNextEpisode: {
      selectors: [
        '[data-uia="next-episode-seamless-button"]',
        '[data-uia="next-episode-seamless-button-draining"]'
      ],
      messageKey: 'toast_next_episode',
      cooldownMs: 8000
    },
    dismissStillWatching: {
      selectors: [
        '[data-uia="interrupt-autoplay-continue"]'
      ],
      messageKey: 'toast_still_watching',
      cooldownMs: 8000
    }
  });

  const QUICK_SETTINGS = Object.freeze([
    { key: 'skipIntro', icon: '🍿', labelKey: 'setting_skip_intro' },
    { key: 'skipRecap', icon: '🕵️', labelKey: 'setting_skip_recap' },
    { key: 'skipNextEpisode', icon: '📺', labelKey: 'setting_next_episode' },
    {
      key: 'dismissStillWatching',
      icon: '▶️',
      labelKey: 'setting_still_watching',
      noteKey: 'setting_still_watching_note'
    },
    { key: 'showToast', icon: '🔔', labelKey: 'setting_toast' }
  ]);

  const ALL_SELECTORS = Object.values(ACTIONS)
    .flatMap((config) => config.selectors)
    .join(',');

  const QUICK_SETTINGS_HOST_ID = 'netflix-skipper-quick-settings-host';
  const FLAG_SELECTOR = '[data-uia="control-flag"]';
  const WATCH_ROOT_SELECTOR = '[data-uia="watch-video"], .watch-video';

  let settings = { ...DEFAULT_SETTINGS };
  let settingsLoaded = false;
  let lastPathname = window.location.pathname;
  let quickSettingsHost = null;
  let quickSettingsShadow = null;
  let quickSettingsPanelOpen = false;

  const recentActions = new Map();
  const candidateObservers = new Map();
  const sessionStats = {
    skipIntro: 0,
    skipRecap: 0,
    skipNextEpisode: 0,
    dismissStillWatching: 0
  };

  function isWatchPage() {
    return window.location.hostname === 'www.netflix.com' &&
      /^\/watch\/[^/]+/.test(window.location.pathname);
  }

  function getMessage(key) {
    return browser.i18n.getMessage(key) || key;
  }

  function isVisible(element) {
    if (!(element instanceof Element) || !element.isConnected) return false;

    const style = window.getComputedStyle(element);
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      Number.parseFloat(style.opacity || '1') <= 0
    ) {
      return false;
    }

    if (element.closest('[aria-hidden="true"]')) return false;
    return element.getClientRects().length > 0;
  }

  function isEnabledControl(element) {
    if (!(element instanceof Element)) return false;
    if (element.hasAttribute('disabled')) return false;
    if (element.getAttribute('aria-disabled') === 'true') return false;
    return typeof element.click === 'function';
  }

  function identifyAction(element) {
    for (const [key, config] of Object.entries(ACTIONS)) {
      if (config.selectors.some((selector) => element.matches(selector))) {
        return key;
      }
    }
    return null;
  }

  function isOnCooldown(actionKey) {
    const config = ACTIONS[actionKey];
    const lastClickedAt = recentActions.get(actionKey) || 0;
    return Date.now() - lastClickedAt < config.cooldownMs;
  }

  function markClicked(actionKey) {
    recentActions.set(actionKey, Date.now());
    sessionStats[actionKey] += 1;
  }

  function stopCandidateObserver(element) {
    const entry = candidateObservers.get(element);
    if (!entry) return;

    entry.observer.disconnect();
    window.clearTimeout(entry.timeoutId);
    for (const retryId of entry.retryIds) {
      window.clearTimeout(retryId);
    }
    candidateObservers.delete(element);
  }

  function getCandidateWatchTargets(element) {
    const targets = [];
    const watchRoot = element.closest(WATCH_ROOT_SELECTOR);
    let current = element;

    // Netflix sometimes renders Post-play controls early and hides them through
    // an ancestor. Observe only this candidate's ancestor chain, never the whole page.
    while (current instanceof Element) {
      targets.push(current);
      if (current === watchRoot || targets.length >= 16) break;
      current = current.parentElement;
    }

    return targets;
  }

  function getCandidateRetryDelays(actionKey) {
    if (actionKey === 'skipNextEpisode') {
      // The Post-play button can be pre-rendered well before Netflix reveals it.
      // These are finite single-element visibility checks, not a polling loop or DOM scan.
      return [250, 750, 1500, 3000, 5000, 8000, 12000, 18000, 26000, 38000, 55000, 75000];
    }

    return [250, 1000, 3000, 8000, 15000];
  }

  function watchCandidateUntilVisible(element, actionKey) {
    if (candidateObservers.has(element) || !element.isConnected) return;

    const recheck = () => {
      if (!element.isConnected) {
        stopCandidateObserver(element);
        return;
      }

      if (isVisible(element)) {
        stopCandidateObserver(element);
        tryClickCandidate(element, actionKey);
      }
    };

    const observer = new MutationObserver(recheck);
    const watchTargets = getCandidateWatchTargets(element);
    for (const target of watchTargets) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: ['class', 'style', 'aria-hidden', 'aria-disabled', 'disabled']
      });
    }

    const retryIds = getCandidateRetryDelays(actionKey).map((delayMs) =>
      window.setTimeout(recheck, delayMs)
    );

    // Keep the targeted watcher long enough for Netflix's Post-play pre-render window,
    // then release everything even if the candidate remains hidden.
    const timeoutMs = actionKey === 'skipNextEpisode' ? 90000 : 20000;
    const timeoutId = window.setTimeout(() => {
      stopCandidateObserver(element);
    }, timeoutMs);

    candidateObservers.set(element, { observer, timeoutId, retryIds });
  }

  function tryClickCandidate(element, knownActionKey = null) {
    if (!settingsLoaded || !isWatchPage()) return false;

    const actionKey = knownActionKey || identifyAction(element);
    if (!actionKey || !settings[actionKey]) return false;
    if (isOnCooldown(actionKey)) return false;
    if (!isEnabledControl(element)) return false;

    if (!isVisible(element)) {
      watchCandidateUntilVisible(element, actionKey);
      return false;
    }

    stopCandidateObserver(element);

    try {
      element.click();
      markClicked(actionKey);
      showToast(ACTIONS[actionKey].messageKey);
      return true;
    } catch (error) {
      console.error('[Netflix Skipper] Failed to click a Netflix control:', error);
      return false;
    }
  }

  function processElementTree(rootElement) {
    if (!(rootElement instanceof Element) || !isWatchPage()) return;

    if (rootElement.matches(ALL_SELECTORS)) {
      tryClickCandidate(rootElement);
    }

    const candidates = rootElement.querySelectorAll(ALL_SELECTORS);
    for (const candidate of candidates) {
      tryClickCandidate(candidate);
    }
  }

  function scanExistingControls() {
    if (!settingsLoaded || !isWatchPage()) return;

    const candidates = document.querySelectorAll(ALL_SELECTORS);
    for (const candidate of candidates) {
      tryClickCandidate(candidate);
    }
  }

  function getQuickSettingsStyles() {
    return `
      :host {
        --nss-red: #e50914;
        --nss-red-dark: #b20710;
        --nss-bg: rgba(20, 20, 20, 0.96);
        --nss-card: rgba(255, 255, 255, 0.075);
        --nss-card-hover: rgba(255, 255, 255, 0.12);
        --nss-text: #fff;
        --nss-muted: #b3b3b3;
        --nss-border: rgba(255, 255, 255, 0.16);
        --nss-off: #666;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        z-index: 2147483000;
        font-family: "Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        line-height: 1.35;
        color: var(--nss-text);
      }

      :host([data-placement="fallback"]) {
        position: fixed;
        top: 28px;
        right: 82px;
      }

      *, *::before, *::after { box-sizing: border-box; }

      button, input { font: inherit; }

      .launcher {
        width: 44px;
        height: 44px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.42);
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 120ms ease, transform 120ms ease, opacity 120ms ease;
        outline: none;
      }

      .launcher:hover,
      .launcher:focus-visible,
      .launcher[aria-expanded="true"] {
        background: rgba(0, 0, 0, 0.72);
        transform: scale(1.06);
      }

      .launcher:focus-visible {
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(229, 9, 20, 0.85);
      }

      .launcher svg {
        width: 25px;
        height: 25px;
        display: block;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.9;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .panel {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        width: min(330px, calc(100vw - 32px));
        padding: 12px;
        border: 1px solid var(--nss-border);
        border-radius: 12px;
        background: var(--nss-bg);
        color: var(--nss-text);
        box-shadow: 0 16px 46px rgba(0, 0, 0, 0.48);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-6px) scale(0.985);
        transform-origin: top right;
        pointer-events: none;
        transition: opacity 130ms ease, transform 130ms ease, visibility 130ms ease;
      }

      :host([data-placement="fallback"]) .panel {
        top: calc(100% + 8px);
      }

      :host([data-panel-direction="above"]) .panel {
        top: auto;
        bottom: calc(100% + 10px);
        transform-origin: bottom right;
      }

      .panel.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 2px 2px 10px;
      }

      .title-wrap {
        min-width: 0;
      }

      .title {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.01em;
      }

      .subtitle {
        margin: 2px 0 0;
        color: var(--nss-muted);
        font-size: 10.5px;
      }

      .close {
        width: 30px;
        height: 30px;
        flex: 0 0 30px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: #fff;
        cursor: pointer;
        font-size: 23px;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .close:hover,
      .close:focus-visible {
        background: rgba(255, 255, 255, 0.12);
        outline: none;
      }

      .settings {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .row {
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 10px;
        border-radius: 9px;
        background: var(--nss-card);
      }

      .row:hover { background: var(--nss-card-hover); }

      .info {
        display: flex;
        align-items: center;
        gap: 9px;
        min-width: 0;
      }

      .icon {
        width: 24px;
        flex: 0 0 24px;
        text-align: center;
        font-size: 16px;
      }

      .copy {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .label {
        font-size: 12.5px;
        font-weight: 600;
      }

      .note {
        margin-top: 1px;
        color: var(--nss-muted);
        font-size: 9.5px;
      }

      .toggle {
        position: relative;
        width: 42px;
        height: 23px;
        flex: 0 0 42px;
      }

      .toggle input {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      }

      .track {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: var(--nss-off);
        cursor: pointer;
        transition: background 140ms ease, box-shadow 140ms ease;
      }

      .track::before {
        content: "";
        position: absolute;
        width: 17px;
        height: 17px;
        left: 3px;
        top: 3px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        transition: transform 140ms ease;
      }

      .toggle input:checked + .track {
        background: linear-gradient(135deg, var(--nss-red), var(--nss-red-dark));
      }

      .toggle input:checked + .track::before {
        transform: translateX(19px);
      }

      .toggle input:focus-visible + .track {
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(229, 9, 20, 0.75);
      }

      @media (max-width: 560px) {
        :host([data-placement="fallback"]) {
          top: 18px;
          right: 62px;
        }

        .panel {
          width: min(300px, calc(100vw - 24px));
        }
      }
    `;
  }

  function getGearSvg() {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 15.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z"></path>
        <path d="M19.4 13.2c.05-.4.1-.8.1-1.2s-.05-.8-.1-1.2l2-1.55-2-3.46-2.42.98a7.8 7.8 0 0 0-2.08-1.2L14.55 3h-4.1L10.1 5.57a7.8 7.8 0 0 0-2.08 1.2L5.6 5.79l-2 3.46 2 1.55c-.05.4-.1.8-.1 1.2s.05.8.1 1.2l-2 1.55 2 3.46 2.42-.98a7.8 7.8 0 0 0 2.08 1.2L10.45 21h4.1l.35-2.57a7.8 7.8 0 0 0 2.08-1.2l2.42.98 2-3.46-2-1.55Z"></path>
      </svg>
    `;
  }

  function createQuickSettingsHost() {
    if (quickSettingsHost?.isConnected && quickSettingsShadow) {
      return quickSettingsHost;
    }

    const staleHost = document.getElementById(QUICK_SETTINGS_HOST_ID);
    if (staleHost) staleHost.remove();

    const host = document.createElement('span');
    host.id = QUICK_SETTINGS_HOST_ID;
    host.setAttribute('data-netflix-skipper-ui', 'true');
    host.setAttribute('data-placement', 'fallback');

    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = getQuickSettingsStyles();
    shadow.appendChild(style);

    const launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'launcher';
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', getMessage('player_settings_button'));
    launcher.title = getMessage('player_settings_button');
    launcher.innerHTML = getGearSvg();
    shadow.appendChild(launcher);

    const panel = document.createElement('section');
    panel.className = 'panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', getMessage('player_settings_title'));
    panel.innerHTML = `
      <div class="panel-header">
        <div class="title-wrap">
          <h2 class="title"></h2>
          <p class="subtitle"></p>
        </div>
        <button type="button" class="close" aria-label="${escapeHtml(getMessage('player_settings_close'))}">×</button>
      </div>
      <div class="settings"></div>
    `;
    shadow.appendChild(panel);

    const title = panel.querySelector('.title');
    const subtitle = panel.querySelector('.subtitle');
    if (title) title.textContent = getMessage('player_settings_title');
    if (subtitle) subtitle.textContent = getMessage('player_settings_subtitle');

    const settingsContainer = panel.querySelector('.settings');
    for (const item of QUICK_SETTINGS) {
      settingsContainer.appendChild(createQuickSettingRow(item));
    }

    launcher.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setQuickSettingsOpen(!quickSettingsPanelOpen);
    });

    panel.querySelector('.close')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setQuickSettingsOpen(false);
      launcher.focus({ preventScroll: true });
    });

    // Netflix uses pointer/click activity on the player surface for playback and
    // control visibility. Keep interactions with our panel from bubbling into it.
    for (const eventName of ['pointerdown', 'mousedown', 'mouseup', 'click', 'dblclick']) {
      shadow.addEventListener(eventName, (event) => event.stopPropagation());
    }

    shadow.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Escape') {
        event.preventDefault();
        setQuickSettingsOpen(false);
        launcher.focus({ preventScroll: true });
      }
    });

    quickSettingsHost = host;
    quickSettingsShadow = shadow;
    syncQuickSettingsControls();
    return host;
  }

  function createQuickSettingRow(item) {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.settingKey = item.key;

    const info = document.createElement('div');
    info.className = 'info';

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = item.icon;
    info.appendChild(icon);

    const copy = document.createElement('div');
    copy.className = 'copy';

    const labelText = getMessage(item.labelKey);
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = labelText;
    copy.appendChild(label);

    if (item.noteKey) {
      const note = document.createElement('span');
      note.className = 'note';
      note.textContent = getMessage(item.noteKey);
      copy.appendChild(note);
    }

    info.appendChild(copy);
    row.appendChild(info);

    const toggle = document.createElement('label');
    toggle.className = 'toggle';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.settingKey = item.key;
    input.setAttribute('aria-label', labelText);
    input.checked = Boolean(settings[item.key]);

    const track = document.createElement('span');
    track.className = 'track';

    toggle.append(input, track);
    row.appendChild(toggle);

    input.addEventListener('change', async (event) => {
      const value = Boolean(event.currentTarget.checked);
      settings[item.key] = value;

      try {
        await browser.storage.local.set({ [item.key]: value });
      } catch (error) {
        console.error(`[Netflix Skipper] Failed to save ${item.key}:`, error);
        settings[item.key] = !value;
        event.currentTarget.checked = !value;
      }
    });

    return row;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setQuickSettingsOpen(open) {
    if (!quickSettingsShadow || !quickSettingsHost?.isConnected) {
      quickSettingsPanelOpen = false;
      return;
    }

    quickSettingsPanelOpen = Boolean(open);
    const panel = quickSettingsShadow.querySelector('.panel');
    const launcher = quickSettingsShadow.querySelector('.launcher');

    panel?.classList.toggle('open', quickSettingsPanelOpen);
    launcher?.setAttribute('aria-expanded', String(quickSettingsPanelOpen));
  }

  function syncQuickSettingsControls() {
    if (!quickSettingsShadow) return;

    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      const checkbox = quickSettingsShadow.querySelector(
        `input[data-setting-key="${CSS.escape(key)}"]`
      );
      if (checkbox) checkbox.checked = Boolean(settings[key]);
    }
  }

  function removeQuickSettings() {
    setQuickSettingsOpen(false);
    quickSettingsHost?.remove();
    quickSettingsHost = null;
    quickSettingsShadow = null;
  }

  function placeQuickSettingsNearFlag(flagControl) {
    if (!(flagControl instanceof Element) || !flagControl.isConnected) return false;
    const parent = flagControl.parentElement;
    if (!parent) return false;

    const host = createQuickSettingsHost();
    host.setAttribute('data-placement', 'native-anchor');
    const flagRect = flagControl.getBoundingClientRect();
    host.setAttribute(
      'data-panel-direction',
      flagRect.top > window.innerHeight / 2 ? 'above' : 'below'
    );

    if (host.parentElement !== parent || host.nextElementSibling !== flagControl) {
      flagControl.insertAdjacentElement('beforebegin', host);
    }

    return true;
  }

  function placeQuickSettingsFallback(watchRoot) {
    if (!(watchRoot instanceof Element) || !watchRoot.isConnected) return false;

    const host = createQuickSettingsHost();
    host.setAttribute('data-placement', 'fallback');
    host.setAttribute('data-panel-direction', 'below');

    if (host.parentElement !== watchRoot) {
      watchRoot.appendChild(host);
    }

    return true;
  }

  function ensureQuickSettingsMounted() {
    if (!settingsLoaded || !isWatchPage()) {
      removeQuickSettings();
      return false;
    }

    const flagControl = document.querySelector(FLAG_SELECTOR);
    if (flagControl && placeQuickSettingsNearFlag(flagControl)) {
      return true;
    }

    const watchRoot = document.querySelector(WATCH_ROOT_SELECTOR);
    return placeQuickSettingsFallback(watchRoot);
  }

  function inspectAddedTreeForQuickSettings(rootElement) {
    if (!(rootElement instanceof Element) || !isWatchPage()) return;

    let flagControl = null;
    if (rootElement.matches(FLAG_SELECTOR)) {
      flagControl = rootElement;
    } else {
      flagControl = rootElement.querySelector(FLAG_SELECTOR);
    }

    if (flagControl) {
      placeQuickSettingsNearFlag(flagControl);
      return;
    }

    if (!quickSettingsHost?.isConnected) {
      let watchRoot = null;
      if (rootElement.matches(WATCH_ROOT_SELECTOR)) {
        watchRoot = rootElement;
      } else {
        watchRoot = rootElement.querySelector(WATCH_ROOT_SELECTOR);
      }

      if (watchRoot) placeQuickSettingsFallback(watchRoot);
    }
  }

  function handleNavigationChange() {
    const currentPathname = window.location.pathname;
    if (currentPathname === lastPathname) return;

    lastPathname = currentPathname;
    recentActions.clear();
    setQuickSettingsOpen(false);

    if (isWatchPage()) {
      // Netflix is a SPA. Do one bounded refresh on navigation; ongoing work is
      // still driven by added DOM nodes rather than an interval.
      window.requestAnimationFrame(() => {
        scanExistingControls();
        ensureQuickSettingsMounted();
      });
    } else {
      removeQuickSettings();
      for (const element of Array.from(candidateObservers.keys())) {
        stopCandidateObserver(element);
      }
    }
  }

  function handleMutations(mutations) {
    handleNavigationChange();
    if (!settingsLoaded || !isWatchPage()) return;

    let quickSettingsWasRemoved = false;

    for (const mutation of mutations) {
      if (mutation.type !== 'childList') continue;

      if (quickSettingsHost && mutation.removedNodes.length > 0) {
        for (const removedNode of mutation.removedNodes) {
          if (
            removedNode === quickSettingsHost ||
            (removedNode instanceof Element && removedNode.contains(quickSettingsHost))
          ) {
            quickSettingsWasRemoved = true;
            break;
          }
        }
      }

      if (mutation.addedNodes.length === 0) continue;

      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        processElementTree(node);
        inspectAddedTreeForQuickSettings(node);
      }
    }

    if (quickSettingsWasRemoved && !quickSettingsHost?.isConnected) {
      quickSettingsHost = null;
      quickSettingsShadow = null;
      quickSettingsPanelOpen = false;
    }
  }

  function showToast(messageKey) {
    if (!settings.showToast || typeof Toastify !== 'function') return;

    const text = getMessage(messageKey);
    if (!text || text === messageKey) return;

    const playerContainer = document.querySelector('.watch-video') || document.body;

    Toastify({
      text,
      selector: playerContainer,
      position: 'center',
      duration: 1800,
      stopOnFocus: false,
      style: {
        background: '#E50914',
        borderRadius: '4px',
        fontWeight: '600'
      }
    }).showToast();
  }

  async function loadSettings() {
    try {
      const result = await browser.storage.local.get(Object.keys(DEFAULT_SETTINGS));
      settings = { ...DEFAULT_SETTINGS, ...result };
    } catch (error) {
      console.error('[Netflix Skipper] Failed to load settings:', error);
      settings = { ...DEFAULT_SETTINGS };
    } finally {
      settingsLoaded = true;
      scanExistingControls();
      ensureQuickSettingsMounted();
    }
  }

  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;

    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (changes[key]) {
        settings[key] = changes[key].newValue ?? DEFAULT_SETTINGS[key];
      }
    }

    syncQuickSettingsControls();

    // If a feature is enabled while its control is already visible, react once.
    scanExistingControls();
  });

  browser.runtime.onMessage.addListener((request) => {
    if (!request) return undefined;

    const makeStatus = () => ({
      platform: 'netflix',
      active: isWatchPage(),
      stats: { ...sessionStats },
      quickSettingsMounted: Boolean(quickSettingsHost?.isConnected),
      quickSettingsPlacement: quickSettingsHost?.getAttribute('data-placement') || null,
      version: browser.runtime.getManifest().version
    });

    if (request.type === 'netflixSkipper:getStatus' || request.type === 'unified:getPlatformStatus') {
      return Promise.resolve(makeStatus());
    }

    return undefined;
  });

  document.addEventListener('pointerdown', (event) => {
    if (!quickSettingsPanelOpen || !quickSettingsHost) return;
    if (!event.composedPath().includes(quickSettingsHost)) {
      setQuickSettingsOpen(false);
    }
  }, true);

  const observer = new MutationObserver(handleMutations);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener('popstate', handleNavigationChange, { passive: true });
  window.addEventListener('pageshow', handleNavigationChange, { passive: true });
  document.addEventListener('fullscreenchange', () => {
    if (isWatchPage()) ensureQuickSettingsMounted();
  }, { passive: true });

  loadSettings();
})();
