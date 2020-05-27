import angular from 'angular'
import { authenticateRequest } from '../../../../src/shared/ducks/user/user'

angular.module('dpShared').component('dpLoginLink', {
  template: require('./login-link.html'),
  bindings: {
    linkClass: '@',
    hoverText: '@',
  },
  controller: DpLoginLinkController,
  controllerAs: 'vm',
})

DpLoginLinkController.$inject = ['$scope', 'store']

function DpLoginLinkController($scope, store) {
  const vm = this

  vm.onClick = (e) => {
    e.preventDefault()
    store.dispatch(authenticateRequest('inloggen'))
    window.auth.login()
  }
}
