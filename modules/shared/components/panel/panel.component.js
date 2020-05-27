import angular from 'angular'

angular.module('dpShared').component('dpPanel', {
  bindings: {
    isPanelVisible: '<',
    size: '@',
    type: '@',
    canClose: '=',
    className: '@',
    closeAction: '&',
  },
  transclude: true,
  templateUrl: 'modules/shared/components/panel/panel.html',
  controller: DpPanelController,
  controllerAs: 'vm',
})

// size:
// Small (less padding, no marging)
// Tiny (just to fit some words)
//
// type :
// Danger (rode vormgeving)
// Warning (blauwe vormgeving)
// Default (grijze vormgeving) als niet wordt toegevoegd

function DpPanelController() {
  const vm = this

  this.$onInit = function () {
    vm.sizeClass = vm.size ? `c-panel--${vm.size}` : ''
    vm.typeClass = vm.type ? `c-panel--${vm.type}` : ''

    vm.close = function () {
      vm.isPanelVisible = false
      vm.closeAction && vm.closeAction() // eslint-disable-line no-unused-expressions
    }
  }
}
