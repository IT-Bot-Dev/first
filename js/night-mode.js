
const nightModeToggleButton$ = jQuery('#nightModeToggleButton')

// localStorage key for saving user preference
const NIGHT_MODE_KEY = 'nightModePreference';

// Function to apply or remove night-mode class
function applyNightMode(isNightMode) {
    if (isNightMode) {
        jQuery('body').addClass('night-mode');
    } else {
        jQuery('body').removeClass('night-mode');
    }
}

// Save user's night mode preference to localStorage
function saveNightModePreference(isNightMode) {
    localStorage.setItem(NIGHT_MODE_KEY, isNightMode ? 'dark' : 'light');
}

// Load user's night mode preference from localStorage
function loadNightModePreference() {
    return localStorage.getItem(NIGHT_MODE_KEY);
}

// Initialize night mode based on saved preference or system preference
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

// Listen for changes in the system dark mode setting
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    localStorage.removeItem(NIGHT_MODE_KEY);  // Clear saved preference - sync back to system
    applyNightMode(event.matches);
});


// Toggle night mode on button click

jQuery(document).on('click', '#nightModeToggleButton', () => {
    const isNightMode = jQuery('body').hasClass('night-mode');
    const newMode = !isNightMode;
    applyNightMode(newMode);
    saveNightModePreference(newMode);
    console.log('nightModeToggleButton clicked!');
});


