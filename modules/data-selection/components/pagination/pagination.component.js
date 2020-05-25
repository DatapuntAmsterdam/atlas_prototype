import angular from 'angular'

/* istanbul ignore next */
angular.module('dpDataSelection').component('dpDataSelectionPagination', {
  bindings: {
    currentPage: '<',
    numberOfPages: '<',
    setPage: '&',
  },
  templateUrl: 'modules/data-selection/components/pagination/pagination.html',
  controller: DpDataSelectionPaginationController,
  controllerAs: 'vm',
})

/* istanbul ignore next */
function DpDataSelectionPaginationController() {
  const vm = this

  vm.$onChanges = function () {
    const isFirstPage = vm.currentPage === 1
    const isLastPage = vm.currentPage === vm.numberOfPages

    vm.showPagination = vm.numberOfPages > 1

    if (vm.showPagination) {
      vm.firstPage = {
        label: 'Eerste',
        class_name: 'c-data-selection-pagination-link--first',
        action: () => vm.setPage()(1),
        enabled: !isFirstPage,
      }

      vm.previousPage = {
        label: 'Vorige',
        class_name: 'c-data-selection-pagination-link--previous',
        action: () => vm.setPage()(isFirstPage ? null : vm.currentPage - 1),
        enabled: !isFirstPage,
      }

      vm.nextPage = {
        label: 'Volgende',
        class_name: 'c-data-selection-pagination-link--next',
        action: () => vm.setPage()(isLastPage ? null : vm.currentPage + 1),
        enabled: !isLastPage,
      }

      vm.lastPage = {
        label: 'Laatste',
        class_name: 'c-data-selection-pagination-link--last',
        action: () => vm.setPage()(vm.numberOfPages),
        enabled: !isLastPage,
      }
    }
  }

  vm.goToPage = function (event) {
    event.preventDefault()

    if (
      angular.isNumber(vm.currentPage) &&
      vm.currentPage >= 1 &&
      vm.currentPage <= vm.numberOfPages
    ) {
      vm.setPage()(vm.currentPage)
    }
  }

  this.$onInit = function () {
    if (vm.numberOfPages && vm.currentPage > vm.numberOfPages) {
      vm.setPage()(1)
    }
  }
}
