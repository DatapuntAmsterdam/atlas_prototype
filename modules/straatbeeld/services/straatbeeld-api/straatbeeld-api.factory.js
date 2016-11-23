(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('straatbeeldApi', straatbeeldApiFactory);

    straatbeeldApiFactory.$inject = ['$q', 'straatbeeldConfig', 'geojson', 'api'];

    function straatbeeldApiFactory ($q, straatbeeldConfig, geojson, api) {
        let cancel; // Promise to cancel any outstanding http requests

        return {
            getImageDataByLocation,
            getImageDataById
        };

        function getImageDataByLocation (location) {
            const MAX_RADIUS = 10000;
            return getStraatbeeld(straatbeeldConfig.STRAATBEELD_ENDPOINT +
                `?lat=${location[0]}&lon=${location[1]}&radius=${MAX_RADIUS}`);
        }

        function getImageDataById (id) {
            return getStraatbeeld(straatbeeldConfig.STRAATBEELD_ENDPOINT + id + '/');
        }

        function getStraatbeeld (url) {
            if (cancel) {
                // Cancel any outstanding requests
                cancel.resolve();
            }
            cancel = $q.defer();
            return api.getByUrl(url, undefined, cancel)
                .then(imageData)
                .finally(() => cancel = null);
        }

        function imageData (response) {
            let formattedGeometrie = {
                coordinates: [
                    response.geometrie.coordinates[1],
                    response.geometrie.coordinates[0]
                ],
                type: response.geometrie.type
            };

            return {
                date: new Date(response.timestamp),
                id: response.pano_id,
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
        }
    }
})();
