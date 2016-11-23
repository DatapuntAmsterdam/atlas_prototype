(function () {
    'use strict';

    angular
        .module('dpShared')
        .directive('dpLink', DpLinkDirective);

    DpLinkDirective.$inject = ['store', 'ACTIONS', 'applicationState', 'debounce'];

    function DpLinkDirective (store, ACTIONS, applicationState, debounce) {
        const reducer = applicationState.getReducer(),
            stateToUrl = applicationState.getStateToUrl();

        return {
            templateUrl: 'modules/shared/components/link/link.html',
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
            const DEBOUNCE_WAIT_TIME = 300;     // Wait time in msecs before executing update

            scope.className = scope.className || 'o-btn o-btn--link';

            scope.isButton = Boolean(ACTIONS[scope.type].isButton);

            if (scope.isButton) {
                // Provide for button click method
                scope.go = function () {
                    store.dispatch(getAction());
                };
            } else {
                // Update url on change of state
                let debounced = debounce(DEBOUNCE_WAIT_TIME, update),
                    unsubscribe = store.subscribe(debounced);

                // We don't need to keep updating the url after the element has
                // been destroyed
                element.on('$destroy', () => {
                    unsubscribe();
                    debounced.cancel();
                });

                // Provide for initial url
                update();
            }

            function getAction () {
                return angular.isDefined(scope.payload) ? {
                    type: ACTIONS[scope.type],
                    payload: scope.payload
                } : {
                    type: ACTIONS[scope.type]
                };
            }

            function update () {
                const oldState = store.getState(),
                    action = getAction(),
                    newState = reducer(oldState, action);

                scope.url = stateToUrl.create(newState);
            }
        }
    }
})();
