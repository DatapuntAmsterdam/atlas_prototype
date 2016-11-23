(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('straatbeeldConfig', straatbeeldConfigFactory);

    straatbeeldConfigFactory.$inject = ['environment'];

    function straatbeeldConfigFactory (environment) {
        var globalConfig,
            environmentConfig;

        globalConfig = {
            DEFAULT_FOV: 80,
            MAX_FOV: 90,
            MAX_RESOLUTION: 12 * 1024,
            CAMERA_HEIGHT: 1.8,
            LEVEL_PROPERTIES_LIST: [
                {
                    tileSize: 256,
                    size: 256,
                    fallbackOnly: true
                },
                {
                    tileSize: 512,
                    size: 512
                },
                {
                    tileSize: 512,
                    size: 1024
                },
                {
                    tileSize: 512,
                    size: 2048
                }
            ]
        };

        environmentConfig = {
            DEVELOPMENT: {
                STRAATBEELD_ENDPOINT: 'https://api-acc.datapunt.amsterdam.nl/panorama/opnamelocatie/'
            },
            PRODUCTION: {
                STRAATBEELD_ENDPOINT: 'https://api.datapunt.amsterdam.nl/panorama/opnamelocatie/'
            }
        };

        return angular.merge(globalConfig, environmentConfig[environment.NAME]);
    }
})();
