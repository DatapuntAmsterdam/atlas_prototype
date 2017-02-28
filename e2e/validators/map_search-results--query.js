'use strict';

const mapSearchResults = require('./map_search-results');

module.exports = function (page) {
    expect(page.title).toMatch(/\d+ resultaten met \"\w+\" - Atlas$/);

    mapSearchResults(page);
};
