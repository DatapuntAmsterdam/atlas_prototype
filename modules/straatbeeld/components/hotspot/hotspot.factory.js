((() => {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('hotspotService', hotspotService);

    hotspotService.$inject = ['$q', '$document', '$compile', '$rootScope'];

    function hotspotService ($q, $document, $compile, $rootScope) {
        return {
            createHotspotTemplate: createHotspotTemplate
        };

        function createHotspotTemplate (sceneId, distance, pitch, year) {
            var q,
                html,
                element,
                scope;

            q = $q.defer();

            element = $document[0].createElement('dp-hotspot');
            element.setAttribute('scene-id', 'sceneId');
            element.setAttribute('distance', 'distance');
            element.setAttribute('pitch', 'pitch');
            element.setAttribute('year', 'year');

            scope = $rootScope.$new();
            scope.sceneId = sceneId;
            scope.distance = distance;
            scope.pitch = pitch;
            scope.year = year;

            html = $compile(element)(scope)[0];

            scope.$applyAsync(() => {
                q.resolve(html);
            });

            return q.promise;
        }
    }
}))();
