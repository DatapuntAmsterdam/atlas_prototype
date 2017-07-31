((() => {
    'use strict';

    angular
        .module('dpShared')
        .component('dpLinkToPage', {
            templateUrl: 'modules/shared/components/link-to-page/link-to-page.html',
            transclude: true,
            bindings: {
                type: '@',
                item: '@',
                className: '@'
            },
            controller: DpLinkToPageController,
            controllerAs: 'vm'
        });

    DpLinkToPageController.$inject = ['$transclude'];

    function DpLinkToPageController ($transclude) {
        const vm = this,
            label = $transclude().text();

        vm.payload = {
            name: 'content-overzicht',
            type: vm.type || 'snelwegwijs'
        };

        if (vm.item) {
            vm.payload.item = vm.item;
        }

        vm.label = label || 'Help > Bediening > Inloggen';
    }
}))();
