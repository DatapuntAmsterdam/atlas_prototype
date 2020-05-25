import angular from 'angular'

angular.module('dpDetail').factory('partialCompiler', partialCompilerFactory)

partialCompilerFactory.$inject = ['$q', '$compile', '$rootScope', '$templateRequest']

function partialCompilerFactory($q, $compile, $rootScope, $templateRequest) {
  return {
    getHtml,
  }

  function getHtml(templateUrl, sharedScope) {
    return $templateRequest(templateUrl).then(function (template) {
      const q = $q.defer()

      const html = $compile(template)(sharedScope)

      $rootScope.$applyAsync(function () {
        /*
                     Wait for the next digest cycle (making this function asynchronous), the variables should be
                     rendered inside the template before returning the HTML.
                     */
        q.resolve(html)
      })

      return q.promise
    })
  }
}
