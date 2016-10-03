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
            RADIUS: 50
        };


        environmentConfig = {
            DEVELOPMENT: {
                PANORAMA_THUMB_URL: 'https://api-acc.datapunt.amsterdam.nl/panorama/thumbnail/'
            },
            PRODUCTION: {
                PANORAMA_THUMB_URL: 'https://api.datapunt.amsterdam.nl/panorama/thumbnail/'
            }
        };

        return angular.merge(globalConfig, environmentConfig[environment.NAME]);
    }
})();