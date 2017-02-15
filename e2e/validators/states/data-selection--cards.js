'use strict';

const dataSelectionValidator = require('./data-selection');
const pageCheck = require('./../../helpers/page-check');

module.exports = function (page, expected) {
    pageCheck({
        title: page.title,
        headerTitle: page.dashboard.rightColumn.dataSelection.header.title,
        availableFilterVisible: page.dashboard.rightColumn.dataSelection.availableFilters.visible,
        categories0Header: page.dashboard.rightColumn.dataSelection.availableFilters.categories(0).header
    }, expected);

    dataSelectionValidator(page);
};
