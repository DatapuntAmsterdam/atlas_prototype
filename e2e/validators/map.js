'use strict';

module.exports = function (page) {
    expect(page.title()).toBe('Grote kaart - Atlas');

    expect(page.dashboard().middleColumn().columnSize()).toBe(12);
    expect(page.dashboard().middleColumn().map().isVisible()).toBe(true);
};
