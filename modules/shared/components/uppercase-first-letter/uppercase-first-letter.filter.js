import angular from 'angular'

angular.module('dpShared').filter('dpUppercaseFirstLetter', dpUppercaseFirstLetterFilter)

function dpUppercaseFirstLetterFilter() {
  return function (input) {
    return input.substring(0, 1).toUpperCase() + input.substring(1)
  }
}
