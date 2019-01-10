import isObject from '../../../../src/shared/services/is-object';
import { isVestigingAmsterdam } from '../../../../src/shared/services/geometry/geometry';

(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('geometry', geometryFactory);

    geometryFactory.$inject = ['api'];

    function geometryFactory (api) {
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
                if (isObject(data.geometrie)) {
                    return data.geometrie;
                } else if (isVestigingAmsterdam(data)) {
                    return data.bezoekadres.geometrie;
                } else if (isAPerceel(url, data)) {
                    return getGPerceel(data).then(getGeometry);
                } else if (isNummeraanduiding(url)) {
                    return getAdresseerbaarObject(data).then(getGeometry);
                } else if (isMonument(url)) {
                    return data.monumentcoordinaten;
                } else {
                    return null;
                }
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

            function isMonument (anUrl) {
                return anUrl.indexOf('monumenten/monumenten') !== -1;
            }

            function getAdresseerbaarObject (nummeraanduidingData) {
                var object = nummeraanduidingData.type;
                object = object.toLowerCase();

                return api.getByUrl(nummeraanduidingData[object]);
            }
        }
    }
})();
