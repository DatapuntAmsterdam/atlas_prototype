import angular from 'angular'

angular.module('dpShared').filter('kebabcase', kebabCase)

function kebabCase() {
  return function (input) {
    return input ? input.toLowerCase().replace(/[: ][ ]*/g, '-') : ''
  }
}
