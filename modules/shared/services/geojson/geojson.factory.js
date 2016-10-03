(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('geojson', geojsonFactory);

    function geojsonFactory () {
        return {
            getCenter: getCenter
        };

        /*
         * @param {Object} - GeoJSON
         *
         * @description - This thing has support for Point, Polygon en MultiPolygon. The thing is CRS agnostic.
         *
         * @returns {Array} - A location in this format [latitude, longitude]
         */
        function getCenter (geoJSON) {
            var xValues = [],
                yValues = [],
                xMin,
                yMin,
                xMax,
                yMax;
            
            if (geoJSON.type === 'Point') {
                xValues.push(geoJSON.coordinates[1]);
                yValues.push(geoJSON.coordinates[0]);
            } else {
                getCoordinates(geoJSON.coordinates);
            }

            xValues.sort();
            yValues.sort();

            xMin = xValues[0];
            yMin = yValues[0];

            xMax = xValues[xValues.length - 1];
            yMax = yValues[yValues.length - 1];

            return [
                xMin + (xMax - xMin) / 2,
                yMin + (yMax - yMin) / 2
            ];


            function getCoordinates (coordinates) {
                var isCoordinate = coordinates.length === 2 &&
                    angular.isNumber(coordinates[0]) &&
                    angular.isNumber(coordinates[1]);

                if (isCoordinate) {
                    xValues.push(coordinates[0]);
                    yValues.push(coordinates[1]);
                } else {
                    //We have to go deeper recursively; two levels for Polygons, three levels for MultiPolygons
                    coordinates.forEach(getCoordinates);
                }
            }
        }
    }
})();