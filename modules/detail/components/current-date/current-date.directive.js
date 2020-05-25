import angular from 'angular'

angular.module('dpDetail').directive('dpCurrentDate', dpCurrentDateDirective)

function dpCurrentDateDirective() {
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'modules/detail/components/current-date/current-date.html',
    controller: DpCurrentDateController,
    controllerAs: 'vm',
  }
}

function DpCurrentDateController() {
  const vm = this

  vm.currentDate = new Date()
}
