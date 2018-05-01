import { getEnvironment, ENVIRONMENT } from '../../src/shared/environment';

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
        'angulartics.piwik',
        'ngRaven',

        'ngAria'
    ];

    /* eslint-disable angular/window-service */
    const Raven = window.Raven;

    const environment = getEnvironment(window.location.hostname);

    const ravenConfig = {
        environment,
        sentryEndpoint: 'https://e787d53c011243b59ae368a912ee6d3f@sentry.datapunt.amsterdam.nl/2'
    };

    /* istanbul ignore next */
    if (environment === ENVIRONMENT.DEVELOPMENT) {
        Raven.setShouldSendCallback(() => false);
        Raven.isSetup = () => true;
    }
    /* eslint-enable angular/window-service */

    // Configure Raven (client library for Sentry) and register the ngRaven
    // angular plugin with it. This needs to be done here first, so the atlas
    // module can include ngRaven

    /* istanbul ignore next */
    if (Raven) {
        Raven
            .config(ravenConfig.sentryEndpoint, ravenConfig)
            .addPlugin(Raven.Plugins.Angular)
            .install();
    }

    angular.module('atlas', moduleDependencies)
        .config(function ($analyticsProvider) {
            $analyticsProvider.virtualPageviews(false);
        });
})();
