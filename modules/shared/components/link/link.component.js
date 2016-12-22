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

        vm.className = vm.className || 'o-btn o-btn--link';
        vm.tagName = getTagName(vm.type, vm.payload);

        if (vm.tagName === 'a') {
            vm.href = getHref(vm.type, vm.payload);
        }

        vm.dispatch = function () {
            let action = {
                type: ACTIONS[vm.type]
            };

            if (angular.isDefined(vm.payload)) {
                action.payload = vm.payload;
            }

            store.dispatch(action);
        };

        /**
         * @returns {String} Either 'button' or 'a'
         */
        function getTagName (type, payload) {
            let currentPath = decodeURIComponent($location.url());
            let targetPath = getHref(type, payload);

            if (currentPath === targetPath) {
                return 'button';
            } else {
                return ACTIONS[type].isButton ? 'button' : 'a';
            }
        }

        function getHref (type, payload) {
            const reducer = applicationState.getReducer();
            const stateToUrl = applicationState.getStateToUrl();

            let oldState,
                targetState;

            oldState = applicationState.getStore().getState();

            targetState = reducer(oldState, {
                type: ACTIONS[type],
                payload: payload
            });

            return stateToUrl.create(targetState);
        }
    }
})();
