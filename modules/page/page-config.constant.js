((() => {
    'use strict';

    angular
        .module('dpPage')
        .constant('PAGE_NAMES', {
            home: 'Home',
            metadata: 'Metadata',
            news: 'Nieuws',
            beleid: 'Beleid',
            help: 'Help',
            snelwegwijs: 'Bediening portaal',
            apis: 'API\'s gebruiken',
            proclaimer: 'Proclaimer'
        });
}))();
