import angular from 'angular'

angular.module('atlas').run(runBlock)

runBlock.$inject = ['$timeout', '$rootScope', '$window']

function runBlock($timeout, $rootScope, $window) {
  $window.reduxStore.subscribe(() => {
    $timeout(() => $rootScope.$digest())
  })
}
