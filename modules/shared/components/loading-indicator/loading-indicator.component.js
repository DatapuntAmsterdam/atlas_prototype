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

    DpLoadingIndicatorController.$inject = ['$scope', '$interval'];

    function DpLoadingIndicatorController ($scope, $interval) {
        var vm = this,
            timer,
            threshold = 400;
console.log('loading', $interval.cancel);
        vm.showLoadingIndicator = false;

        $scope.$watch('vm.isLoading', function (isLoading) {
            if (isLoading) {
                timer = $interval(function () {
                    vm.showLoadingIndicator = true;
                }, vm.useDelay ? threshold : 0);
            } else {
                $interval.cancel(timer);

                vm.showLoadingIndicator = false;
            }
        });
    }
})();
