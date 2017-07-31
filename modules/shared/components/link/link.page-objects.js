'use strict';

module.exports = linkElement => ({
    click: linkElement.element(by.css('.qa-dp-link')).click,

    get label () {
        return linkElement.getText();
    }
});
