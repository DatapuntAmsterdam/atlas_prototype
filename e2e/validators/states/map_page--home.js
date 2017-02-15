'use strict';

const mapPage = require('./map_page');

module.exports = function (page) {
    expect(page.dashboard.rightColumn.page.text).toContain('Welkom! Atlas');
    expect(page.dashboard.rightColumn.page.text).toContain('Nieuw in Atlas');
    
    mapPage(page);
};
