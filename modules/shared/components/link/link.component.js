(function () {
    'use strict';

    angular
        .module('dpShared')
        .directive('dpLink', DpLinkDirective);

    DpLinkDirective.$inject = ['$location', 'store', 'ACTIONS', 'applicationState', 'debounce'];

    function DpLinkDirective ($location, store, ACTIONS, applicationState, debounce) {
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

            /**
             * Execute the link action, either by dispatching the action or by following the link url
             * @param event
             */
            scope.go = function (event) {
                if (event) {
                    // Click on link
                    if (ACTIONS[scope.type].ignore) {
                        // The action should be ignored for the browser history, prevent the link being followed
                        // and execute action as if it was a button
                        // Righ-click, open in new tab will still work, ctrl-click not
                        event.preventDefault();
                    } else {
                        return;
                    }
                }
                store.dispatch(getAction());
            };

            if (!scope.isButton) {
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

                let currentUrl = '#' + decodeURIComponent($location.absUrl().split('#')[1]);
                let newUrl = stateToUrl.create(newState);

                if (newUrl === currentUrl) {
                    scope.isButton = true;
                } else {
                    scope.url = encodeURI(newUrl);
                }
            }
        }
    }
})();
