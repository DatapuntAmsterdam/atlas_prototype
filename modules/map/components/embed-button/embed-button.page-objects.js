'use strict';

module.exports = embedButtonElement => ({
    click: embedButtonElement.element(by.css('.qa-embed-button')).click,

    get link () {
        return embedButtonElement.element(by.css('.qa-embed-button')).getAttribute('href');
    },

    get text () {
        return embedButtonElement.element(by.css('.qa-embed-button')).getText();
    }
});
