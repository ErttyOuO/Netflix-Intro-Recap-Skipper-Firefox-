// Netflix Skipper Popup Settings Controller - v1.2.1

const DEFAULT_SETTINGS = Object.freeze({
  skipIntro: true,
  skipRecap: true,
  skipNextEpisode: true,
  dismissStillWatching: false,
  showToast: true
});

const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS);

document.addEventListener('DOMContentLoaded', async () => {
  applyI18n();
  renderVersion();
  bindToggleEvents();
  await loadSettings();
  await loadStatus();
});

function applyI18n() {
  const uiLanguage = browser.i18n.getUILanguage();
  if (uiLanguage) {
    document.documentElement.lang = uiLanguage;
  }

  for (const element of document.querySelectorAll('[data-i18n]')) {
    const key = element.dataset.i18n;
    const message = browser.i18n.getMessage(key);
    if (message) element.textContent = message;
  }

  for (const element of document.querySelectorAll('[data-i18n-aria-label]')) {
    const key = element.dataset.i18nAriaLabel;
    const message = browser.i18n.getMessage(key);
    if (message) element.setAttribute('aria-label', message);
  }
}

function renderVersion() {
  const versionText = document.getElementById('versionText');
  if (!versionText) return;

  versionText.textContent = `v${browser.runtime.getManifest().version}`;
}

async function loadSettings() {
  try {
    const result = await browser.storage.local.get(SETTINGS_KEYS);

    for (const key of SETTINGS_KEYS) {
      const checkbox = document.getElementById(key);
      if (checkbox) {
        checkbox.checked = result[key] ?? DEFAULT_SETTINGS[key];
      }
    }
  } catch (error) {
    console.error('[Netflix Skipper Popup] Failed to load settings:', error);
  }
}

function bindToggleEvents() {
  for (const key of SETTINGS_KEYS) {
    const checkbox = document.getElementById(key);
    if (!checkbox) continue;

    checkbox.addEventListener('change', async (event) => {
      await saveSetting(key, event.target.checked);
    });
  }
}

async function saveSetting(key, value) {
  try {
    await browser.storage.local.set({ [key]: value });

    const checkbox = document.getElementById(key);
    const settingItem = checkbox?.closest('.setting-item');
    if (settingItem) {
      settingItem.classList.add('saved');
      window.setTimeout(() => settingItem.classList.remove('saved'), 300);
    }
  } catch (error) {
    console.error(`[Netflix Skipper Popup] Failed to save ${key}:`, error);
  }
}

async function loadStatus() {
  const statusText = document.getElementById('statusText');
  const statusDot = document.getElementById('statusDot');
  const sessionCount = document.getElementById('sessionCount');

  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('No active tab');

    const response = await browser.tabs.sendMessage(tab.id, {
      type: 'netflixSkipper:getStatus'
    });

    if (response?.active) {
      statusText.textContent = browser.i18n.getMessage('status_active');
      statusDot.classList.add('active');

      const stats = response.stats || {};
      const total = Object.values(stats).reduce((sum, value) => sum + Number(value || 0), 0);
      sessionCount.textContent = browser.i18n.getMessage('session_count', String(total));
      return;
    }

    statusText.textContent = browser.i18n.getMessage('status_inactive');
    sessionCount.textContent = browser.i18n.getMessage('session_count', '0');
  } catch (_error) {
    statusText.textContent = browser.i18n.getMessage('status_unavailable');
    sessionCount.textContent = '';
  }
}
