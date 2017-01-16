'use strict';

module.exports = function (page) {
    expect(page.dashboard().middleColumn().columnSize()).toBe(4);
    expect(page.dashboard().middleColumn().map().isVisible()).toBe(true);

    expect(page.dashboard().rightColumn().columnSize()).toBe(8);
    expect(page.dashboard().rightColumn().page().isVisible()).toBe(true);
};
