import environment from '../../../../src/environment'

describe('The api factory', function () {
  let $rootScope
  let $interval
  let $http
  let $httpBackend
  let $cacheFactory
  let $q
  let api
  let mockedApiData
  let isLoggedIn
  let clearHttpCache

  const mockUrl1 = `${environment.API_ROOT}bag/verblijfsobject/123/`
  const mockUrl2 = `${environment.API_ROOT}bag/verblijfsobject/456/`

  beforeEach(function () {
    angular.mock.module('dpShared', {
      sharedConfig: {
        AUTH_HEADER_PREFIX: 'Bearer ',
      },
      store: {
        getState: () => {
          return {
            user: {
              accessToken: isLoggedIn ? 'MY_FAKE_ACCESS_TOKEN' : null,
            },
          }
        },
      },
    })

    angular.mock.inject(function (
      _$rootScope_,
      _$interval_,
      _$http_,
      _$httpBackend_,
      _$cacheFactory_,
      _$q_,
      _api_,
    ) {
      $rootScope = _$rootScope_
      $interval = _$interval_
      $http = _$http_
      $httpBackend = _$httpBackend_
      $cacheFactory = _$cacheFactory_
      $q = _$q_
      api = _api_
    })

    mockedApiData = {
      id: 1,
      title: 'This is a fake title',
    }

    $httpBackend.whenGET(mockUrl1).respond(mockedApiData)

    isLoggedIn = false

    clearHttpCache = function () {
      // Clearing the cache whenever authorization level is lowered
      $cacheFactory.get('$http').removeAll()
    }
  })

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
    clearHttpCache()
  })

  it('getByUrl returns the data as a promise', function () {
    let returnValue

    api.getByUrl(mockUrl1).then(function (data) {
      returnValue = data
    })

    $httpBackend.flush()

    expect(returnValue).toEqual(mockedApiData)
  })

  it('getByUrl optionally accepts a promise to allow for cancelling the request', function () {
    const cancel = $q.defer()

    api.getByUrl(mockUrl1, undefined, cancel).then(function () {
      fail() // Should never be resolved
    })

    cancel.resolve()
    $httpBackend.verifyNoOutstandingRequest()
  })

  it('getByUrl optionally accepts a promise, rejects the promise when the request is not cancelled', function () {
    let returnValue
    const cancel = $q.defer()

    api.getByUrl(mockUrl1, undefined, cancel).then(function (data) {
      returnValue = data
    })

    let isRejected = false
    cancel.promise.then(angular.noop, () => (isRejected = true))

    $httpBackend.flush()

    expect(returnValue).toEqual(mockedApiData)
    expect(isRejected).toBe(true)
  })

  it('getByUri can be used when the API ROOT is unknown', function () {
    let returnValue

    api.getByUri('bag/verblijfsobject/123/').then(function (data) {
      returnValue = data
    })

    $httpBackend.flush()

    expect(returnValue).toEqual(mockedApiData)
  })

  it('does not add an Authorization header if the user is not logged in', function () {
    // Not logged in
    isLoggedIn = false

    $httpBackend.expectGET(mockUrl1, $http.defaults.headers.common)
    api.getByUrl(mockUrl1)
    $httpBackend.flush()
  })

  it('adds an Authorization header if the user is logged in', function () {
    // Logged in
    isLoggedIn = true
    $httpBackend.expectGET(
      mockUrl1,
      angular.merge({}, $http.defaults.headers.common, {
        Authorization: 'Bearer MY_FAKE_ACCESS_TOKEN',
      }),
    )
    api.getByUrl(mockUrl1)
    $httpBackend.flush()
  })

  it('does not add an Authorization header if specified not to', function () {
    // Logged in
    isLoggedIn = true

    $httpBackend.expectGET(mockUrl1, $http.defaults.headers.common)
    api.getByUrl(mockUrl1, null, null, false)
    $httpBackend.flush()
  })

  describe('generating a URL with an access token', () => {
    it('adds the access token when logged in', () => {
      isLoggedIn = true
      api.createUrlWithToken('https://test.amsterdam.nl/').then((actual) => {
        expect(actual).toBe('https://test.amsterdam.nl/?access_token=MY_FAKE_ACCESS_TOKEN')
      })

      api.createUrlWithToken('https://test.amsterdam.nl/?a=b').then((actual) => {
        expect(actual).toBe('https://test.amsterdam.nl/?a=b&access_token=MY_FAKE_ACCESS_TOKEN')
      })

      $rootScope.$digest()
    })

    it('does not add the access token when not logged in', () => {
      isLoggedIn = false

      api.createUrlWithToken('https://test.amsterdam.nl/').then((actual) => {
        expect(actual).toBe('https://test.amsterdam.nl/')
      })

      api.createUrlWithToken('https://test.amsterdam.nl/?a=b').then((actual) => {
        expect(actual).toBe('https://test.amsterdam.nl/?a=b')
      })

      $rootScope.$digest()
    })

    it('adds extra params to the url when specified', () => {
      isLoggedIn = false

      api.createUrlWithToken('https://test.amsterdam.nl/', { c: 'd' }).then((actual) => {
        expect(actual).toBe('https://test.amsterdam.nl/?c=d')
      })

      api.createUrlWithToken('https://test.amsterdam.nl/?a=b', { c: 'd' }).then((actual) => {
        expect(actual).toBe('https://test.amsterdam.nl/?a=b&c=d')
      })

      $rootScope.$digest()
    })
  })

  describe('retrying a failed request', () => {
    it('succeeds after the second try', () => {
      let returnValue

      const getRequest = $httpBackend.whenGET(mockUrl2)
      getRequest.respond(500, 'ERROR')

      api.getByUri('bag/verblijfsobject/456/').then(function (data) {
        returnValue = data
      })

      $httpBackend.flush()
      expect(returnValue).not.toEqual(mockedApiData)

      getRequest.respond(mockedApiData)

      $interval.flush(100)
      $httpBackend.flush()
      expect(returnValue).toEqual(mockedApiData)
    })

    it('succeeds after the third try', () => {
      let returnValue

      const getRequest = $httpBackend.whenGET(mockUrl2)
      getRequest.respond(500, 'ERROR')

      api.getByUri('bag/verblijfsobject/456/').then(function (data) {
        returnValue = data
      })

      $httpBackend.flush()
      expect(returnValue).not.toEqual(mockedApiData)

      $interval.flush(100)
      $httpBackend.flush()
      expect(returnValue).not.toEqual(mockedApiData)

      getRequest.respond(mockedApiData)

      $interval.flush(100)
      $httpBackend.flush()
      expect(returnValue).toEqual(mockedApiData)
    })

    it('gives up after the third try fails', () => {
      let returnValue

      const getRequest = $httpBackend.whenGET(mockUrl2)
      getRequest.respond(500, 'ERROR')

      api.getByUri('bag/verblijfsobject/456/').then(function (data) {
        returnValue = data
      })

      $httpBackend.flush()
      expect(returnValue).not.toEqual(mockedApiData)

      $interval.flush(100)
      $httpBackend.flush()
      expect(returnValue).not.toEqual(mockedApiData)

      $interval.flush(100)
      $httpBackend.flush()
      expect(returnValue).not.toEqual(mockedApiData)

      getRequest.respond(mockedApiData)

      $interval.flush(100)
      $httpBackend.verifyNoOutstandingRequest()
      expect(returnValue).not.toEqual(mockedApiData)
    })
  })
})
