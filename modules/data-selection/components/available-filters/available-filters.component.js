import angular from 'angular'
import { addFilter } from '../../../../src/shared/ducks/filters/filters'
import DATA_SELECTION_CONFIG from '../../../../src/shared/services/data-selection/data-selection-config'

angular.module('dpDataSelection').component('dpDataSelectionAvailableFilters', {
  bindings: {
    dataset: '@',
    availableFilters: '=',
    activeFilters: '=',
  },
  templateUrl: 'modules/data-selection/components/available-filters/available-filters.html',
  controller: DpDataSelectionAvailableFiltersController,
  controllerAs: 'vm',
})

DpDataSelectionAvailableFiltersController.$inject = ['$scope', 'store']

function DpDataSelectionAvailableFiltersController($scope, store) {
  const vm = this
  this.$onInit = function () {
    const expandedFilters = []

    $scope.$watch('vm.dataset', updateConfig, true)

    vm.showMoreThreshold = 10

    vm.hasInactiveFilterOptions = function (filter) {
      return !filter.options.some((option) =>
        vm.isFilterOptionActive(filter.slug, option.id, option.label),
      )
    }

    vm.isFilterOptionActive = function (filterSlug, id, label) {
      return vm.activeFilters[filterSlug] === label || vm.activeFilters[filterSlug] === id
    }

    vm.addFilter = function (filterSlug, optionId) {
      store.dispatch(
        addFilter({
          [filterSlug]: optionId,
        }),
      )
    }

    vm.showExpandButton = function (filterSlug) {
      return (
        !vm.isExpandedFilter(filterSlug) &&
        getAvailableOptions(filterSlug).length > vm.showMoreThreshold
      )
    }

    vm.nrHiddenOptions = function (filter) {
      return filter.numberOfOptions - filter.options.length
    }

    vm.expandFilter = function (filterSlug) {
      expandedFilters.push(filterSlug)
    }

    vm.implodeFilter = function (filterSlug) {
      const index = expandedFilters.indexOf(filterSlug)
      if (index >= 0) {
        expandedFilters.splice(index, 1)
      }
    }

    vm.isExpandedFilter = function (filterSlug) {
      return expandedFilters.indexOf(filterSlug) !== -1
    }

    vm.canExpandImplode = function (filterSlug) {
      return getAvailableOptions(filterSlug).length > vm.showMoreThreshold
    }

    function getAvailableOptions(filterSlug) {
      return getAvailableFilters(filterSlug)[0].options
    }

    function getAvailableFilters(filterSlug) {
      return vm.availableFilters.filter((filter) => filter.slug === filterSlug)
    }

    function updateConfig() {
      vm.showOptionCounts = DATA_SELECTION_CONFIG.datasets[vm.dataset].SHOW_FILTER_OPTION_COUNTS
      vm.stelselpediaUrl = DATA_SELECTION_CONFIG.datasets[vm.dataset].STELSELPEDIA_URL
    }
  }
}
