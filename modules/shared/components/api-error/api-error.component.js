(function () {
    angular
        .module('dpShared')
        .component('dpApiError', {
            bindings: {
                user: '<'
            },
            templateUrl: 'modules/shared/components/api-error/api-error.html',
            controller: DpApiErrorController,
            controllerAs: 'vm'
        });

    DpApiErrorController.$inject = ['$scope', 'httpStatus'];

    function DpApiErrorController ($scope, httpStatus) {
        const vm = this;

        // Simply expose the http status as well
        vm.httpStatus = httpStatus.getStatus();

        reset();

        $scope.$watch('vm.httpStatus.hasErrors', (hasErrors) => {
            reset();

            if (hasErrors) {
                if (vm.httpStatus[httpStatus.NOT_FOUND_ERROR]) {
                    vm.showNotFoundError = true;
                } else if (vm.httpStatus[httpStatus.LOGIN_ERROR]) {
                    vm.showLoginError = true;
                } else {
                    vm.showServerError = true;
                }
            }
        });

        $scope.$watch('vm.user.error', (error) => {
            if (error) {
                httpStatus.registerError(httpStatus.LOGIN_ERROR);
            }
        });

        function reset () {
            vm.showServerError = false;
            vm.showNotFoundError = false;
        }
    }
})();
