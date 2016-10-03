(function () {
    'use strict';

    angular
        .module('dpPanorama')
        .factory('hotspotService', hotspotService);

    hotspotService.$inject = ['$q', '$document', '$compile', '$rootScope'];

    function hotspotService ($q, $document, $compile, $rootScope) {
        return {
            createHotspotTemplate: createHotspotTemplate
        };

        function createHotspotTemplate (sceneId, distance) {
            var q,
                html,
                element,
                scope;

            q = $q.defer();

            element = $document[0].createElement('dp-hotspot');
            element.setAttribute('scene-id', 'sceneId');
            element.setAttribute('distance', 'distance');

            scope = $rootScope.$new();
            scope.sceneId = sceneId;
            scope.distance = distance;

            html = $compile(element)(scope)[0];

            scope.$applyAsync(function () {
                q.resolve(html);
            });

            return q.promise;
        }
    }
})();
