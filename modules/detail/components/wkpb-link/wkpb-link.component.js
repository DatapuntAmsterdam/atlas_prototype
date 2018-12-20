(function () {
    'use strict';

    angular
        .module('dpDetail')
        .component('dpWkpbLink', {
            bindings: {
                brkId: '@'
            },
            templateUrl: 'modules/detail/components/wkpb-link/wkpb-link.html',
            controller: DpWkpbLinkController,
            controllerAs: 'vm'
        });

    DpWkpbLinkController.$inject = ['sharedConfig'];

    function DpWkpbLinkController (sharedConfig) {
        const vm = this;

        vm.wkpbEndpoint = sharedConfig.ROOT + 'brk/object-wkpb/' + vm.brkId + '/';
    }
})();
