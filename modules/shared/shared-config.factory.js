(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('sharedConfig', sharedConfigFactory);

    sharedConfigFactory.$inject = ['environment'];

    function sharedConfigFactory (environment) {
        let globalConfig,
            environmentConfig;

        globalConfig = {
            RADIUS: 50,
            THUMBNAIL_WIDTH: 240,
            STRAATBEELD_THUMB_URL: 'panorama/thumbnail/',
            AUTH_HEADER_PREFIX: 'Bearer '
        };

        environmentConfig = {
            PRODUCTION: {
                API_ROOT: 'https://api.datapunt.amsterdam.nl/'
            },
            ACCEPTATION: {
                API_ROOT: 'https://api-acc.datapunt.amsterdam.nl/'
            },
            DEVELOPMENT: {
                API_ROOT: 'https://api.datapunt.amsterdam.nl/'
            }
        };

        return angular.merge(globalConfig, environmentConfig[environment.NAME]);
    }
})();
