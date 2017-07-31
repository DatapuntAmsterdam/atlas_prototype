'use strict';

module.exports = embedHeaderElement => ({
    get visible () {
        return dp.visible(embedHeaderElement);
    },

    get inputLink () {
        return inputPageObject(embedHeaderElement.element(by.css('.qa-embed-header-form-link')));
    },

    get inputHtml () {
        return inputPageObject(embedHeaderElement.element(by.css('.qa-embed-header-form-html')));
    }
});

function inputPageObject (inputItem) {
    return {
        get label () {
            return inputItem.element(by.css('.qa-embed-header-form-label')).getText();
        },
        get value () {
            return inputItem.element(by.css('.qa-embed-header-form-input')).getAttribute('value');
        }
    };
}
