(function () {
    'use strict';

    angular
        .module('dpShared')
        .constant('ENVIRONMENT_CONFIG', {
            DEVELOPMENT: {
                API_ROOT: 'https://api-acc.datapunt.amsterdam.nl/',
                OAUTH_ROOT: 'https://api-acc.datapunt.amsterdam.nl/oauth/'
            },
            PRODUCTION: {
                API_ROOT: 'https://api.datapunt.amsterdam.nl/',
                OAUTH_ROOT: 'https://api.datapunt.amsterdam.nl/oauth/'
            }
        });
})();