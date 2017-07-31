((() => {
    'use strict';

    angular
        .module('dpPage')
        .component('dpMetadata', {
            templateUrl: 'modules/page/components/metadata/metadata.html',
            controller: DpMetadataController,
            controllerAs: 'vm'
        });

    DpMetadataController.$inject = ['api'];

    function DpMetadataController (api) {
        var vm = this;

        vm.isLoading = true;

        api.getByUri('metadata/').then(data => {
            vm.isLoading = false;

            vm.sources = data;
        });
    }
}))();
