(function () {
    'use strict';

    angular
        .module('dpShared')
        .constant('USER_SETTINGS', {
            refreshToken: {
                storage: 'session'
            },
            userType: {
                storage: 'session'
            },
            fullscreenStraatbeeld: {
                storage: 'local',
                default: true.toString()
            },
            showCatalogusIntroduction: {
                storage: 'session',
                default: true.toString()
            }
        });
})();
