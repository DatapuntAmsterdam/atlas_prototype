((() => {
    'use strict';

    angular
        .module('dpShared')
        .constant('GOOGLE_SHEET_CMS', {
            getStatic: {   // when to get CMS static data (daily refreshed) or dynamically direct from the sheet
                PRODUCTION: true,
                PRE_PRODUCTION: false,
                ACCEPTATION: false,
                DEVELOPMENT: false
            },
            staticAddress: 'https://data.amsterdam.nl/cms',
            key: '1ZExuZHhmvBRP-7rhuY43Lv7dWuAsGKXwfKd1_3BZfbI',
            index: {
                news: 1,
                beleid: 2,
                help: 3,
                snelwegwijs: 4,
                apis: 5,
                proclaimer: 6,
                info: 7
            }
        });
}))();
