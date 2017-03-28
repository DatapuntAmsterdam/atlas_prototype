(function () {
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

            scope.showMoreInfoWarning = !(user.getUserType() === user.USER_TYPE.AUTHENTICATED &&
                user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL.EMPLOYEE));

            partialCompiler.getHtml(templateUrl, scope).then(function (partial) {
                scope.loadMore = scope.loadMoreFn;

                element.append(partial);
            });
        }
    }
})();
