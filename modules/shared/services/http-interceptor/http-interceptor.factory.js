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
            // register server errors (5xx)
            let isServerError = 500 <= response.status && response.status <= 599;

            if (isServerError) {
                httpStatus.registerError();
            }
            return $q.reject(response);
        }
    }
})();
