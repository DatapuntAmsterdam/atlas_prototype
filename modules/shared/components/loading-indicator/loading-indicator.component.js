(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpLoadingIndicator', {
            bindings: {
                isLoading: '=',
                useDelay: '=',
                showInline: '='
            },
            templateUrl: 'modules/shared/components/loading-indicator/loading-indicator.html',
            controller: DpLoadingIndicatorController,
            controllerAs: 'vm'
        });

    DpLoadingIndicatorController.$inject = ['$scope', '$timeout'];

    function DpLoadingIndicatorController ($scope, $timeout) {
        var vm = this,
            timer,
            threshold = 400;

        vm.showLoadingIndicator = false;

        $scope.$watch('vm.isLoading', function (isLoading) {
            if (isLoading) {
                timer = $timeout(function () {
                    vm.showLoadingIndicator = true;
                }, vm.useDelay? threshold : 0);
            } else {
                $timeout.cancel(timer);

                vm.showLoadingIndicator = false;
            }
        });
    }
})();