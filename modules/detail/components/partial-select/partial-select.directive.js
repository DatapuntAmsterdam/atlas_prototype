((() => {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpPartialSelect', dpPartialSelectDirective);

    dpPartialSelectDirective.$inject = ['partialCompiler', 'user'];

    function dpPartialSelectDirective (partialCompiler, user) {
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

            scope.showMoreInfoWarning = !user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL.EMPLOYEE);

            partialCompiler.getHtml(templateUrl, scope).then(partial => {
                scope.loadMore = scope.loadMoreFn;

                scope.isEmployee = user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL.EMPLOYEE);
                scope.showMoreInfoWarning = !scope.isEmployee;

                element.append(partial);
            });
        }
    }
}))();
