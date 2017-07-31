'use strict';

module.exports = toggleFullscreenElement => ({
    click: toggleFullscreenElement.element(by.css('button')).click,

    get text () {
        return toggleFullscreenElement.element(by.css('button')).getAttribute('title');
    }
});
