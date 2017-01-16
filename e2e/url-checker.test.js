'use strict';

const navigate = require('./helpers/navigate');
const validateMapPageHome = require('./validators/map_page--home');

describe('each URL should load the corresponding view', function () {
    let page;

    it('MAP_PAGE--HOME', function () {
        page = navigate('MAP_PAGE--HOME');

        validateMapPageHome(page);
    });
});
