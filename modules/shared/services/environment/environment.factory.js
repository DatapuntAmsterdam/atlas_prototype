((() => {
    'use strict';

    angular
        .module('dpShared')
        .factory('environment', environmentFactory);

    environmentFactory.$inject = ['$location'];

    function environmentFactory ($location) {
        const config = {};

        switch ($location.host()) {
            case 'data.amsterdam.nl':
                config.NAME = 'PRODUCTION';
                break;

            case 'pre.data.amsterdam.nl':
                config.NAME = 'PRE_PRODUCTION';
                break;

            case 'acc.data.amsterdam.nl':
                config.NAME = 'ACCEPTATION';
                break;

            default:
                config.NAME = 'DEVELOPMENT';
        }

        config.isDevelopment = () => config.NAME === 'DEVELOPMENT';

        return config;
    }
}))();
