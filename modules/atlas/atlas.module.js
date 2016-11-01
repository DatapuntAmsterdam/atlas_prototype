(function () {
    'use strict';

    angular
        .module('atlas', [
            // Main modules
            'dpHeader',
            'dpPage',
            'dpDetail',
            'dpSearchResults',
            'dpLayerSelection',
            'dpMap',
            'dpStraatbeeld',
            'dpDataSelection',

            // Shared module
            'dpShared',

            // Third party modules
            'angulartics',
            'angulartics.piwik'
        ]);
})();
