(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('httpInterceptor', httpInterceptorFactory)
        .config($httpProvider => $httpProvider.interceptors.push('httpInterceptor'));

    httpInterceptorFactory.inject = ['$q', 'httpStatus'];

    function httpInterceptorFactory ($q, httpStatus) {
        return {
            responseError
        };

        function responseError (response) {
            // register server errors (5xx) and client errors (4xx)
            let isServerError = response.status <= 0 || (500 <= response.status && response.status <= 599),
                isClientError = 400 <= response.status && response.status <= 499;

            if (isServerError) {
                httpStatus.registerError(httpStatus.SERVER_ERROR);
            } else if (isClientError && response && response.data && response.data.detail === 'Not found.') {
                httpStatus.registerError(httpStatus.NOT_FOUND_ERROR);
            }
            return $q.reject(response);
        }
    }
})();
