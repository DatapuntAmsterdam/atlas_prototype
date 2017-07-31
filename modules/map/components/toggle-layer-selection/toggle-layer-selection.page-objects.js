'use strict';

module.exports = layerSelectionElement => ({
    click: layerSelectionElement.element(by.css('button')).click
});
