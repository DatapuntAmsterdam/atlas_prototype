(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('api', apiFactory);

    apiFactory.$inject = ['$injector', '$interval', '$q', '$http', '$window', 'sharedConfig'];

    function apiFactory ($injector, $interval, $q, $http, $window, sharedConfig) {
        let store;

        return {
            getByUrl,
            getByUri,
            createUrlWithToken
        };

        function getAccessToken () {
            store = store || $injector.get('store');
            return store.getState().user.accessToken;
        }

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
                cache: true
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
         * Returns the URL specified with the access token added to the query
         * sting when available. Additional parameters can be specified in an
         * object which will be added to the query string as well.
         *
         * It will return a promise because getting the access token goes via a
         * promise as well.
         *
         * @param {string} url
         * @param {Object} [params] Additional query parameters.
         * @returns {Promise} The URL with the params and token added as query
         * string.
         */
        function createUrlWithToken (url, params) {
            const token = getAccessToken();

            params = params || {};
            if (token) {
                params.access_token = token;
            }

            const queryStart = url.indexOf('?') !== -1 ? '&' : '?',
                paramString = encodeQueryParams(params),
                queryString = paramString ? queryStart + paramString : '';

            return $q.resolve(url + queryString);
        }

        /**
         *
         * @param {string} url
         * @param {Object} params
         * @param {Promise} cancel - an optional promise ($q.defer()) to be able to cancel the request
         * @returns {Promise}
         */
        function getByUrl (url, params, cancel) {
            const token = getAccessToken();
            return $q.resolve(getWithToken(url, params, cancel, token));
        }

        function getByUri (uri, params) {
            return getByUrl(sharedConfig.API_ROOT + uri, params);
        }

        function encodeQueryParams (params) {
            return Object.keys(params)
                .map(param => encodeURIComponent(param) + '=' + encodeURIComponent(params[param]))
                .join('&');
        }
    }
})();
