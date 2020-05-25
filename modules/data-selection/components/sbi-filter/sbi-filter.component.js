import angular from 'angular'
import { addFilter, removeFilter } from '../../../../src/shared/ducks/filters/filters'

angular.module('dpDataSelection').component('dpSbiFilter', {
  bindings: {
    availableFilters: '=',
    activeFilters: '=',
  },
  templateUrl: 'modules/data-selection/components/sbi-filter/sbi-filter.html',
  controller: DpSbiFilterController,
  controllerAs: 'vm',
})

DpSbiFilterController.$inject = ['$scope', 'store']

function DpSbiFilterController($scope, store) {
  const vm = this
  this.$onInit = function () {
    const sbiLevelFilters = vm.availableFilters.filter((filter) => filter.slug.startsWith('sbi_l'))
    const numberOfOptions = sbiLevelFilters.reduce(
      (total, amount) => total + amount.numberOfOptions,
      0,
    )
    const options = sbiLevelFilters
      .map((filter) => {
        return filter.options.map((sub) => ({
          ...sub,
          slug: filter.slug,
        }))
      })
      .reduce((a, b) => a.concat(b), [])
      .slice(0, 100)

    vm.sbiCode =
      vm.activeFilters &&
      vm.activeFilters.sbi_code &&
      // eslint-disable-next-line no-useless-escape
      vm.activeFilters.sbi_code.replace(/['\[\]]/g, '')
    vm.showMoreThreshold = 10
    vm.isExpanded = false
    vm.filterSlug = 'sbi_code'

    vm.filter = {
      ...vm.availableFilters.find((filter) => filter.slug === 'sbi_code'),
      options,
      numberOfOptions,
    }

    vm.onSubmit = () => {
      vm.addOrRemoveFilter(vm.sbiCode)
    }

    vm.addOrRemoveFilter = (value) => {
      const formattedValue = value
        .split(',')
        .map((data) => `'${data.trim()}'`)
        .join(', ')

      if (value === '') {
        store.dispatch(removeFilter(vm.filterSlug))
      } else {
        store.dispatch(
          addFilter({
            [vm.filterSlug]: `[${formattedValue}]`,
          }),
        )
      }
    }

    vm.clickFilter = (string) => {
      vm.addOrRemoveFilter(string.replace(/: .*$/g, ''))
    }

    vm.showExpandButton = function () {
      return !vm.isExpanded && vm.canExpandImplode()
    }

    vm.nrHiddenOptions = function (filter) {
      return filter.numberOfOptions - filter.options.length
    }

    vm.expandFilter = function () {
      vm.isExpanded = true
    }

    vm.implodeFilter = function () {
      vm.isExpanded = false
    }

    vm.canExpandImplode = function () {
      return vm.filter.options.length > vm.showMoreThreshold
    }
  }
}
