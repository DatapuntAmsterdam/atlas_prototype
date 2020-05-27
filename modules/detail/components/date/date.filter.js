import angular from 'angular'

angular.module('dpDetail').filter('dpDate', dpDateFilter)

dpDateFilter.$inject = ['dateFilter']

function dpDateFilter(dateFilter) {
  return function (input) {
    return dateFilter(input, 'd MMMM yyyy')
  }
}
