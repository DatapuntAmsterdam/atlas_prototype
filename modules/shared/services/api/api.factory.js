(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('api', apiFactory);

    apiFactory.$inject = ['$interval', '$q', '$http', 'user', 'sharedConfig'];

    function apiFactory ($interval, $q, $http, user, sharedConfig) {
        return {
            getByUrl,
            getByUri
        };

        // function getByUrl2 (url, params, cancel) {
        //     const token = user.getAccessToken();
        //     if (token) {
        //         return getByUrlWithToken(url, params, cancel, token);
        //     } else if (user.getRefreshToken()) {
        //         // user is logging in, refresh token is available, access token not yet
        //         const defer = $q.defer();
        //
        //         const interval = $interval(() => {
        //             if (!user.getRefreshToken() || user.getAccessToken()) {
        //                 // Refresh token was invalid or access token has been received
        //                 $interval.cancel(interval);
        //                 defer.resolve(getByUrl(url, params, cancel));
        //             }
        //         }, 250, 20);    // try every 1/4 second, for max 20 * 250 = 5 seconds
        //
        //         // On interval ends resolve without a token
        //         // interval.then(() => {
        //         //     defer.resolve(getByUrlWithToken(url, params, cancel, null));
        //         // });
        //
        //         return defer.promise;
        //     }
        // }
        //

        function getByUrl (url, params, cancel) {
            const token = user.getAccessToken();
            if (token) {
                return getByUrlWithToken(url, params, cancel, user.getAccessToken());
            }
            // else if (user.getRefreshToken()) {
            //     // user is logging in, refresh token is available, access token not yet
            //     const defer = $q.defer();
            //
            //     const interval = $interval(() => {
            //         if (!user.getRefreshToken() || user.getAccessToken()) {
            //             // Refresh token was invalid or access token has been received
            //             $interval.cancel(interval);
            //             defer.resolve(getByUrl(url, params, cancel));
            //         }
            //     }, 250, 20);    // try every 1/4 second, for max 20 * 250 = 5 seconds
            //
            //     // On interval ends resolve without a token
            //     // interval.then(() => {
            //     //     defer.resolve(getByUrlWithToken(url, params, cancel, null));
            //     // });
            //
            //     return defer.promise;
            // }
        }

        /**
         *
         * @param {string} url
         * @param {Object} params
         * @param {Promise} cancel - an optional promise ($q.defer()) to be able to cancel the request
         * @returns {Promise}
         */
        function getByUrlWithToken (url, params, cancel, token) {
            const headers = {};

            if (token) {
                headers.Authorization = sharedConfig.AUTH_HEADER_PREFIX + token;
            }

            const options = {
                method: 'GET',
                url: url,
                headers: headers,
                params: params,

                /*
                 Caching is set to false to enforce distinction between logged in users and guests. The API doesn't
                 support tokens yet.
                 */
                cache: false
            };

            let isCancelled = false;

            if (angular.isObject(cancel) && cancel.promise) {
                options.timeout = cancel.promise;
                options.timeout.then(() => isCancelled = true);
            }

            return $http(options)
                .then(response => response.data)
                .finally(() => {
                    if (options.timeout && !isCancelled) {
                        cancel.reject();
                    }
                });
        }

        function getByUri (uri, params) {
            return getByUrl(sharedConfig.API_ROOT + uri, params);
        }
    }
})();
