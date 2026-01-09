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

// Skip button definitions - only using verified, specific selectors
const targets = [
  {
    key: 'skipIntro',
    selector: 'button[data-uia="player-skip-intro"]',
    message: '已略過開場！🍿'
  },
  {
    key: 'skipRecap',
    selector: 'button[data-uia="player-skip-recap"]',
    message: '已略過前情提要！🕵️‍♂️'
  },
  // Next Episode button - appears during end credits countdown
  {
    key: 'skipNextEpisode',
    selector: 'button[data-uia="next-episode-seamless-button"]',
    message: '已自動播放下一集！📺'
  }
];

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

const skipButtons = () => {
  targets.forEach(({ key, selector, message }) => {
    // Check if this feature is enabled
    if (!settings[key]) return;

    // Skip if this button type was recently clicked
    if (recentlyClicked.has(key)) return;

    const btn = document.querySelector(selector);
    // Only click if button exists AND is visible
    if (btn && isVisible(btn)) {
      btn.click();
      console.log(`[Netflix Skipper] ⏩ Clicked: ${selector}`);
      showToast(message);

      // Prevent duplicate clicks for this button TYPE for 5 seconds
      recentlyClicked.add(key);
      setTimeout(() => recentlyClicked.delete(key), 5000);
    }
  });
};

// Run check periodically and on DOM changes
setInterval(skipButtons, 1000);
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
