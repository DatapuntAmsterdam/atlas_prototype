(function () {
    'use strict';

    angular
        .module('dpShared')
        .filter('coordinates', coordinatesFilter);

    coordinatesFilter.$inject = ['crsConverter'];

    function coordinatesFilter (crsConverter) {
        /**
         * @param {Array} wgs84Location - An array with latitude and longitude, e.g. [52.123, 4.789]
         *
         * @returns {String} - A formatted string with RD and lat/lon coordinates "X, Y (lat, lon)"
         */
        return function (wgs84Location) {
            var rdLocation = crsConverter.wgs84ToRd(wgs84Location),
                formattedRdLocation,
                formattedWgs84Location;

            formattedWgs84Location = wgs84Location.map(function (coordinate) {
                return coordinate.toFixed(7);
            }).join(', ');

            formattedRdLocation = rdLocation.map(function (coordinate) {
                return coordinate.toFixed(2);
            }).join(', ');

            return formattedRdLocation + ' (' + formattedWgs84Location + ')';
        };
    }
})();
