(function () {
    angular
        .module('dpShared')
        .component('dpApiError', {
            templateUrl: 'modules/shared/components/api-error/api-error.html',
            controller: DpApiErrorController,
            controllerAs: 'vm'
        });

    DpApiErrorController.$inject = ['httpStatus'];

    function DpApiErrorController (httpStatus) {
        let vm = this;

        // Simply expose the http status
        vm.httpStatus = httpStatus.getStatus();
    }
})();
