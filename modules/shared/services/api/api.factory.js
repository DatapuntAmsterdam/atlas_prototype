(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('api', apiFactory);

    apiFactory.$inject = ['$http', 'user', 'sharedConfig'];

    function apiFactory ($http, user, sharedConfig) {
        return {
            getByUrl,
            getByUri
        };

        /**
         *
         * @param {string} url
         * @param {Object} params
         * @param {Promise} cancel - an optional promise ($q.defer()) to be able to cancel the request
         * @returns {Promise}
         */
        function getByUrl (url, params, cancel) {
            let headers = {};

            let token = user.getAccessToken();
            if (token) {
                headers.Authorization = sharedConfig.AUTH_HEADER_PREFIX + token;
            }

            let options = {
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
