(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('geometry', geometryFactory);

    geometryFactory.$inject = ['api', 'crsConverter', 'BOUNDING_BOX'];

    function geometryFactory (api, crsConverter, BOUNDING_BOX) {
        return {
            getGeoJSON: getGeoJSON
        };

            /*
             * @param {String} url
             *
             * @returns {Promise} - An object with GeoJSON or null
             */
        function getGeoJSON (url) {
            return api.getByUrl(url).then(getGeometry);

            function getGeometry (data) {
                if (angular.isObject(data.geometrie)) {
                    return data.geometrie;
                } else if (isVestigingAmsterdam(data)) {
                    return data.bezoekadres.geometrie;
                } else if (isAPerceel(url, data)) {
                    return getGPerceel(data).then(getGeometry);
                } else if (isNummeraanduiding(url)) {
                    return getAdresseerbaarObject(data).then(getGeometry);
                } else {
                    return null;
                }
            }

            function isVestigingAmsterdam (data) {
                var isVestiging = false;
                var southWest = crsConverter.wgs84ToRd(BOUNDING_BOX.COORDINATES.southWest);
                var northEast = crsConverter.wgs84ToRd(BOUNDING_BOX.COORDINATES.northEast);

                if (angular.isObject(data.bezoekadres) &&
                        angular.isObject(data.bezoekadres.geometrie) &&
                        data.bezoekadres.geometrie.coordinates[0] > southWest[0] &&
                        data.bezoekadres.geometrie.coordinates[0] < northEast[0] &&
                        data.bezoekadres.geometrie.coordinates[1] > southWest[1] &&
                        data.bezoekadres.geometrie.coordinates[1] < northEast[1]) {
                    isVestiging = true;
                }
                return isVestiging;
            }

            function isAPerceel (anUrl, data) {
                return anUrl.indexOf('brk/object') !== -1 && data.index_letter === 'A';
            }

            function getGPerceel (aPerceelData) {
                    // Retrieve a list of all related G percelen
                return api.getByUrl(aPerceelData.g_percelen.href).then(function (gPercelen) {
                        // Get the first G perceel
                    return api.getByUrl(gPercelen.results[0]._links.self.href);
                });
            }

            function isNummeraanduiding (anUrl) {
                return anUrl.indexOf('bag/nummeraanduiding') !== -1;
            }

            function getAdresseerbaarObject (nummeraanduidingData) {
                var object = nummeraanduidingData.type;
                object = object.toLowerCase();

                return api.getByUrl(nummeraanduidingData[object]);
            }
        }
    }
})();
