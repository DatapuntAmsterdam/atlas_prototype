'use strict';

const navigate = require('./helpers/navigate');

const validateHomepage = require('./validators/map_page--home');
const validateLayerSelection = require('./validators/layer-selection_map');
const validateMapFullscreen = require('./validators/map');

describe('Even lekker testen', function () {
    let page;

    it('navigate from home to layer selection', function () {
        page = navigate('MAP_PAGE--HOME');
        validateHomepage(page);

        // Open layer selection
        page.dashboard().middleColumn().map().toggleLayerSelection().click();
        validateLayerSelection(page);

        // Close layer selection by clicking the toggle button
        page.dashboard().middleColumn().map().toggleLayerSelection().click();
        validateHomepage(page);

        // Open it again
        page.dashboard().middleColumn().map().toggleLayerSelection().click();
        validateLayerSelection(page);

        // Close it by the cross inside the layer selection module (instead of the toggle button)
        page.dashboard().leftColumn().layerSelection().close();
        validateHomepage(page);
    });

    it('make the map fullscreen from the homepage', function () {
        page = navigate('MAP_PAGE--HOME');
        validateHomepage(page);

        // Make the map fullscreen
        page.dashboard().middleColumn().map().toggleFullscreen().click();
        validateMapFullscreen(page);

        // Make the map small again
        page.dashboard().middleColumn().map().toggleFullscreen().click();
        validateHomepage(page);
    });
});
