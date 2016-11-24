(function () {
    'use strict';

    angular
        .module('dpShared')
        .filter('dpAbbreviator', dpAbbreviator)
        .filter('dpDeabbreviator', dpDeabbreviator);

    function dpAbbreviator () {
        return function (input) {
            return input;
        };
    }

    function dpDeabbreviator () {
        return function (input) {
            return input;
        };
    }
})();
