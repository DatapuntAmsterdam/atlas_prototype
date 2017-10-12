(function () {
    'use strict';

    const moduleDependencies = [
        // Main modules
        'dpHeader',
        'dpPage',
        'dpDetail',
        'dpSearchResults',
        'dpMap',
        'dpStraatbeeld',
        'dpDataSelection',

        // Shared module
        'dpShared',

        // Third party modules
        'angulartics.piwik'
    ];

    /* eslint-disable angular/window-service */
    const Raven = window.Raven;

    const ravenConfig = {
        environment: window.location.hostname
    };

    if (window.location.hostname !== 'data.amsterdam.nl') {
        ravenConfig.debug = true;
        ravenConfig.transport = (options) => {
            window.console.info('Raven has been called with the following data: ', options.data);
        };
    }
    /* eslint-enable angular/window-service */

    // Configure Raven (client library for Sentry) and register the ngRaven
    // angular plugin with it. This needs to be done here first, so the atlas
    // module can include ngRaven
    if (Raven) {
        Raven
            .config('https://e787d53c011243b59ae368a912ee6d3f@sentry.datapunt.amsterdam.nl/2', ravenConfig)
            .addPlugin(Raven.Plugins.Angular)
            .install();
        moduleDependencies.push('ngRaven');
    }

    angular.module('atlas', moduleDependencies);
})();
