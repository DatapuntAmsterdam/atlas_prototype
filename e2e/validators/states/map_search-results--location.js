'use strict';

const mapSearchResults = require('./map_search-results');

module.exports = function (page) {
    const searchResults = page.dashboard.rightColumn.searchResults;

    expect(page.title)
        .toMatch(/^\d+ resultaten met locatie \d+\.\d+, \d+\.\d+ \(\d+\.\d+, \d+\.\d+\) - Atlas$/);

    mapSearchResults(page);
};
