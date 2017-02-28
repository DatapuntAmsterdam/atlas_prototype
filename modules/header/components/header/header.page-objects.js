'use strict';

const searchPO = dp.require('modules/header/components/search/search.page-objects');

module.exports = function (headerElement) {
    return {
        get search () {
            return searchPO(headerElement.element(by.css('dp-search')));
        }
    };
};
