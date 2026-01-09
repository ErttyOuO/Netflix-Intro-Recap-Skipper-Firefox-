// Netflix Intro, Recap & Next Episode Auto-Skipper
// Settings with defaults
let settings = {
  skipIntro: true,
  skipRecap: true,
  skipNextEpisode: true
};

// Load settings from storage
browser.storage.local.get(['skipIntro', 'skipRecap', 'skipNextEpisode']).then((result) => {
  settings.skipIntro = result.skipIntro !== undefined ? result.skipIntro : true;
  settings.skipRecap = result.skipRecap !== undefined ? result.skipRecap : true;
  settings.skipNextEpisode = result.skipNextEpisode !== undefined ? result.skipNextEpisode : true;
  console.log('[Netflix Skipper] Settings loaded:', settings);
});

// Listen for settings changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    if (changes.skipIntro !== undefined) {
      settings.skipIntro = changes.skipIntro.newValue;
    }
    if (changes.skipRecap !== undefined) {
      settings.skipRecap = changes.skipRecap.newValue;
    }
    if (changes.skipNextEpisode !== undefined) {
      settings.skipNextEpisode = changes.skipNextEpisode.newValue;
    }
    console.log('[Netflix Skipper] Settings updated:', settings);
  }
});

// Track recently clicked button types to avoid duplicate clicks
const recentlyClicked = new Set();

// Check if element is visible and clickable
function isVisible(elem) {
  if (!elem) return false;
  const style = window.getComputedStyle(elem);
  return style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    elem.offsetParent !== null;
}

// Find button by selector
function findButtonBySelector(selector) {
  return document.querySelector(selector);
}

// Find "Next Episode" button by looking for buttons with matching text
function findNextEpisodeButton() {
  // First try the standard data-uia selectors
  const selectors = [
    'button[data-uia="next-episode-seamless-button"]',
    'button[data-uia="next-episode-seamless-button-draining"]',
    '[data-uia="next-episode-seamless-button"]',
    '[data-uia="next-episode-seamless-button-draining"]'
  ];

  for (const selector of selectors) {
    const btn = document.querySelector(selector);
    if (btn && isVisible(btn)) return btn;
  }

  // If not found, search for button containing "下一集" or "Next Episode" text
  // Look in the post-play area (credits screen)
  const postPlayContainer = document.querySelector('.watch-video--evidence-overlay, .PostPlay, [data-uia="watch-video-evidence"]');
  if (postPlayContainer) {
    const buttons = postPlayContainer.querySelectorAll('button');
    for (const btn of buttons) {
      const text = btn.textContent || btn.innerText || '';
      if ((text.includes('下一集') || text.toLowerCase().includes('next episode')) && isVisible(btn)) {
        return btn;
      }
    }
  }

  return null;
}

// Skip button definitions
const buttonConfig = {
  skipIntro: {
    message: '已略過開場！🍿',
    find: () => findButtonBySelector('button[data-uia="player-skip-intro"]')
  },
  skipRecap: {
    message: '已略過前情提要！🕵️‍♂️',
    find: () => findButtonBySelector('button[data-uia="player-skip-recap"]')
  },
  skipNextEpisode: {
    message: '已自動播放下一集！📺',
    find: findNextEpisodeButton
  }
};

const skipButtons = () => {
  Object.entries(buttonConfig).forEach(([key, config]) => {
    // Check if this feature is enabled
    if (!settings[key]) return;

    // Skip if this button type was recently clicked
    if (recentlyClicked.has(key)) return;

    const btn = config.find();
    // Only click if button exists AND is visible
    if (btn && isVisible(btn)) {
      btn.click();
      console.log(`[Netflix Skipper] ⏩ Clicked: ${key}`);
      showToast(config.message);

      // Prevent duplicate clicks for this button TYPE for 5 seconds
      recentlyClicked.add(key);
      setTimeout(() => recentlyClicked.delete(key), 5000);
    }
  });
};

// Run check periodically and on DOM changes
setInterval(skipButtons, 500); // Check every 500ms for faster response
const observer = new MutationObserver(skipButtons);
observer.observe(document.body, { childList: true, subtree: true });

// Toast notification function
function showToast(text) {
  const backgroundColor = "#E50914"; // Netflix red
  const playerContainer = document.querySelector('.watch-video');
  Toastify({
    text,
    selector: playerContainer,
    position: "center",
    duration: 2000,
    style: {
      background: backgroundColor,
      borderRadius: "4px",
      fontWeight: "600"
    },
  }).showToast();
}
