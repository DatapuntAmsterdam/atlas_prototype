(function () {
    'use strict';

    angular
        .module('dpShared')
        .constant('USER_SETTINGS', {
            showCatalogusIntroduction: {
                storage: 'session',
                default: true.toString()
            }
        });
})();
