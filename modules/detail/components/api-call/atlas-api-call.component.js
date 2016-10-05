(function () {
    'use strict';

    angular
        .module('atlasDetail')
        .component('atlasApiCall', {
            bindings: {
                endpoint: '@',
                partial: '@',
                addApiRoot: '=',
                useBrkObjectExpanded: '='
            },
            templateUrl: 'modules/detail/components/api-call/atlas-api-call.html',
            controller: AtlasApiCallController,
            controllerAs: 'vm'
        });

    AtlasApiCallController.$inject = ['$scope', 'api'];

    function AtlasApiCallController ($scope, api) {
        var vm = this;

        vm.isLoading = true;
        vm.useLoadingIndicatorDelay = false;

        $scope.$watch('vm.endpoint', function (endpoint) {
            if (endpoint) {
                if (vm.useBrkObjectExpanded) {
                    endpoint = endpoint.replace('brk/object', 'brk/object-expand');
                }

                vm.apiData = {};
                vm.isLoading = true;

                //Load the first page
                loadData(endpoint, vm.addApiRoot);

                //Load pages 2-n
                vm.loadMore = function () {
                    vm.isLoading = true;

                    loadData(vm.apiData.next);
                };
            }
        });

        function loadData (endpoint, addApiRoot) {
            var callEndpointFn = addApiRoot ? api.getByUri : api.getByUrl;
            callEndpointFn(endpoint).then(function(response) {
                var hasPagination = angular.isArray(response.results);

                if (hasPagination) {
                    if (angular.isUndefined(vm.apiData.results)) {
                        vm.apiData.results = [];
                    }

                    vm.apiData.count = response.count;
                    vm.apiData.results = vm.apiData.results.concat(response.results);
                    vm.apiData.next = response._links.next && response._links.next.href;
                } else {
                    vm.apiData.results = response;
                }

                vm.isLoading = false;
                vm.useLoadingIndicatorDelay = true;
            });
        }
    }
})();
