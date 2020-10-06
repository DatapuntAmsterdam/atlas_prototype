import angular from 'angular'
import { setGlobalError } from '../../../../src/shared/ducks/error/error-message'

angular.module('dpShared').factory('httpStatus', httpStatusFactory)

httpStatusFactory.$inject = ['$window']

function httpStatusFactory($window) {
  return {
    logResponse,
    registerError,
  }

  function logResponse(message, statusCode) {
    // Todo: DP-6286 - Add sentry back, log to sentry
    console.warn(message, statusCode) // eslint-disable-line no-console,angular/log
  }

  function registerError(errorType) {
    const dispatch = $window?.reduxStore?.dispatch

    if (dispatch) {
      dispatch(setGlobalError(errorType))
    }
  }
}
