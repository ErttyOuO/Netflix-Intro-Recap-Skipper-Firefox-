// Netflix Skipper Background Script

// Initialize default settings on install
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get(['skipIntro', 'skipRecap', 'skipNextEpisode']).then((result) => {
    const defaults = {
      skipIntro: result.skipIntro !== undefined ? result.skipIntro : true,
      skipRecap: result.skipRecap !== undefined ? result.skipRecap : true,
      skipNextEpisode: result.skipNextEpisode !== undefined ? result.skipNextEpisode : true
    };
    browser.storage.local.set(defaults);
    console.log('[Netflix Skipper] Default settings initialized:', defaults);
  });
});

// Handle messages from popup or content scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received request: ", request);
  if (request.greeting === "hello") {
    return Promise.resolve({ farewell: "goodbye" });
  }
});
