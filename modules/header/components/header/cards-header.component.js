(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpCardsHeader', {
            bindings: {
                query: '@'
            },
            templateUrl: 'modules/header/components/header/cards-header.html',
            controllerAs: 'vm'
        });
})();
