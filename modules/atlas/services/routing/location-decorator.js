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
         * Decorates to search method of the $location service to allow for compressed urls
         * The urlCompressor is used for compressing and decompressing states (params)
         * @param $delegate
         * @param urlComposer
         * @returns {*}
         */
        function urlCompressor ($delegate, urlComposer) {
            /**
             * the original search method of $location
             * @type {*}
             */
            let orgSearch = $delegate.search;

            /**
             * Routes each call to $location.search to the url composer compress or decompress function
             * @param a
             * @returns {*}
             */
            $delegate.search = function mySearch (...a) {
                if (a.length === 0) {
                    return urlComposer.decompressParams(orgSearch.apply($delegate, a));
                } else {
                    urlComposer.compressParams(a[0]);
                    return orgSearch.apply($delegate, a);
                }
            };

            return $delegate;
        }
    }
})();
