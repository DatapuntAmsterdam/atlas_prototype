import angular from 'angular'
import environment from '../../../../src/environment'

angular.module('dpDetail').directive('dpPartialSelect', dpPartialSelectDirective)

dpPartialSelectDirective.$inject = ['partialCompiler']

function dpPartialSelectDirective(partialCompiler) {
  return {
    restrict: 'E',
    scope: {
      partial: '@',
      apiData: '=',
      loadMoreFn: '=',
      user: '<',
      subType: '<',
      id: '<',
    },
    link: linkFunction,
  }

  function linkFunction(scope, element) {
    scope.apiUrl = environment.API_ROOT
    const templateUrl = `modules/detail/components/partial-select/partials/${scope.partial}.html`

    partialCompiler.getHtml(templateUrl, scope).then(function (partial) {
      scope.loadMore = scope.loadMoreFn
      element.append(partial)
    })
  }
}
