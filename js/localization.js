$(document).ready(function () {

    function getUserLanguage() {
        return navigator.language || navigator.userLanguage;
    }

    // console.log("This is a LOCALISATION");

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

    const userLanguage = getUserLanguage();
    localize(userLanguage);

})
;