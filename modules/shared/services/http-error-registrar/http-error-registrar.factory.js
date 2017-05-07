(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('httpErrorRegistrar', httpErrorRegistrarFactory)
        .config($httpProvider => $httpProvider.interceptors.push('httpErrorRegistrar'));

    httpErrorRegistrarFactory.inject = ['$rootScope', '$window', '$q', 'httpStatus'];

    function httpErrorRegistrarFactory ($rootScope, $window, $q, httpStatus) {
        $window.addEventListener('error', function (e) {
            if (e.target && e.target.src) {
                // URL load error
                $rootScope.$applyAsync(registerServerError);
            }
        }, true);

        return {
            responseError
        };

        function registerServerError () {
            httpStatus.registerError(httpStatus.SERVER_ERROR);
        }

        function registerNotFoundError () {
            httpStatus.registerError(httpStatus.NOT_FOUND_ERROR);
        }

        function responseError (response) {
            // register server errors (5xx) and client errors (4xx)
            let isServerError = 500 <= response.status && response.status <= 599;
            const isClientError = 400 <= response.status && response.status <= 499;

            if (response.status <= 0) {
                // Check if the error is due to a cancelled http request
                if (response.config.timeout && angular.isFunction(response.config.timeout.then)) {
                    response.config.timeout.then(
                        angular.noop,   // request has been cancelled by resolving the timeout
                        registerServerError // Abnormal end of request
                    );
                } else {
                    isServerError = true;
                }
            }

            if (isServerError) {
                registerServerError();
            } else if (isClientError && response && response.data && response.data.detail === 'Not found.') {
                registerNotFoundError();
            }

            return $q.reject(response);
        }
    }
})();
