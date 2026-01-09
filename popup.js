// Netflix Skipper Popup Settings Controller

const SETTINGS_KEYS = ['skipIntro', 'skipRecap', 'skipNextEpisode'];

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    bindToggleEvents();
});

// Load settings from storage and update UI
async function loadSettings() {
    try {
        const result = await browser.storage.local.get(SETTINGS_KEYS);

        SETTINGS_KEYS.forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                // Default to true if not set
                checkbox.checked = result[key] !== undefined ? result[key] : true;
            }
        });

        console.log('[Netflix Skipper Popup] Settings loaded:', result);
    } catch (error) {
        console.error('[Netflix Skipper Popup] Error loading settings:', error);
    }
}

// Bind change events to toggle switches
function bindToggleEvents() {
    SETTINGS_KEYS.forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
            checkbox.addEventListener('change', async (e) => {
                await saveSetting(key, e.target.checked);
            });
        }
    });
}

// Save individual setting
async function saveSetting(key, value) {
    try {
        await browser.storage.local.set({ [key]: value });
        console.log(`[Netflix Skipper Popup] Setting saved: ${key} = ${value}`);

        // Visual feedback - briefly highlight the toggle
        const settingItem = document.getElementById(key).closest('.setting-item');
        if (settingItem) {
            settingItem.style.background = value ? 'rgba(229, 9, 20, 0.1)' : 'rgba(85, 85, 85, 0.2)';
            setTimeout(() => {
                settingItem.style.background = '';
            }, 300);
        }
    } catch (error) {
        console.error(`[Netflix Skipper Popup] Error saving setting ${key}:`, error);
    }
}
