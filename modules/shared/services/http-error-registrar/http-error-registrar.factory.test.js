import { ERROR_TYPES } from '../../../../src/shared/ducks/error/error-message'

describe('The http error registrar', () => {
  const FLUSH_PERIOD = 1
  let httpStatus

  let $httpBackend
  let $http
  let $interval
  let mockedData
  let callbackCalled
  let $window
  let origAuth

  beforeEach(() => {
    httpStatus = {
      logResponse: jasmine.createSpy(),
      registerError: jasmine.createSpy(),
    }

    angular.mock.module('dpShared', { httpStatus })

    angular.mock.inject(function (_$httpBackend_, _$http_, _$interval_, _$window_) {
      $httpBackend = _$httpBackend_
      $http = _$http_
      $interval = _$interval_
      $window = _$window_
    })

    origAuth = $window.auth
    $window.auth = {
      logout: angular.noop,
      initialize: angular.noop,
    }

    mockedData = {
      Key: 'Value',
    }
    callbackCalled = false

    $httpBackend.whenGET('http://api-domain.amsterdam.nl/200').respond(200, mockedData)

    $httpBackend.whenGET('http://api-domain.amsterdam.nl/300').respond(300, mockedData)

    $httpBackend.whenGET('http://api-domain.amsterdam.nl/400').respond(400, mockedData)

    $httpBackend.whenGET('http://api-domain.amsterdam.nl/401').respond(401, mockedData)

    $httpBackend.whenGET('http://api-domain.amsterdam.nl/404').respond(404, mockedData)

    $httpBackend.whenGET('http://api-domain.amsterdam.nl/500').respond(500, mockedData)

    $httpBackend.whenGET('http://api-domain.amsterdam.nl/-1').respond(-1, mockedData)

    spyOn($window.auth, 'logout')
    spyOn($window.auth, 'initialize')
  })

  afterEach(() => {
    $window.auth = origAuth
  })

  it('does not handle normal responses and requests', () => {
    $http.get('http://api-domain.amsterdam.nl/200').then((data) => {
      expect(data.data).toEqual(mockedData)
      expect(data.status).toBe(200)
      callbackCalled = true
    })

    $httpBackend.flush()
    $interval.flush()

    expect(httpStatus.registerError).not.toHaveBeenCalled()
    expect(callbackCalled).toBe(true)
  })

  it('does not handle an error that has already been handled locally', () => {
    $http.get('http://api-domain.amsterdam.nl/404').catch((data) => {
      // Mark the error to be handled
      data.errorHandled = true
      callbackCalled = true
    })

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).not.toHaveBeenCalled()
    expect(httpStatus.logResponse).not.toHaveBeenCalled()
    expect(callbackCalled).toBe(true)
  })

  it('performs logout on 401: unauthenticated', () => {
    $http.get('http://api-domain.amsterdam.nl/401')

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).not.toHaveBeenCalled()
    expect(httpStatus.logResponse).not.toHaveBeenCalled()
    expect($window.auth.logout).toHaveBeenCalled()
  })

  it('logs response errors outside of the 400 and 500 ranges', () => {
    const url = 'http://api-domain.amsterdam.nl/300'
    $http.get(url)

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).not.toHaveBeenCalled()
    expect(httpStatus.logResponse).toHaveBeenCalledWith(`Unkown HTTP response error, ${url}`, 300)
  })

  it('handles client error responses and requests', () => {
    const url = 'http://api-domain.amsterdam.nl/400'
    $http.get(url)

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).toHaveBeenCalledWith(ERROR_TYPES.GENERAL_ERROR)
    expect(httpStatus.logResponse).toHaveBeenCalledWith(`HTTP 4xx response, ${url}`, 400)
  })

  it('handles 404 error', () => {
    const url = 'http://api-domain.amsterdam.nl/404'
    $http.get(url)

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).toHaveBeenCalledWith(ERROR_TYPES.NOT_FOUND_ERROR)
    expect(httpStatus.logResponse).toHaveBeenCalledWith(`HTTP 404 response, ${url}`, 404)
  })

  it('registers all http server error responses, leaves content untouched', () => {
    const url = 'http://api-domain.amsterdam.nl/500'
    $http.get(url)

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).toHaveBeenCalledWith(ERROR_TYPES.GENERAL_ERROR)
    expect(httpStatus.logResponse).toHaveBeenCalledWith(`HTTP 5xx response, ${url}`, 500)
  })

  it('registers http server error -1 for non-cancellable responses', () => {
    const url = 'http://api-domain.amsterdam.nl/-1'
    $http.get(url)

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).toHaveBeenCalledWith(ERROR_TYPES.GENERAL_ERROR)
    expect(httpStatus.logResponse).toHaveBeenCalledWith(`HTTP request ended abnormally, ${url}`, -1)
  })

  it('registers http server error -1 for non-cancelled responses', () => {
    const url = 'http://api-domain.amsterdam.nl/-1'
    $http({
      method: 'GET',
      url,
      timeout: {
        then: (resolve, reject) => {
          if (angular.isFunction(reject)) {
            reject()
          }
        },
      },
    }).catch((data) => {
      expect(data.data).toEqual(mockedData)
      expect(data.status).toBe(-1)
      callbackCalled = true
    })

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).toHaveBeenCalledWith(ERROR_TYPES.GENERAL_ERROR)
    expect(httpStatus.logResponse).toHaveBeenCalledWith(
      `HTTP timeout request ended abnormally, ${url}`,
      -1,
    )
    expect(callbackCalled).toBe(true)
  })

  it('skips error handler for cancelled responses', () => {
    const url = 'http://api-domain.amsterdam.nl/-1'
    $http({
      method: 'GET',
      url,
      timeout: {
        then: angular.noop,
      },
    }).catch((data) => {
      expect(data.data).toEqual(mockedData)
      expect(data.status).toBe(-1)
      callbackCalled = true
    })

    $httpBackend.flush()
    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).not.toHaveBeenCalled()
    expect(httpStatus.logResponse).not.toHaveBeenCalled()
    expect(callbackCalled).toBe(true)
  })

  it('calls the local error handler before the global one', () => {
    const url = 'http://api-domain.amsterdam.nl/404'
    $http.get(url).catch(() => {
      callbackCalled = true
    })

    expect(callbackCalled).toBe(false)

    $httpBackend.flush()

    expect(httpStatus.registerError).not.toHaveBeenCalled()
    expect(httpStatus.logResponse).not.toHaveBeenCalled()
    expect(callbackCalled).toBe(true)

    $interval.flush(FLUSH_PERIOD)

    expect(httpStatus.registerError).toHaveBeenCalledWith(ERROR_TYPES.NOT_FOUND_ERROR)
  })
})
