import angular from 'angular'
import { VIEWS_TO_PARAMS } from '../../../../../src/shared/ducks/data-selection/constants'
import { setViewMode, VIEW_MODE } from '../../../../../src/shared/ducks/ui/ui'

angular.module('dpDataSelection').component('dpDataSelectionToggleViewButton', {
  bindings: {
    view: '<',
  },
  templateUrl:
    'modules/data-selection/components/header/toggle-view-button/toggle-view-button.html',
  controller: DpToggleViewButtonController,
  controllerAs: 'vm',
})

DpToggleViewButtonController.$inject = ['$scope']

function DpToggleViewButtonController($scope) {
  const vm = this

  $scope.$watch('vm.view', function () {
    if (vm.view === VIEWS_TO_PARAMS[VIEW_MODE.FULL]) {
      vm.targetLabel = 'Kaart weergeven'
      vm.targetHover = 'Resultaten op de kaart weergeven'
      vm.action = setViewMode(VIEW_MODE.SPLIT, 'kaart-weergeven')
      vm.targetIcon = 'kaart'
    } else {
      vm.targetLabel = 'Tabel weergeven'
      vm.targetHover = 'Resultaten in tabel weergeven'
      vm.action = setViewMode(VIEW_MODE.FULL, 'tabel-weergeven')
      vm.targetIcon = 'list'
    }
  })
}
