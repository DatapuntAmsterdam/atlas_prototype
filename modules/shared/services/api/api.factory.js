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

        function getWithToken (url, params, cancel, token) {
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

        /**
         *
         * @param {string} url
         * @param {Object} params
         * @param {Promise} cancel - an optional promise ($q.defer()) to be able to cancel the request
         * @returns {Promise}
         */
        function getByUrl (url, params, cancel) {
            let token = user.getAccessToken();
            if (token) {
                return getWithToken(url, params, cancel, token);
            } else if (user.getRefreshToken()) {
                // user is logging in, refresh token is available, access token not yet
                const defer = $q.defer();
                const interval = $interval(() => {
                    token = user.getAccessToken();
                    if (!user.getRefreshToken() || token) {
                        // Refresh token was invalid or access token has been received
                        $interval.cancel(interval);
                        defer.resolve(getWithToken(url, params, cancel, token));
                    }
                }, 250, 20);    // try every 1/4 second, for max 20 * 250 = 5 seconds

                // On interval ends resolve without a token
                interval.then(() => defer.resolve(getWithToken(url, params, cancel, null)));

                return defer.promise;
            } else {
                return getWithToken(url, params, cancel, null);
            }
        }

        function getByUri (uri, params) {
            return getByUrl(sharedConfig.API_ROOT + uri, params);
        }
    }
})();
