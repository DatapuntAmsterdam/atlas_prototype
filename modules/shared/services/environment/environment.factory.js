(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('environment', environmentFactory);

    environmentFactory.$inject = ['$location', 'ENVIRONMENT_CONFIG'];

    function environmentFactory ($location, ENVIRONMENT_CONFIG) {
        var environment;

        switch ($location.host()) {
            case 'atlas.amsterdam.nl':
                environment = 'PRODUCTION';
                break;

            default:
                environment = 'DEVELOPMENT';
        }

        ENVIRONMENT_CONFIG[environment].NAME = environment;

        return ENVIRONMENT_CONFIG[environment];
    }
})();
