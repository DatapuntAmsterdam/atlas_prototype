(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('variableWidth', variableWidthFactory);

    variableWidthFactory.$inject = ['$rootScope'];

    function variableWidthFactory ($rootScope) {
        return {
            initialize: initialize
        };

        function initialize (container, leafletMap) {
            var unwatch = $rootScope.$watch(function () {
                return container.clientWidth;
            }, function (newWidth, oldWidth) {
                if (newWidth !== oldWidth) {
                    leafletMap.invalidateSize();
                }
            });

            $rootScope.$on('$destroy', unwatch);
        }
    }
})();
