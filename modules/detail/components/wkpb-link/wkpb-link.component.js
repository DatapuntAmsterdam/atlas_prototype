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

    DpWkpbLinkController.$inject = ['environment'];

    function DpWkpbLinkController (environment) {
        var vm = this;

        vm.wkpbEndpoint = environment.API_ROOT + 'brk/object-wkpb/' + vm.brkId + '/';
    }
})();
