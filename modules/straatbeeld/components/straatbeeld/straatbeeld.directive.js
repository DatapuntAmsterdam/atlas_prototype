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

            scope.shouldUpdate = false;

            scope.startUpdating = function () {
                scope.shouldUpdate = true;
            };

            scope.stopUpdating = function () {
                scope.shouldUpdate = false;
            };

            scope.updateOrientation = function () {
                if (!scope.state.isLoading && scope.shouldUpdate) {
                    orientation.update(viewer);
                }
            };

            // Fetch scene by location
            scope.$watchCollection('state.location', function (location, oldLocation) {
                // eslint-disable-next-line
                if (!scope.state.id && angular.isArray(location) && JSON.stringify(location) !== JSON.stringify(oldLocation)) {
                    straatbeeldApi.getImageDataByLocation(location, scope.state.history).then(showStraatbeeld);
                }
            });

            // Fetch scene by id
            scope.$watch('state.id', function (id) {
                // Load straatbeeld on id when no location is set or no image is yet loaded
                if (angular.isString(id)) {
                    straatbeeldApi.getImageDataById(id, scope.state.history).then(showStraatbeeld);
                }
            });

            scope.$watch('state.history', function (history, oldHistory) {
                if (history.year !== oldHistory.year || history.missionType !== oldHistory.missionType) {
                    if (angular.isArray(scope.state.location)) {
                        straatbeeldApi.getImageDataByLocation(scope.state.location, history).then(showStraatbeeld);
                    }
                }
            });

            function showStraatbeeld (straatbeeldData) {
                var type = scope.state.isInitial ? ACTIONS.SHOW_STRAATBEELD_INITIAL
                    : ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT;

                // Update the scene
                store.dispatch({
                    type: type,
                    payload: straatbeeldData
                });
            }

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
        }
    }
})();
