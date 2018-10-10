import { routing } from '../../../../src/app/routes';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .directive('dpStraatbeeld', dpStraatbeeldDirective);

    dpStraatbeeldDirective.$inject = [
        '$rootScope',
        'store',
        'ACTIONS',
        'marzipanoService',
        'straatbeeldApi',
        'orientation'
    ];

    function dpStraatbeeldDirective (
        $rootScope,
        store,
        ACTIONS,
        marzipanoService,
        straatbeeldApi,
        orientation) {
        return {
            restrict: 'E',
            scope: {
                state: '=',
                resize: '<'
            },
            templateUrl: 'modules/straatbeeld/components/straatbeeld/straatbeeld.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var container,
                viewer;

            container = element[0].querySelector('.js-marzipano-viewer');
            viewer = marzipanoService.initialize(container);

            var viewChangeHandler = viewer.addEventListener('viewChange', () => {
                orientation.update(viewer);
            });

            scope.backToMap = routing.map.type;

            // We need to watch for object equality instead of reference
            // equality for both the `image` and `hotspots` object/array. This
            // can be done with `$watch` (third and last parameter is true),
            // but not with `$watchGroup`. Therefor we return an array
            // containing both `image` and `hotspots`.
            scope.$watch((newScope) => [newScope.state.image, newScope.state.hotspots], () => {
                if (angular.isObject(scope.state.image)) {
                    marzipanoService.loadScene(
                        scope.state.image,
                        scope.state.heading,
                        scope.state.pitch,
                        scope.state.fov,
                        scope.state.hotspots
                    );
                }
            }, true);

            // Re-render the Marzipano viewer if the size changes (through an added parent CSS class)
            scope.$watchCollection('resize', function () {
                $rootScope.$applyAsync(function () {
                    viewer.updateSize();
                });
            });

            scope.$on('$destroy', function () {
                viewer.removeEventListener(viewChangeHandler);
            });
        }
    }
})();
