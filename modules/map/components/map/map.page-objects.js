'use strict';

const toggleLayerSelectionPO =
    dp.require('modules/map/components/toggle-layer-selection/toggle-layer-selection.page-objects');
const toggleFullscreenPO = dp.require('modules/map/components/toggle-fullscreen/toggle-fullscreen.page-objects');
const drawToolPO = dp.require('modules/map/components/draw-tool/draw-tool.page-objects');
const embedButtonPO = dp.require('modules/map/components/embed-button/embed-button.page-objects.js');

module.exports = mapElement => ({
    click: function (x, y) {
        browser.waitForAngular();

        return browser.actions()
            .mouseMove(mapElement, {x: x, y: y})
            .click()
            .perform();
    },

    zoomIn: function () {
        mapElement.element(by.css('.leaflet-control-zoom-in')).click();
    },

    zoomOut: function () {
        mapElement.element(by.css('.leaflet-control-zoom-out')).click();
    },

    get visible () {
        return dp.visible(mapElement);
    },

    get toggleLayerSelection () {
        return toggleLayerSelectionPO(mapElement.element(by.css('dp-toggle-layer-selection')));
    },

    get toggleFullscreen () {
        return toggleFullscreenPO(mapElement.element(by.css('dp-toggle-fullscreen')));
    },

    get drawTool () {
        return drawToolPO(mapElement.element(by.css('dp-draw-tool')));
    },

    get hasGeometry () {
        const hasPoint = mapElement.element(by.css('.leaflet-marker-icon')).isPresent();
        const hasPolygon = mapElement.element(by.css('.leaflet-overlay-pane path.leaflet-interactive')).isPresent();

        return hasPoint || hasPolygon;
    },

    get hasPuntenwolk () {
        return mapElement.all(by.css('.o-highlight-cluster')).count().then(numberOfMarkers => numberOfMarkers > 0);
    },

    get embedButton () {
        return embedButtonPO(mapElement.element(by.css('dp-embed-button')));
    }
});
