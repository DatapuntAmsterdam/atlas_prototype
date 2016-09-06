(function () {
    'use strict';

    angular
        .module('atlas', [
            'atlasHeader',
            'atlasPage',
            'atlasDetail',
            'atlasSearchResults',
            'atlasLayerSelection',
            'dpMap',
            'dpStraatbeeld',
            'dpDataSelection',

            'dpShared'
        ]);
})();