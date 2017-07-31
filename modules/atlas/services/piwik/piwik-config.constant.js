((() => {
    'use strict';

    angular
        .module('atlas')
        .constant('PIWIK_CONFIG', {
            PRODUCTION: {
                SITE_ID: 1
            },
            PRE_PRODUCTION: {
                SITE_ID: 3
            },
            ACCEPTATION: {
                SITE_ID: 3
            },
            DEVELOPMENT: {
                SITE_ID: 3
            }
        });
}))();
