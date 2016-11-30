(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .component('dpStraatbeeldMetadata', {
            bindings: {
                date: '<',
                location: '<',
                heading: '<'
            },
            templateUrl: 'modules/straatbeeld/components/metadata/metadata.html',
            controller: DpStraatbeeldMetadataController,
            controllerAs: 'vm'
        });

    DpStraatbeeldMetadataController.$inject = ['$scope'];

    function DpStraatbeeldMetadataController ($scope) {
        let vm = this;

        $scope.$watch ('vm.location', updateLocation, true);

        function updateLocation () {
            if (angular.isArray(vm.location)) {
                vm.lat = vm.location[0];
                vm.lon = vm.location[1];

                let path = 'http://maps.google.com/maps?q=&layer=c&';
                let parameters = `cbll=${vm.lat},${vm.lon}&cbp=11,${vm.heading},0,0,0`;

                vm.streetviewUrl = `${path}${parameters}`;
                vm.showStreetview = true;
            }
        }

        vm.showMetaInfo = () => angular.isDate(vm.date) && angular.isArray(vm.location);
    }
})();
