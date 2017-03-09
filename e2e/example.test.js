'use strict';

describe('The basic application navigation', function () {
    let page;

    it('allows to navigate from home to layerSelection and back', function () {
        page = dp.navigate('MAP_PAGE--HOME', 'EMPLOYEE');
        dp.validate('MAP_PAGE--HOME', page);

        // Open layer selection
        page.dashboard.middleColumn.map.toggleLayerSelection.click();
        dp.validate('LAYER-SELECTION_MAP', page);

        // Close layer selection by clicking the toggle button
        page.dashboard.middleColumn.map.toggleLayerSelection.click();
        dp.validate('MAP_PAGE--HOME', page);

        // Open it again
        page.dashboard.middleColumn.map.toggleLayerSelection.click();
        dp.validate('LAYER-SELECTION_MAP', page);

        // Close it by the cross inside the layer selection module (instead of the toggle button)
        page.dashboard.leftColumn.layerSelection.close();
        dp.validate('MAP_PAGE--HOME', page);
    });

    it('allows to navigate from home to the (possibly fullscreen) map', function () {
        page = dp.navigate('MAP_PAGE--HOME');
        dp.validate('MAP_PAGE--HOME', page);

        // Make the map fullscreen
        page.dashboard.middleColumn.map.toggleFullscreen.click();
        dp.validate('MAP', page);

        // Make the map small again
        page.dashboard.middleColumn.map.toggleFullscreen.click();
        dp.validate('MAP_PAGE--HOME', page);
    });
});
