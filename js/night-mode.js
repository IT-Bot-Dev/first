
const nightModeToggleButton$ = jQuery('#nightModeToggleButton')

const NIGHT_MODE_KEY = 'nightModePreference';

function applyNightMode(isNightMode) {
    if (isNightMode) {
        jQuery('body').addClass('night-mode');
    } else {
        jQuery('body').removeClass('night-mode');
    }
}

function saveNightModePreference(isNightMode) {
    localStorage.setItem(NIGHT_MODE_KEY, isNightMode ? 'dark' : 'light');
}

function loadNightModePreference() {
    return localStorage.getItem(NIGHT_MODE_KEY);
}

jQuery(document).ready(function() {
    const savedPreference = loadNightModePreference();
    const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedPreference !== null) {
        // User has a saved preference - use it
        applyNightMode(savedPreference === 'dark');
    } else {
        // No saved preference - use system
        applyNightMode(isSystemDarkMode);
    }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    localStorage.removeItem(NIGHT_MODE_KEY);  // Clear saved preference - sync back to system
    applyNightMode(event.matches);
});

jQuery(document).on('click', '#nightModeToggleButton', () => {
    const isNightMode = jQuery('body').hasClass('night-mode');
    const newMode = !isNightMode;
    applyNightMode(newMode);
    saveNightModePreference(newMode);
    console.log('nightModeToggleButton clicked!');
});


