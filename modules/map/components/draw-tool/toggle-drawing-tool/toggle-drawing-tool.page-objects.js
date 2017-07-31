'use strict';

module.exports = toggleDrawingToolElement => ({
    click: toggleDrawingToolElement.element(by.css('button')).click,
    text: toggleDrawingToolElement.element(by.css('button')).getText
});
