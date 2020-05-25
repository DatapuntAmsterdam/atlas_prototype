import angular from 'angular'

angular.module('dpDetail').filter('yesNo', yesNoFilter)

function yesNoFilter() {
  return function (input) {
    if (input === true) {
      return 'Ja'
    }
    if (input === false) {
      return 'Nee'
    }
    return ''
  }
}
