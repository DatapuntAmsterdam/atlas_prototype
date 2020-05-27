import angular from 'angular'

angular.module('dpDetail').directive('dpGlossaryMeta', dpGlossaryMetaDirective)

function dpGlossaryMetaDirective() {
  return {
    restrict: 'E',
    scope: {
      definition: '@',
      apiData: '=',
    },
    templateUrl: 'modules/detail/components/glossary/meta/glossary-meta.html',
    transclude: true,
    controller: DpGlossaryMetaController,
    controllerAs: 'vm',
    bindToController: true,
  }
}

DpGlossaryMetaController.$inject = ['GLOSSARY']

function DpGlossaryMetaController(GLOSSARY) {
  const vm = this

  this.$onInit = function () {
    vm.metaFields = []

    GLOSSARY.DEFINITIONS[vm.definition].meta.forEach((field) => {
      vm.metaFields.push({
        label: GLOSSARY.META[field].label,
        value: vm.apiData.results[field],
        type: GLOSSARY.META[field].type,
      })
    })
  }
}
