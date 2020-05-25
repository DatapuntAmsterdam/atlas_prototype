import angular from 'angular'
import { encodeQueryParams } from '../../../../src/shared/services/query-string-parser/query-string-parser'
import SHARED_CONFIG from '../../../../src/shared/services/shared-config/shared-config'

angular.module('dpShared').factory('api', apiFactory)

apiFactory.$inject = ['$injector', '$interval', '$q', '$http']

function apiFactory($injector, $interval, $q, $http) {
  let store

  return {
    getByUrl,
    getByUri,
    createUrlWithToken,
  }

  function getAccessToken() {
    store = store || $injector.get('store')
    return store.getState().user.accessToken
  }

  function getWithToken(url, params, cancel, token) {
    const maxAttempts = 3
    const attemptInterval = 100
    const headers = {}

    if (token) {
      headers.Authorization = SHARED_CONFIG.AUTH_HEADER_PREFIX + token
    }

    const options = {
      method: 'GET',
      url,
      headers,
      params,
      cache: true,
    }

    let isCancelled = false

    if (angular.isObject(cancel) && cancel.promise) {
      options.timeout = cancel.promise
      options.timeout.then(() => (isCancelled = true))
    }

    const deferred = $q.defer()

    recursiveRequest(1)

    return deferred.promise

    function recursiveRequest(attempt) {
      $http(options)
        .then(
          (response) => deferred.resolve(response.data),
          (rejection) => {
            if (attempt < maxAttempts && (rejection.status < 200 || rejection.status >= 300)) {
              rejection.errorHandled = true
              $interval(
                () => {
                  recursiveRequest(attempt + 1)
                },
                attemptInterval,
                1,
              )
            } else {
              deferred.reject(rejection)
            }
          },
        )
        .finally(() => {
          if (options.timeout && !isCancelled) {
            cancel.reject()
          }
        })
    }
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
  function createUrlWithToken(url, params) {
    const token = getAccessToken()

    params = params || {}
    if (token) {
      params.access_token = token
    }

    const queryStart = url.indexOf('?') !== -1 ? '&' : '?'
    const paramString = encodeQueryParams(params)
    const queryString = paramString ? queryStart + paramString : ''

    return $q.resolve(url + queryString)
  }

  /**
   *
   * @param {string} url
   * @param {Object} params
   * @param {Promise} cancel - an optional promise ($q.defer()) to be able to cancel the request
   * @param {bool} withToken - Send the user token along with the request if it exists
   * @returns {Promise}
   */
  function getByUrl(url, params, cancel, withToken = true) {
    const token = withToken ? getAccessToken() : null
    return $q.resolve(getWithToken(url, params, cancel, token))
  }

  function getByUri(uri, params) {
    return getByUrl(process.env.API_ROOT + uri, params, undefined)
  }
}
