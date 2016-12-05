(function () {
    'use strict';

    angular
        .module('dpDataShared')
        .component('dpDataSharedPaginationLink', {
            bindings: {
                link: '=',
                action: '@'
            },
            templateUrl: 'modules/data-shared/components/pagination/pagination-link.html',
            controllerAs: 'vm'
        });
})();
