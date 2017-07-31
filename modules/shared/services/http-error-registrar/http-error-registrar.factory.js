((() => {
    'use strict';

    angular
        .module('dpShared')
        .factory('httpErrorRegistrar', httpErrorRegistrarFactory)
        .config($httpProvider => $httpProvider.interceptors.push('httpErrorRegistrar'));

    httpErrorRegistrarFactory.inject = ['$log', '$rootScope', '$window', '$q', '$interval', 'httpStatus'];

    function httpErrorRegistrarFactory ($log, $rootScope, $window, $q, $interval, httpStatus) {
        $window.addEventListener('error', e => {
            if (e.target && e.target.src) {
                // URL load error
                if (e.target.src === 'https://piwik.data.amsterdam.nl/piwik.js') {
                    // Don't show UI error
                    $log.error('piwik load error', e);
                    return;
                }

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
            // Give the local response handler the time to handle an error
            // itself. See:
            // https://stackoverflow.com/questions/33605486/
            // handle-angular-http-errors-locally-with-fallback-to-global-error-handling
            $interval(() => {
                // Check if the error has already been handled locally
                const errorHandled = response.errorHandled;

                // register server errors (5xx) and client errors (4xx)
                let isServerError = !errorHandled && 500 <= response.status && response.status <= 599;
                const isClientError = !errorHandled && 400 <= response.status && response.status <= 499;

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
                } else if (isClientError) {
                    if (response && response.data && response.data.detail === 'Not found.') {
                        registerNotFoundError();
                    } else {
                        registerServerError();
                    }
                }
            }, 0, 1);

            return $q.reject(response);
        }
    }
}))();
