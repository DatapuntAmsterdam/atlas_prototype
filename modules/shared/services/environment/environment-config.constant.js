(function () {
    'use strict';

    angular
        .module('dpShared')
        .constant('ENVIRONMENT_CONFIG', {
            DEVELOPMENT: {
                API_ROOT: 'https://api-acc.datapunt.amsterdam.nl/',
                AUTH_ROOT: 'https://api-acc.datapunt.amsterdam.nl/authenticatie/'
            },
            PRODUCTION: {
                API_ROOT: 'https://api.datapunt.amsterdam.nl/',
                AUTH_ROOT: 'https://api.datapunt.amsterdam.nl/authenticatie/'
            }
        });
})();
