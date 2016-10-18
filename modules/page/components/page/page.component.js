(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpPage', {
            bindings: {
                name: '@'
            },
            templateUrl: 'modules/page/components/page/page.html',
            controllerAs: 'vm'
        });
})();
