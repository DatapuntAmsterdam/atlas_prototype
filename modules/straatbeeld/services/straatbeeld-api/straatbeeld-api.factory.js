(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('straatbeeldApi', straatbeeldApiFactory);

    straatbeeldApiFactory.$inject = ['straatbeeldConfig', 'geojson', 'api'];

    function straatbeeldApiFactory (straatbeeldConfig, geojson, api) {
        return {
            getImageDataById: getImageDataById
        };

        function getImageDataById (id) {
            return api.getByUrl(straatbeeldConfig.STRAATBEELD_ENDPOINT + id + '/').then(function (response) {
                var formattedGeometrie = {
                    coordinates: [
                        response.geometrie.coordinates[1],
                        response.geometrie.coordinates[0]
                    ],
                    type: response.geometrie.type
                };

                return {
                    date: new Date(response.timestamp),
                    hotspots: response.adjacent.map(function (item) {
                        return {
                            id: item.pano_id,
                            heading: item.heading,
                            distance: item.distance
                        };
                    }),
                    location: geojson.getCenter(formattedGeometrie),
                    image: response.image_sets.cubic
                };
            });
        }
    }
})();
