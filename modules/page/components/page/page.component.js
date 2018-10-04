import getContents from '../../../../src/shared/services/google-sheet/google.sheet';

(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpPage', {
            bindings: {
                name: '@',
                type: '@',
                item: '@'
            },
            templateUrl: 'modules/page/components/page/page.html',
            controller: DpPageComponent,
            controllerAs: 'vm'
        });

    DpPageComponent.inject = ['$scope'];

    function DpPageComponent ($scope) {
        const vm = this;

        vm.feed = null;
        vm.entries = [];
        vm.entry = null;

        if (vm.type) {
            getContents(vm.type)
                .then(contents => {
                    vm.feed = contents.feed;
                    vm.entries = contents.entries;
                    vm.entry = vm.entries.find(entry => entry.id === vm.item);
                    $scope.$digest();
                });
        }
    }
})();
