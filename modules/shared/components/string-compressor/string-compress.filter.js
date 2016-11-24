(function () {
    'use strict';

    angular
        .module('dpShared')
        .filter('dpStringCompress', dpStringCompress)
        .filter('dpStringDecompress', dpStringDecompress);

    [dpStringCompress, dpStringDecompress].map(f => f.$inject = ['dpStringCompressor']);

    function dpStringCompress (dpStringCompressor) {
        return function (input) {
            return dpStringCompressor.compress(input);
        };
    }

    function dpStringDecompress (dpStringCompressor) {
        return function (input) {
            return dpStringCompressor.decompress(input);
        };
    }
})();
