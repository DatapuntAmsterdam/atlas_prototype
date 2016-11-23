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

    function dpStraatbeeldDirective ($rootScope, store, ACTIONS, marzipanoService, straatbeeldApi, orientation) {
        return {
            restrict: 'E',
            scope: {
                state: '=',
                isPrintMode: '='
            },
            templateUrl: 'modules/straatbeeld/components/straatbeeld/straatbeeld.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var container,
                viewer;

            container = element[0].querySelector('.js-marzipano-viewer');
            viewer = marzipanoService.initialize(container);

            scope.updateOrientation = function () {
                if (!scope.state.isLoading) {
                    orientation.update(viewer);
                }
            };

            // Fetch scene by location
            scope.$watchCollection('state.location', function (location) {
                if (!scope.state.id && angular.isArray(location)) {
                    straatbeeldApi.getImageDataByLocation(location).then(showStraatbeeld);
                }
            });

            // Fetch scene by id
            scope.$watch('state.id', function (id) {
                // Load straatbeeld on id when no location is set or no image is yet loaded
                if (!(angular.isArray(scope.state.location) && scope.state.image) && angular.isString(id)) {
                    straatbeeldApi.getImageDataById(id).then(showStraatbeeld);
                }
            });

            function showStraatbeeld (straatbeeldData) {
                var type = scope.state.isInitial ? ACTIONS.SHOW_STRAATBEELD_INITIAL
                    : ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT;

                // Dispatch an action to change the pano
                store.dispatch({
                    type: type,
                    payload: straatbeeldData
                });
            }

            scope.$watchCollection('state.image', function () {
                if (angular.isObject(scope.state.image)) {
                    marzipanoService.loadScene(
                        scope.state.image,
                        scope.state.heading,
                        scope.state.pitch,
                        scope.state.fov,
                        scope.state.hotspots
                    );
                }
            });

            // Re-render the Marzipano viewer if the size changes (through an added parent CSS class)
            scope.$watch('isPrintMode', function () {
                $rootScope.$applyAsync(function () {
                    viewer.updateSize();
                });
            });
        }
    }
})();
