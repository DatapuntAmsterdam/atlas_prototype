import {
    setPanoramaYear
} from '../../../../src/shared/ducks/panorama/actions';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .directive('dpStraatbeeldHistory', DpStraatbeeldHistoryDirective);

    DpStraatbeeldHistoryDirective.$inject = ['store'];

    function DpStraatbeeldHistoryDirective (store) {
        return {
            restrict: 'E',
            scope: {
                location: '<',
                heading: '<',
                history: '<'
            },
            templateUrl: 'modules/straatbeeld/components/history/history.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            const firstYear = 2016;
            // Update the lastYear manually if there are straatbeelden available for that year
            const lastYear = 2018;
            const total = lastYear - firstYear + 1;
            const everywhere = angular.element(window.document);

            scope.options = Array(total)
                .fill(0)
                .map((value, index) => {
                    const year = lastYear - index;
                    return {
                        year: year,
                        label: 'Alleen ' + year
                    };
                });

            scope.selectedOption = {
                year: undefined,
                label: 'Meest recent'
            };

            scope.options.unshift(scope.selectedOption);

            if (scope.history) {
                scope.selectedOption = scope.options.find(
                    (option) => option.year === scope.history);
            }

            scope.toggleMenu = () => scope.menuActive = !scope.menuActive;
            scope.setSelectedOption = (option) => {
                scope.selectedOption = option;
                store.dispatch(setPanoramaYear(option.year));
            };

            scope.$watchCollection('location', updateLocation, true);

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
