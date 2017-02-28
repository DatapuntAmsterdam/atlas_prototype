'use strict';

module.exports = function (page) {
    expect(page.title).toBe('Grote kaart - Atlas');

    expect(page.dashboard.leftColumn.columnSize).toBe(0);

    expect(page.dashboard.middleColumn.columnSize).toBe(12);
    expect(page.dashboard.middleColumn.map.visible).toBe(true);

    expect(page.dashboard.rightColumn.columnSize).toBe(0);
};
