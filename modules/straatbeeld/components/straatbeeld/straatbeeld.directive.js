import throttle from 'lodash.throttle';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .directive('dpStraatbeeld', dpStraatbeeldDirective);

    dpStraatbeeldDirective.$inject = [
        '$rootScope',
        'store',
        'marzipanoService',
        'straatbeeldApi',
        'orientation'
    ];

    function dpStraatbeeldDirective (
        $rootScope,
        store,
        marzipanoService,
        straatbeeldApi,
        orientation
    ) {
        return {
            restrict: 'E',
            scope: {
                state: '=',
                resize: '<',
                hotspots: '<',
                isFullscreen: '<',
                doClose: '&'
            },
            templateUrl: 'modules/straatbeeld/components/straatbeeld/straatbeeld.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            const container = element[0].querySelector('.js-marzipano-viewer');
            const viewer = marzipanoService.initialize(container);

            // Throttle viewChange event because to many small insignificant updates
            // are being dispatched as actions.
            // Making sure function is called no more than once in a 300ms period.
            // AND update is fired at start and end of this 300ms period. So directly
            // when first call is made, and additional calls are merged into single call after
            // period.
            // NOTE: throttle is done for performance reasons. If store changes are less of a
            // performance hit, then we may remove this or reduce the period length.
            const viewChangeHandler = viewer.addEventListener('viewChange', /* istanbul ignore next */ () => {
                throttle(
                    () => {
                        orientation.update(viewer);
                    },
                    300,
                    {
                        leading: true,
                        trailing: true
                    }
                );
            });

            // We need to watch for object equality instead of reference
            // equality for both the `image` and `hotspots` object/array. This
            // can be done with `$watch` (third and last parameter is true),
            // but not with `$watchGroup`. Therefor we return an array
            // containing both `image` and `hotspots`.
            scope.$watch((newScope) => [newScope.state.image, newScope.hotspots], () => {
                if (angular.isObject(scope.state.image)) {
                    marzipanoService.loadScene(
                        scope.state.image,
                        scope.state.heading,
                        scope.state.pitch,
                        scope.state.fov,
                        scope.hotspots
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
