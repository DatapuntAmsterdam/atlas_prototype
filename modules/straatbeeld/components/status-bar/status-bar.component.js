(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .component('dpStraatbeeldStatusBar', {
            bindings: {
                date: '<',
                location: '<',
                heading: '<',
                history: '='
            },
            templateUrl: 'modules/straatbeeld/components/status-bar/status-bar.html',
            controller: DpStraatbeeldStatusBarController,
            controllerAs: 'vm'
        });

    DpStraatbeeldStatusBarController.$inject = ['$scope'];

    function DpStraatbeeldStatusBarController ($scope) {
        const vm = this;

        vm.showMetaInfo = () => angular.isDate(vm.date) && angular.isArray(vm.location);
    }
})();
