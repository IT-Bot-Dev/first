
const nightModeToggleButton$ = jQuery('#nightModeToggleButton')

// Function to apply or remove night-mode class
function applyNightMode(isNightMode) {
    if (isNightMode) {
        jQuery('body').addClass('night-mode');
    } else {
        jQuery('body').removeClass('night-mode');
    }
}

// Detect initial system dark mode setting
const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyNightMode(isSystemDarkMode);

// Listen for changes in the system dark mode setting
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    applyNightMode(event.matches);
});


// Toggle night mode on button click

jQuery(document).on('click', '#nightModeToggleButton', () => {
    const isNightMode = jQuery('body').hasClass('night-mode'); // what exactly ?? jQuery('body').toggleClass('night-mode')
    applyNightMode(!isNightMode);
    console.log('nightModeToggleButton clicked!');
});


