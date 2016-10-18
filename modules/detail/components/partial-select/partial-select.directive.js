(function () {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpPartialSelect', dpPartialSelectDirective);

    dpPartialSelectDirective.$inject = ['partialCompiler'];

    function dpPartialSelectDirective (partialCompiler) {
        return {
            restrict: 'E',
            scope: {
                partial: '@',
                apiData: '=',
                loadMoreFn: '='
            },
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var templateUrl = 'modules/detail/components/partial-select/partials/' + scope.partial + '.html';

            partialCompiler.getHtml(templateUrl, scope).then(function (partial) {
                scope.loadMore = scope.loadMoreFn;

                element.append(partial);
            });
        }
    }
})();
