(function () {
    'use strict';

    angular
        .module('atlasDetail')
        .directive('atlasPartialSelect', atlasPartialSelectDirective);

    atlasPartialSelectDirective.$inject = ['partialCompiler'];

    function atlasPartialSelectDirective (partialCompiler) {
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
