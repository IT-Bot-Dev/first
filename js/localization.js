$(document).ready(function() {

function getUserLanguage() {
    return navigator.language || navigator.userLanguage;
}

console.log("This is a LOCALISATION");   

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
                if (data[key]) {
                    if (element.tagName.toLowerCase() === 'img') {
                        element.alt = data[key];  // ???
                    } else {
                        element.textContent = data[key];
                    }
                }
            });
        })
        .catch(error => console.error('Localization error:', error));
}

const userLanguage = getUserLanguage();
localize(userLanguage);

});