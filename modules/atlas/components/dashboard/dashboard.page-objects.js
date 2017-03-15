'use strict';

const headerPO = dp.require('modules/header/components/header/header.page-objects');

const dataSelectionPO = dp.require('modules/data-selection/components/data-selection/data-selection.page-objects');
const detailPO = dp.require('modules/detail/components/detail/detail.page-objects');
const layerSelectionPO = dp.require('modules/layer-selection/components/layer-selection/layer-selection.page-objects');
const mapPO = dp.require('modules/map/components/map/map.page-objects');
const pagePO = dp.require('modules/page/components/page/page.page-objects');
const searchResultsPO = dp.require('modules/search-results/components/search-results/search-results.page-objects');
const straatbeeldPO = dp.require('modules/straatbeeld/components/straatbeeld/straatbeeld.page-objects');

module.exports = function (dashboardElement) {
    return {
        header: headerPO(dashboardElement.element(by.css('dp-header'))),
        leftColumn: getColumn('left'),
        middleColumn: getColumn('middle'),
        rightColumn: getColumn('right')
    };

    function getColumn (position) {
        const column = dashboardElement.element(by.css('.qa-dashboard__column--' + position));

        return {
            dataSelection: dataSelectionPO(column.element(by.css('.qa-data-selection'))),
            detail: detailPO(column.element(by.css('.qa-detail'))),
            layerSelection: layerSelectionPO(column.element(by.css('.qa-layer-selection'))),
            map: mapPO(column.element(by.css('.qa-map'))),
            page: pagePO(column.element(by.css('.qa-page'))),
            searchResults: searchResultsPO(column.element(by.css('.qa-search-results'))),
            straatbeeld: straatbeeldPO(column.element(by.css('.qa-straatbeeld'))),
            get columnSize () {
                return column.getAttribute('class').then(
                    className => Number(className.replace(/.*u-col-sm--(\d+).*/, '$1'))
                );
            }
        };
    }
};
