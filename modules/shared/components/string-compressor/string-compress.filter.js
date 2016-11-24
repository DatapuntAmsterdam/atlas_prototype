(function () {
    'use strict';

    angular
        .module('dpShared')
        .filter('dpStringCompress', dpStringCompress)
        .filter('dpStringDecompress', dpStringDecompress);

    [dpStringCompress, dpStringDecompress].map(f => f.$inject = ['LZString']);

    function dpStringCompress (LZString) {
        return function (input) {
            return LZString.compressToBase64(input);
        };
    }

    function dpStringDecompress (LZString) {
        return function (input) {
            return LZString.decompressFromBase64(input);
        };
    }
})();
