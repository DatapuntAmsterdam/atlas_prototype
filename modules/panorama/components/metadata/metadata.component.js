(function () {
    'use strict';

    angular
        .module('dpPanorama')
        .component('dpPanoramaMetadata', {
            bindings: {
                date: '=',
                location: '='
            },
            templateUrl: 'modules/panorama/components/metadata/metadata.html',
            controllerAs: 'vm',
            controller: function () {
                var vm = this;

                vm.showMetaInfo = function () {
                    return angular.isDate(vm.date) && angular.isArray(vm.location);
                };
            }
        });
})();