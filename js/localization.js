$(document).ready(function () {

    // ========================================
    // LANGUAGE DETECTION & PREFERENCE
    // ========================================

    // localStorage key for saving user's language choice
    // NOTE: This is separate from 'nightModePreference' which is used by night-mode.js
    const LANGUAGE_PREFERENCE_KEY = 'languagePreference';

    // Read language from URL query parameter (?lang=ro)
    // Returns the language code if present in URL, null otherwise
    // Example: welcome.html?lang=ro returns "ro"
    function getLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang'); // Returns null if not present
    }

    // Detects the user's browser language (e.g., "en-US", "uk-UA", "ro-RO")
    function getUserLanguage() {
        return navigator.language || navigator.userLanguage;
    }

    // Save user's language preference to localStorage
    // This allows the language choice to persist across page refreshes
    function saveLanguagePreference(language) {
        localStorage.setItem(LANGUAGE_PREFERENCE_KEY, language);
    }

    // Load user's saved language preference from localStorage
    // Returns null if no preference has been saved yet
    function loadLanguagePreference() {
        return localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    }

    // console.log("This is a LOCALISATION");

    // ========================================
    // LOCALIZATION FUNCTION
    // ========================================

    // Loads translation file and applies translations to all elements with data-localize attribute
    function localize(language) {

        const languageCode = language.split('-')[0];
        const localizationFile = `assets/${languageCode}/localization.json`;

        fetch(localizationFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Localization file not found: ${localizationFile}`);
                }
                return response.json();
            })
            .then(data => {

                    document.querySelectorAll('[data-localize]').forEach(element => {
                        const key = element.dataset.localize;

                        if (!data[key]) {
                            console.log(`Unknown localization key: ${key}`);
                            return;
                        }

                        // if (key === 'contact-form-company') {
                        //     debugger
                        // }

                        const rules = {
                            '_default': function (element, text) {
                                // console.log({
                                //     "key": key,
                                //     "original": element.textContent,
                                //     "updatedText": text
                                // });
                                element.textContent = text;
                            },
                            'img': function (element, text) {
                                // console.log({
                                //     "key": key,
                                //     "original": element.alt,
                                //     "updatedAlt": text
                                // });
                                element.alt = text;
                            },
                            'input': function (element, text) {
                                // console.log({
                                //     "key": key,
                                //     "original": element.value,
                                //     "updatedInput": text
                                // });
                                element.placeholder = text;
                            },
                            'textarea': function (element, text) {
                                // console.log({
                                //     "key": key,
                                //     "original": element.value,
                                //     "updatedInput": text
                                // });
                                element.placeholder = text;
                            }
                            };

                        (rules[element.tagName.toLowerCase()] || rules['_default'])(element, data[key]);
                    });
                }
            )
            .catch(error => console.error('Localization error:', error));
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    // Determine which language to use based on priority:
    // Priority 1: URL parameter (?lang=ro) - highest, allows shareable links
    // Priority 2: localStorage - user's saved preference
    // Priority 3: Browser language - automatic detection for first-time visitors

    const urlLanguage = getLanguageFromURL();           // Check URL first
    const savedLanguage = loadLanguagePreference();     // Then localStorage
    const browserLanguage = getUserLanguage();          // Finally browser

    // Use the first available language source
    const userLanguage = urlLanguage || savedLanguage || browserLanguage;

    // Apply localization with the selected language
    localize(userLanguage);

    // Extract just the language code (e.g., "en" from "en-US")
    const languageCode = userLanguage.split('-')[0];

    // IMPORTANT: Always ensure URL reflects current language
    // This makes ALL URLs shareable, not just when user manually selects language
    // If URL doesn't have ?lang= parameter, add it now
    if (!urlLanguage) {
        // Use replaceState (not pushState) so we don't create extra history entry
        // replaceState modifies current history entry instead of adding new one
        const currentUrl = `${window.location.pathname}?lang=${languageCode}`;
        window.history.replaceState({}, '', currentUrl);
        console.log('URL updated to reflect language:', languageCode);
    }

    // Helper function to get language display name
    function getLanguageName(langCode) {
        const languageNames = {
            'en': 'English',
            'ro': 'Română',
            'ua': 'Українська'
        };
        return languageNames[langCode] || 'English';
    }

    // Helper function to update dropdown trigger text
    function updateLanguageDropdown(langCode) {
        const displayName = getLanguageName(langCode);
        $('#language-toggle').text(displayName + ' ▼');
    }

    // Wait for footer to load, then set the dropdown AND re-localize footer
    // IMPORTANT: Footer loads asynchronously via footer.js
    // When it loads, it inserts HTML with English fallback text
    // We need to re-run localization to translate the footer content
    const checkFooterLoaded = setInterval(function() {
        const dropdownToggle = $('#language-toggle');
        if (dropdownToggle.length > 0) {
            // Footer is now in DOM
            updateLanguageDropdown(languageCode);

            // Re-run localization to translate footer elements
            // This catches all the data-localize elements in the footer
            localize(languageCode);

            clearInterval(checkFooterLoaded); // Stop checking once found
            console.log('Footer loaded and localized');
        }
    }, 100); // Check every 100ms

    // ========================================
    // CUSTOM DROPDOWN EVENT HANDLERS
    // ========================================

    // Toggle dropdown visibility when clicking the trigger
    // IMPORTANT: Using EVENT DELEGATION because dropdown is loaded dynamically
    $(document).on('click', '#language-toggle', function(e) {
        e.preventDefault();
        $('#language-menu').toggleClass('active');
    });

    // Handle language selection from dropdown menu
    $(document).on('click', '#language-menu a', function(e) {
        e.preventDefault();
        const selectedLanguage = $(this).data('lang'); // Get data-lang value (e.g., "en", "ro", "ua")

        // Update dropdown trigger text
        updateLanguageDropdown(selectedLanguage);

        // Hide dropdown menu
        $('#language-menu').removeClass('active');

        // Save the user's choice so it persists across page refreshes
        saveLanguagePreference(selectedLanguage);

        // Apply new language translations immediately
        localize(selectedLanguage);

        // Update URL to reflect current language
        // This makes the URL shareable - sending welcome.html?lang=ro to someone
        // will open the page in Romanian for them
        // pushState adds new history entry, so back button works correctly
        const newUrl = `${window.location.pathname}?lang=${selectedLanguage}`;
        window.history.pushState({}, '', newUrl);

        console.log('Language changed to:', selectedLanguage);
    });

    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.language-dropdown').length) {
            $('#language-menu').removeClass('active');
        }
    });

    // Close dropdown when pressing Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('#language-menu').removeClass('active');
        }
    });

    // ========================================
    // BROWSER NAVIGATION (BACK/FORWARD BUTTONS)
    // ========================================

    // Listen for back/forward button clicks
    // When user clicks back/forward, the URL changes but page doesn't reload
    // We need to detect this and update the language accordingly
    window.addEventListener('popstate', function() {
        const urlLanguage = getLanguageFromURL();

        if (urlLanguage) {
            // URL has ?lang=X parameter, apply that language
            localize(urlLanguage);

            // Update the dropdown trigger to match
            const checkDropdown = setInterval(function() {
                const dropdownToggle = $('#language-toggle');
                if (dropdownToggle.length > 0) {
                    updateLanguageDropdown(urlLanguage);
                    clearInterval(checkDropdown);
                }
            }, 100);

            console.log('Browser navigation: Language changed to', urlLanguage);
        }
    });

})
;