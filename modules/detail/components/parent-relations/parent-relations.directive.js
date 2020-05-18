;(function () {
  angular.module('dpDetail').directive('dpParentRelations', dpParentRelationsDirective)

  function dpParentRelationsDirective() {
    return {
      restrict: 'E',
      scope: {
        content: '<',
      },
      templateUrl: 'modules/detail/components/parent-relations/parent-relations.html',
      controller: DpParentRelationsController,
      controllerAs: 'vm',
      bindToController: true,
    }
  }

  DpParentRelationsController.$inject = ['PARENT_RELATIONS_CONFIG']

  function DpParentRelationsController(PARENT_RELATIONS_CONFIG) {
    const vm = this

    vm.$onChanges = () => {
      vm.parentRelations = PARENT_RELATIONS_CONFIG.keyOrder
        .map((key) => ({
          data: vm.content[key] || vm.content[`_${key}`] || null,
          label: PARENT_RELATIONS_CONFIG.labels[key],
        }))
        .filter((item) => item.data !== null)
    }
  }
})()
