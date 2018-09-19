import ACTIONS from '../../../../src/shared/actions';

// This component is just an mock of the dp-link component
// Is only used in the tests to simplify the test process
(function () {
    'use strict';

    angular
        .module('dpShared')
        .directive('dpButton', dpButtonDirective);

    dpButtonDirective.$inject = ['store'];

    function dpButtonDirective (store) {
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
            /* istanbul ignore next */
            scope.className = scope.className || 'o-btn o-btn--link qa-button-mock';
            scope.click = clickHandler;

            function clickHandler () {
                /* istanbul ignore next */
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

