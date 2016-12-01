(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpStringCompressor', dpStringCompressor);

    dpStringCompressor.$inject = ['LZString'];

    /**
     * The dpStringCompressor factory allows for the compression and depression of strings
     * @param LZString A library that implements compression by using the LZW algorithm
     * @returns {{compressFromObject: compressFromObject, decompressToObject: decompressToObject, compress: compress,
     * decompress: decompress}}
     */
    function dpStringCompressor (LZString) {
        return {
            compressFromObject,
            decompressToObject,
            compress,
            decompress
        };

        /**
         * Converts an arbitray object to a string by converting it to JSON
         * @param {Object} obj an arbitrary object
         * @returns {string|undefined}
         */
        function obj2String (obj) {
            if (angular.isObject(obj)) {
                return angular.toJson(obj);
            }
        }

        /**
         * Converts a string JSON format to an object
         * @param {string} s JSON string
         * @returns {Object|undefined}
         */
        function string2Obj (s) {
            try {
                return angular.fromJson(s);
            } catch (e) {
                return;
            }
        }

        /**
         * Compresses an object into a string
         * @param {Object} obj
         * @returns {string}
         */
        function compressFromObject (obj) {
            return compress(obj2String(obj) || '');
        }

        /**
         * Decompresses a string into an object
         * @param {string} s
         * @returns {Object}
         */
        function decompressToObject (s) {
            return string2Obj(decompress(s)) || {};
        }

        /**
         * Compresses a string
         * @param {string} s the original string to compress
         * @returns {string} the compressed version of the string
         */
        function compress (s) {
            return LZString.compressToEncodedURIComponent(s);
        }

        /**
         * Decompresses a string that was earlier compressed using the compress method
         * @param {string} s the compressed string
         * @returns {string} the original uncompressed version of the string
         */
        function decompress (s) {
            return LZString.decompressFromEncodedURIComponent(s);
        }
    }
})();
