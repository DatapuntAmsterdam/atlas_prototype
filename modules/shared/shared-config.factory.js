(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('sharedConfig', sharedConfigFactory);

    sharedConfigFactory.$inject = ['environment'];

    function sharedConfigFactory (environment) {
        var globalConfig,
            environmentConfig;

        globalConfig = {
            STRAATBEELD_SEARCH_RADIUS: 100
        };

        environmentConfig = {
            DEVELOPMENT: {
                STRAATBEELD_THUMB_URL: 'https://api-acc.datapunt.amsterdam.nl/panorama/thumbnail/'
            },
            PRODUCTION: {
                STRAATBEELD_THUMB_URL: 'https://api.datapunt.amsterdam.nl/panorama/thumbnail/'
            }
        };

        return angular.merge(globalConfig, environmentConfig[environment.NAME]);
    }
})();