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
            let isServerError = 500 <= response.status && response.status <= 599,
                isClientError = 400 <= response.status && response.status <= 499;

            if (response.status <= 0) {
                // Check if the error is due to a cancelled http request
                isServerError = !(angular.isFunction(response.config.isCancelled) && response.config.isCancelled());
            }

            if (isServerError) {
                httpStatus.registerError(httpStatus.SERVER_ERROR);
            } else if (isClientError && response && response.data && response.data.detail === 'Not found.') {
                httpStatus.registerError(httpStatus.NOT_FOUND_ERROR);
            }
            return $q.reject(response);
        }
    }
})();
