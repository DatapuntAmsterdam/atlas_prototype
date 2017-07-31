((() => {
    'use strict';

    angular
        .module('dpShared')
        .factory('angleConversion', angleConversionFactory);

    function angleConversionFactory () {
        var ratio = Math.PI / 180;

        return {
            degreesToRadians: degreesToRadians,
            radiansToDegrees: radiansToDegrees
        };

        /*
         * @param {Number} degrees
         *
         * @returns {Number}
         */
        function degreesToRadians (degrees) {
            return degrees * ratio;
        }

        /*
         * @param {Number} radians
         *
         * @returns {Number}
         */
        function radiansToDegrees (radians) {
            return radians / ratio;
        }
    }
}))();
