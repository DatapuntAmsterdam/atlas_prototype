(function () {
    'use strict';

    angular
        .module('atlasDetail')
        .component('atlasWkpbLink', {
            bindings: {
                brkId: '@'
            },
            templateUrl: 'modules/detail/components/wkpb-link/wkpb-link.html',
            controller: AtlasWkpbLinkController,
            controllerAs: 'vm'
        });

    AtlasWkpbLinkController.$inject = ['environment'];

    function AtlasWkpbLinkController (environment) {
        var vm = this;

        vm.wkpbEndpoint = environment.API_ROOT + 'brk/object-wkpb/' + vm.brkId + '/';
    }
})();
