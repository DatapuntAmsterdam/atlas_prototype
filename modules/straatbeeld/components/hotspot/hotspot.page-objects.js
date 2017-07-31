'use strict';

module.exports = hotspotElement => ({
    click: function () {
        browser.executeScript('arguments[0].click();', hotspotElement.element(by.css('button')));
    }
});
