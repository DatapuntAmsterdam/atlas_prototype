import stateUrlConverter from '../../../../src/shared/services/routing/state-url-converter';

(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpLink', {
            template: require('./link.html'),
            transclude: true,
            bindings: {
                className: '@',
                inline: '@',
                hoverText: '@',
                type: '@',
                payload: '<',
                query: '<'
            },
            controller: DpLinkController,
            controllerAs: 'vm'
        });

    DpLinkController.$inject = ['$scope', 'store', 'ACTIONS', '$location', '$window'];

    function DpLinkController ($scope, store, ACTIONS, $location, $window) {
        const vm = this;
        vm.activeUrl = $location.url();

        vm.className = vm.className || 'o-btn o-btn--link';
        vm.inline = vm.inline || false;

        $scope.$watch('vm.payload', function () {
            vm.href = getHref(vm.type, vm.payload);
            // Do not catch a click event and handle the state change
            // internally, this prevents users from CTRL/CMD clicking!
        });

        vm.dispatch = function () {
            store.dispatch(getAction(vm.type, vm.payload, vm.query));
        };

        store.subscribe(() => {
            // exclude the zoom level (mpz) and the location (mpv) from the tests
            var regex = /mpz=\d*&mpv=\d*.\d*:\d*.\d*/gi;
            const currentUrl = $location.url();
            if (currentUrl.replace(regex, '') !== vm.activeUrl.replace(regex, '')) {
                vm.href = getHref(vm.type, vm.payload);
                vm.activeUrl = currentUrl;
            }
        });

        function getAction (type, payload, query) {
            const action = {
                type: ACTIONS[type] || type
            };
            if (angular.isDefined(payload)) {
                action.payload = payload;
            }

            if (angular.isDefined(query)) {
                action.meta = {};
                action.meta.query = query;
            }
            return action;
        }

        function getHref (type, payload) {
            // Remove state properties that do not relate to the url
            // by converting the state to a url and back
            // This prevents deep copying of large state objects in the reducer (eg dataSelection.markers)
            const reducer = $window.reducer,
                state = store.getState(),
                params = stateUrlConverter.state2params(state),
                sourceState = stateUrlConverter.params2state({}, params),
                targetState = reducer(sourceState, getAction(type, payload));

            return stateUrlConverter.state2url(targetState);
        }
    }
})();
