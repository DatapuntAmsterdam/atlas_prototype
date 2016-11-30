(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('api', apiFactory);

    apiFactory.$inject = ['$http', 'httpStatus', 'user', 'environment'];

    function apiFactory ($http, httpStatus, user, environment) {
        return {
            getByUrl,
            getByUri
        };

        /**
         *
         * @param url
         * @param params
         * @param cancel - an optional promise ($q.defer()) to be able to cancel the request
         * @returns {*|Promise.<TResult>}
         */
        function getByUrl (url, params, cancel) {
            let headers = {},
                userState = user.getStatus();

            if (userState.isLoggedIn) {
                headers.Authorization = 'JWT ' + userState.accessToken;
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

            if (angular.isObject(cancel) && cancel.promise) {
                options.timeout = cancel.promise;
                options.timeout.finally(() => httpStatus.registerCancel(options));
            }

            return $http(options).then(response => response.data);
        }

        function getByUri (uri, params) {
            return getByUrl(environment.API_ROOT + uri, params);
        }
    }
})();
