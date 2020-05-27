import angular from 'angular'

angular.module('dpDetail').component('dpApiCall', {
  bindings: {
    endpoint: '@',
    partial: '@',
    addApiRoot: '=',
    useBrkObjectExpanded: '=',
    merge: '<',
    user: '<',
    noResultMessage: '@',
    subType: '<',
    id: '<',
  },
  templateUrl: 'modules/detail/components/api-call/api-call.html',
  controller: DpApiCallController,
  controllerAs: 'vm',
})

DpApiCallController.$inject = ['$scope', 'api']

function DpApiCallController($scope, api) {
  const vm = this

  vm.isLoading = true
  vm.useLoadingIndicatorDelay = false

  $scope.$watch('vm.endpoint', function (endpoint) {
    if (endpoint) {
      if (vm.useBrkObjectExpanded) {
        endpoint = endpoint.replace('brk/object', 'brk/object-expand')
      }

      vm.apiData = {}
      vm.isLoading = true

      // Load the first page
      loadData(endpoint, vm.addApiRoot)

      // Load pages 2-n
      vm.loadMore = function () {
        vm.isLoading = true

        loadData(vm.apiData.next)
      }
    }
  })

  function loadData(endpoint, addApiRoot) {
    const callEndpointFn = addApiRoot ? api.getByUri : api.getByUrl
    callEndpointFn(endpoint)
      .then(function (response) {
        const hasPagination = angular.isArray(response.results)

        if (hasPagination) {
          if (angular.isUndefined(vm.apiData.results)) {
            vm.apiData.results = []
          }

          vm.apiData.count = response.count
          vm.apiData.results = vm.apiData.results.concat(response.results)
          vm.apiData.next = response._links.next && response._links.next.href
        } else {
          vm.apiData.results = response
        }

        if (vm.merge) {
          vm.apiData = angular.merge(vm.apiData, vm.merge)
        }
      })
      .finally(() => {
        vm.isLoading = false
        vm.useLoadingIndicatorDelay = true
      })
  }
}
