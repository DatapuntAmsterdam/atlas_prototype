(function () {
    'use strict';

    angular
        .module('atlas')
        .config(locationDecorator);

    locationDecorator.$inject = ['$provide'];

    function locationDecorator ($provide) {
        $provide.decorator('$location', urlCompressor);

        urlCompressor.$inject = ['$delegate', 'urlComposer'];

        /**
         * Decorates the search method of the $location service to allow for compressed urls
         * The urlCompressor is used for compressing and decompressing states (params)
         * @param {Object} $delegate
         * @param {urlComposer} urlComposer
         * @returns {Object} $delegate
         */
        function urlCompressor ($delegate, urlComposer) {
            /**
             * the original search method of $location
             * @type {*}
             */
            let orgSearch = $delegate.search;

            /**
             * Routes each call to $location.search to the url composer compress or decompress function
             *   $location.search(search, [paramValue]);
             *     This method is getter / setter.
             *     Return search part (as object) of current URL when called without any parameter.
             *     Change search part when called with parameter and return $location.
             * @param {...Object} search
             * @returns {Object}
             */
            $delegate.search = function mySearch (...search) {
                if (search.length === 0) {
                    return urlComposer.decompressParams(orgSearch.apply($delegate, search));
                } else {
                    urlComposer.compressParams(search[0]);
                    return orgSearch.apply($delegate, search);
                }
            };

            return $delegate;
        }
    }
})();
