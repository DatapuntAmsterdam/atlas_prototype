'use strict';

module.exports = function (page) {
    expect(page.title()).toBe('Selecteer kaartlagen - Atlas');

    expect(page.dashboard().leftColumn().columnSize()).toBe(4);
    expect(page.dashboard().leftColumn().layerSelection().isVisible()).toBe(true);

    expect(page.dashboard().middleColumn().columnSize()).toBe(8);
    expect(page.dashboard().middleColumn().map().isVisible()).toBe(true);
};
