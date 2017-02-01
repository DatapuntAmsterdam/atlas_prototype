(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpLink', {
            templateUrl: 'modules/shared/components/link/link.html',
            transclude: true,
            bindings: {
                className: '@',
                hoverText: '@',
                type: '@',
                payload: '<'
            },
            controller: DpLinkController,
            controllerAs: 'vm'
        });

    DpLinkController.$inject = ['$location', 'store', 'ACTIONS', 'applicationState'];

    function DpLinkController ($location, store, ACTIONS, applicationState) {
        let vm = this;

        const BUTTON = 'button',
            LINK = 'a';

        vm.className = vm.className || 'o-btn o-btn--link';
        vm.tagName = getTagName(vm.type, vm.payload);

        vm.dispatch = function () {
            store.dispatch(getAction(vm.type, vm.payload));
        };

        function getAction (type, payload) {
            let action = {
                type: ACTIONS[type]
            };
            if (angular.isDefined(payload)) {
                action.payload = payload;
            }
            return action;
        }

        function getTagName (type, payload) {
            if (ACTIONS[type].isButton) {
                return BUTTON;
            } else {
                let currentPath = '#' + decodeURIComponent($location.url()),
                    href = getHref(type, payload);

                if (currentPath === href) {
                    // Link to itself gets a button to force a page refresh
                    return BUTTON;
                } else {
                    vm.href = href;
                    vm.followLink = function (event) {
                        // The href attribute is ignored when left-clicking
                        // It's only a fallback for middle and right mouse button
                        event.preventDefault();
                        vm.dispatch();
                    };
                    return LINK;
                }
            }
        }

        function getHref (type, payload) {
            // Remove state properties that do not relate to the url
            // by converting the state to a url and back
            // This prevents deep copying of large state objects in the reducer (eg dataSelection.markers)
            const reducer = applicationState.getReducer(),
                state = applicationState.getStore().getState(),
                params = applicationState.getStateUrlConverter().state2params(state),
                sourceState = applicationState.getStateUrlConverter().params2state({}, params),
                targetState = reducer(sourceState, getAction(type, payload));

            return applicationState.getStateUrlConverter().state2url(targetState);
        }
    }
})();
