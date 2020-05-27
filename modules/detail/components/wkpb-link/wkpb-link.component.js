import angular from 'angular'

angular.module('dpDetail').component('dpWkpbLink', {
  bindings: {
    brkId: '@',
  },
  templateUrl: 'modules/detail/components/wkpb-link/wkpb-link.html',
  controller: DpWkpbLinkController,
  controllerAs: 'vm',
})

function DpWkpbLinkController() {
  const vm = this

  this.$onInit = function () {
    vm.wkpbEndpoint = `${process.env.ROOT}brk/object-wkpb/${vm.brkId}/`
  }
}
