import { ERROR_TYPES } from '../../../../src/shared/ducks/error/error-message'
import { logout } from '../../../../src/shared/services/auth/auth'
;(function () {
  angular
    .module('dpShared')
    .factory('httpErrorRegistrar', httpErrorRegistrarFactory)
    .config([
      '$httpProvider',
      // eslint-disable-next-line angular/di
      ($httpProvider) => $httpProvider.interceptors.push('httpErrorRegistrar'),
    ])

  httpErrorRegistrarFactory.$inject = ['$interval', '$q', '$window', 'httpStatus']

  function httpErrorRegistrarFactory($interval, $q, $window, httpStatus) {
    return {
      // magic Angular interceptor keyword, don't change name!
      // see: https://docs.angularjs.org/api/ng/service/$http#interceptors
      responseError,
    }

    function logResponse(message, url, statusCode) {
      httpStatus.logResponse(`${message}, ${url}`, statusCode)
    }

    function responseError(response) {
      // Give the local response handler the time to handle an error
      // itself. See:
      // https://stackoverflow.com/questions/33605486/
      // handle-angular-http-errors-locally-with-fallback-to-global-error-handling
      $interval(
        // eslint-disable-next-line complexity
        () => {
          const statusCode = response.status

          if (response.errorHandled) {
            // error handled by local code, no need to apply global error handling
            return
          }

          if (statusCode === 401) {
            logout()
            return
          }

          const url = response.config && response.config.url
          let message
          if (statusCode <= 0) {
            // Check if the error is due to a cancelled http request
            // e.g.: statusCode === -1 when the connection is dropped
            if (response.config.timeout && angular.isFunction(response.config.timeout.then)) {
              response.config.timeout.then(
                angular.noop, // request has been cancelled by resolving the timeout
                () => {
                  // Abnormal end of request
                  httpStatus.registerError(ERROR_TYPES.GENERAL_ERROR)
                  logResponse('HTTP timeout request ended abnormally', url, statusCode)
                },
              )
              return
            }
            httpStatus.registerError(ERROR_TYPES.GENERAL_ERROR)
            message = 'HTTP request ended abnormally'
          } else if (statusCode >= 500 && statusCode <= 599) {
            // server error
            httpStatus.registerError(ERROR_TYPES.GENERAL_ERROR)
            message = 'HTTP 5xx response'
          } else if (statusCode === 404) {
            httpStatus.registerError(ERROR_TYPES.NOT_FOUND_ERROR)
            message = 'HTTP 404 response'
          } else if (statusCode >= 400 && statusCode <= 499) {
            // general client error
            httpStatus.registerError(ERROR_TYPES.GENERAL_ERROR)
            message = 'HTTP 4xx response'
          } else {
            message = 'Unkown HTTP response error'
          }

          logResponse(message, url, statusCode)
        },
        0,
        1,
      )

      return $q.reject(response)
    }
  }
})()
