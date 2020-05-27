import angular from 'angular'
import isDefined from '../../../../src/shared/services/is-defined'

angular.module('dpShared').component('dpLink', {
  template: require('./link.html'),
  transclude: true,
  bindings: {
    className: '@',
    inline: '@',
    hoverText: '@',
    type: '@',
    payload: '<',
    query: '<',
    action: '<',
    tabIndex: '@',
  },
  controller: DpLinkController,
  controllerAs: 'vm',
})

DpLinkController.$inject = ['$scope', 'store', '$location']

function DpLinkController($scope, store, $location) {
  const vm = this
  this.$onInit = function () {
    vm.activeUrl = $location.url()

    vm.className = vm.className || 'o-btn o-btn--link'
    vm.inline = vm.inline || false
    vm.tabIndex = vm.tabIndex || '0'

    vm.dispatch = function (e) {
      e.preventDefault()
      if (vm.action) {
        store.dispatch(vm.action)
      } else {
        store.dispatch(getAction(vm.type, vm.payload, vm.query))
      }
    }

    function getAction(type, payload, query) {
      const action = {
        type,
      }
      if (isDefined(payload)) {
        action.payload = payload
      }

      if (angular.isDefined(query)) {
        action.meta = {}
        action.meta.query = query
      }
      return action
    }
  }
}
