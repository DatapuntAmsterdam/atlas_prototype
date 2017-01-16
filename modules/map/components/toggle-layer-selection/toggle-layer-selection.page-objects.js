'use strict';

module.exports = function (layerSelectionElement) {
    return function () {
        return {
            click: function () {
                layerSelectionElement.element(by.css('button')).click();
            }
        };
    };
};
