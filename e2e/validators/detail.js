'use strict';

module.exports = function (page) {
    expect(page.title).toBe('Dataset: Activiteiten - Atlas');

    expect(page.dashboard.leftColumn.columnSize).toBe(0);

    expect(page.dashboard.middleColumn.columnSize).toBe(0);

    expect(page.dashboard.rightColumn.columnSize).toBe(12);
    expect(page.dashboard.rightColumn.detail.visible).toBe(true);
};
