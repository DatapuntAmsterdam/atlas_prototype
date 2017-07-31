'use strict';

module.exports = toggleViewButtonElement => ({
    click: toggleViewButtonElement.element(by.css('button')).click
});
