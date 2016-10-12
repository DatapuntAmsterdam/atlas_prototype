(function () {
    'use strict';

    angular
        .module('atlasPage')
        .component('atlasMetadata', {
            templateUrl: 'modules/page/components/metadata/metadata.html',
            controller: AtlasMetadataController,
            controllerAs: 'vm'
        });

    AtlasMetadataController.$inject = ['api'];

    function AtlasMetadataController (api) {
        var vm = this;

        vm.isLoading = true;

        api.getByUri('metadata/').then(function (data) {
            vm.isLoading = false;

            vm.sources = data;
        });
    }
})();
