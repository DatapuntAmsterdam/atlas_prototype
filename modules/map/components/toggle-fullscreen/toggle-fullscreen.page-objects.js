'use strict';

module.exports = function (toggleFullscreenElement) {
    return function () {
        return {
            click: function () {
                toggleFullscreenElement.element(by.css('button')).click();
            },
            text: function () {
                toggleFullscreenElement.element(by.css('button')).getAttribute('title');
            }
        };
    };
};
