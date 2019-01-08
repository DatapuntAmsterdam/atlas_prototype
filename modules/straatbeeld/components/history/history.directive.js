import {historyOptions} from '../../../../src/shared/ducks/straatbeeld/straatbeeld';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .directive('dpStraatbeeldHistory', DpStraatbeeldHistoryDirective);

    DpStraatbeeldHistoryDirective.$inject = ['store', 'ACTIONS'];

    function DpStraatbeeldHistoryDirective (store, ACTIONS) {
        return {
            restrict: 'E',
            scope: {
                location: '<',
                heading: '<',
                history: '='
            },
            templateUrl: 'modules/straatbeeld/components/history/history.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            const total = historyOptions.length;

            scope.options = historyOptions;

            scope.selectedOption = historyOptions[0];
            if (scope.history && scope.history.year) {
                scope.selectedOption = scope.options.find(
                    (option) => option.year === scope.history.year && option.missionType === scope.history.missionType);
            }

            scope.toggleMenu = () => scope.menuActive = !scope.menuActive;
            scope.setSelectedOption = (option) => {
                scope.selectedOption = option;
                store.dispatch({
                    type: ACTIONS.SET_STRAATBEELD_HISTORY,
                    payload: option
                });
            };

            scope.$watchCollection('location', updateLocation, true);

            const everywhere = angular.element(window.document);
            everywhere.bind('click', (event) => {
                const container = element.find('div').eq(0);
                const button = container.find('div');
                const menu = container.find('ul');
                const devider = menu.find('li').eq(total + 1);
                const external = menu.find('li').eq(total + 2);
                const isButtonClick = [button, menu, devider, external]
                    .reduce((is, el) => is || event.target === el[0], false);

                if (!isButtonClick) {
                    scope.menuActive = false;
                }

                scope.$apply();
            });

            function updateLocation () {
                if (angular.isArray(scope.location)) {
                    const lat = scope.location[0];
                    const lon = scope.location[1];
                    const path = 'http://maps.google.com/maps?q=&layer=c&';
                    const parameters = `cbll=${lat},${lon}&cbp=11,${scope.heading},0,0,0`;

                    scope.streetViewUrl = `${path}${parameters}`;
                }
            }
        }
    }
})();
