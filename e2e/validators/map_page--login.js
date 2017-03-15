'use strict';

const mapPage = require('./map_page');

module.exports = function (page) {
    expect(page.title).toBe('Inloggen - Atlas');

    mapPage(page);
};
