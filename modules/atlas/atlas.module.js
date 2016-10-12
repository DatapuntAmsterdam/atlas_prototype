(function () {
    'use strict';

    angular
        .module('atlas', [
            // Atlas modules
            'atlasHeader',
            'atlasPage',
            'atlasDetail',
            'atlasSearchResults',
            'atlasLayerSelection',
            'dpMap',
            'dpStraatbeeld',
            'dpDataSelection',
            // Shared modules
            'dpShared',
            // External
            'angulartics',
            'angulartics.piwik'
        ]);
})();
