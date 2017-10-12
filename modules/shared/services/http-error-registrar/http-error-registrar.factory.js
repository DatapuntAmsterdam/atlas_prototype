(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('httpErrorRegistrar', httpErrorRegistrarFactory)
        .config($httpProvider => $httpProvider.interceptors.push('httpErrorRegistrar'));

    httpErrorRegistrarFactory.inject = [
        '$log',
        '$rootScope',
        '$window',
        '$q',
        '$interval',
        'httpStatus',
        'Raven'];

    function httpErrorRegistrarFactory (
        $log,
        $rootScope,
        $window,
        $q,
        $interval,
        httpStatus,
        Raven
    ) {
        $window.addEventListener('error', function (e) {
            if (e.target && e.target.src) {
                // URL load error
                if (e.target.src === 'https://piwik.data.amsterdam.nl/piwik.js') {
                    // Don't show UI error
                    $log.error('piwik load error', e);
                    return;
                }

                $rootScope.$applyAsync(() => {
                    registerServerError();
                    logResponse('HTTP external request error');
                });
            }
        }, true);

        return {
            responseError
        };

        function logResponse (message, statusCode) {
            Raven.captureMessage(new Error(message), { tags: { statusCode } });
        }

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
                            angular.noop, // request has been cancelled by resolving the timeout
                            () => { // Abnormal end of request
                                registerServerError();
                                logResponse('HTTP request ended abnormally', response.status);
                            }
                        );
                    } else {
                        isServerError = true;
                    }
                }

                if (isServerError) {
                    registerServerError();
                    logResponse('HTTP 5xx response', response.status);
                } else if (isClientError) {
                    if (response.status === 401) {
                        $window.auth.logout();
                    } else if (response && response.data && response.data.detail === 'Not found.') {
                        registerNotFoundError();
                        logResponse('HTTP response body: Not found.', response.status);
                    } else {
                        registerServerError();
                        logResponse('HTTP 4xx response', response.status);
                    }
                }
            }, 0, 1);

            return $q.reject(response);
        }
    }
})();
