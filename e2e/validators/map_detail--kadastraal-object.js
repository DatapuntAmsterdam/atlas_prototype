'use strict';

const mapDetailValidator = require('./map_detail');

module.exports = function (page) {
    expect(page.title).toMatch(/^Kadastraal object: (.*) - Atlas$/);

    mapDetailValidator(page);
};
