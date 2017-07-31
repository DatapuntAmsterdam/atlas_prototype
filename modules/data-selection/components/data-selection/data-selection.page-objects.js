'use strict';

const dataSelectionHeader = dp.require('modules/data-selection/components/header/header.page-objects');
const availableFilters =
    dp.require('modules/data-selection/components/available-filters/available-filters.page-objects');

module.exports = dataSelectionElement => ({
    get visible () {
        return dp.visible(dataSelectionElement);
    },

    get header () {
        return dataSelectionHeader(dataSelectionElement.element(by.css('dp-data-selection-header')));
    },

    get availableFilters () {
        return availableFilters(dataSelectionElement.element(by.css('dp-data-selection-available-filters')));
    }
});
