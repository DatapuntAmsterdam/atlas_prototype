import angular from 'angular'

/* istanbul ignore next */
angular.module('dpDataSelection').component('dpDataSelectionPaginationLink', {
  bindings: {
    link: '=',
  },
  templateUrl: 'modules/data-selection/components/pagination/pagination-link.html',
  controllerAs: 'vm',
})
