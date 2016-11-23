(function () {
    'use strict';

    angular
        .module('dpShared')
        .directive('dpLink', dpLinkDirective);

    dpLinkDirective.$inject = ['store', 'ACTIONS'];

    function dpLinkDirective (store, ACTIONS) {
        return {
            template: '<button ng-click="click()" class="{{className}}" title="{{hoverText}}">' +
                '<ng-transclude></ng-transclude><span class="u-sr-only">{{hoverText}}</span></button>',
            transclude: true,
            link: linkFn,
            scope: {
                className: '@',
                hoverText: '@',
                type: '@',
                payload: '='
            }
        };

        function linkFn (scope, element) {
            scope.className = scope.className || 'o-btn o-btn--link';
            scope.click = clickHandler;

            function clickHandler () {
                var action = angular.isDefined(scope.payload) ? {
                    type: ACTIONS[scope.type],
                    payload: scope.payload
                } : {
                    type: ACTIONS[scope.type]
                };

                store.dispatch(action);
            }
        }
    }
})();
