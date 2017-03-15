'use strict';

module.exports = function (page) {
    expect(page.dashboard.leftColumn.columnSize).toBe(0);

    expect(page.dashboard.middleColumn.columnSize).toBe(0);

    expect(page.dashboard.rightColumn.columnSize).toBe(12);
    expect(page.dashboard.rightColumn.dataSelection.visible).toBe(true);
};
