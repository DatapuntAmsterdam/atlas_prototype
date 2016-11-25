(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('dpStringCompressor', dpStringCompressor);

    dpStringCompressor.$inject = ['LZString'];

    function dpStringCompressor (LZString) {
        return {
            compressFromObject,
            decompressToObject,
            compress,
            decompress
        };

        function obj2String (obj) {
            if (angular.isObject(obj)) {
                return angular.toJson(obj);
            } else {
                return '';
            }
        }

        function string2Obj (s) {
            if (angular.isString(s)) {
                try {
                    return angular.fromJson(s);
                } catch (e) {
                    return {};
                }
            } else {
                return {};
            }
        }

        function compressFromObject (obj) {
            return compress(obj2String(obj));
        }

        function decompressToObject (s) {
            return string2Obj(decompress(s));
        }

        function compress (s) {
            return LZString.compressToEncodedURIComponent(s);
        }

        function decompress (s) {
            return LZString.decompressFromEncodedURIComponent(s);
        }
    }
})();
