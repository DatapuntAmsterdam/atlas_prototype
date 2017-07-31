'use strict';

module.exports = glossaryHeaderElement => ({
    get title () {
        return glossaryHeaderElement.element(by.css('.qa-title')).getText();
    },

    get subtitle () {
        return glossaryHeaderElement.element(by.css('.qa-subtitle')).getText();
    }
});
