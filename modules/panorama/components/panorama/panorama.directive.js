(function () {
    'use strict';

    angular
        .module('dpPanorama')
        .directive('dpPanorama', dpPanoramaDirective);

    dpPanoramaDirective.$inject = [
        '$rootScope', 
        'store', 
        'ACTIONS', 
        'marzipanoService', 
        'panoramaApi',
        'orientation'
    ];

    function dpPanoramaDirective ($rootScope, store, ACTIONS, marzipanoService, panoramaApi, orientation) {
        return {
            restrict: 'E',
            scope: {
                state: '=',
                isPrintMode: '='
            },
            templateUrl: 'modules/panorama/components/panorama/panorama.html',
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

            //Fetch scene
            scope.$watch('state.id', function (id) {
 
                if (angular.isString(id)) {
                    panoramaApi.getImageDataById(id).then(function (panoramaData) {
                         var type = scope.state.isInitial   ? ACTIONS.SHOW_PANORAMA_INITIAL 
                                                            : ACTIONS.SHOW_PANORAMA_SUBSEQUENT;
                                                            
                         store.dispatch({
                                type: type,
                                payload: panoramaData
                         });
                    });
                }
                 
            });

            scope.$watch('state.image', function(img) {
 
                if (angular.isString(img)) {
                    marzipanoService.loadScene( scope.state.image, 
                                                scope.state.heading, 
                                                scope.state.pitch, 
                                                scope.state.fov, 
                                                scope.state.hotspots);
                    }
            });

            //Re-render the Marzipano viewer if the size changes (through an added parent CSS class)
            scope.$watch('isPrintMode', function () {
                $rootScope.$applyAsync(function () {
                    viewer.updateSize();
                });
            });
        }
    }
})();
