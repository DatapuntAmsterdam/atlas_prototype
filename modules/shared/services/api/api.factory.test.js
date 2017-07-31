describe('The api factory', () => {
    var $rootScope,
        $http,
        $httpBackend,
        $cacheFactory,
        $q,
        api,
        mockedApiData,
        user,
        isLoggedIn,
        clearHttpCache;

    beforeEach(() => {
        angular.mock.module(
            'dpShared',
            {
                user: {
                    getAccessToken: () => isLoggedIn ? 'MY_FAKE_ACCESS_TOKEN' : null,
                    waitForAccessToken: () => $q.resolve(user.getAccessToken()),
                    getRefreshToken: angular.noop
                },
                sharedConfig: {
                    API_ROOT: 'https://www.i-am-the-api-root.com/path/',
                    AUTH_HEADER_PREFIX: 'Bearer '
                }
            }
        );

        angular.mock.inject((
            _$rootScope_,
            _$http_,
            _$httpBackend_,
            _$cacheFactory_,
            _$q_,
            _api_,
            _user_
        ) => {
            $rootScope = _$rootScope_;
            $http = _$http_;
            $httpBackend = _$httpBackend_;
            $cacheFactory = _$cacheFactory_;
            $q = _$q_;
            api = _api_;
            user = _user_;
        });

        mockedApiData = {
            id: 1,
            title: 'This is a fake title'
        };

        $httpBackend.whenGET('https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/').respond(mockedApiData);

        isLoggedIn = false;

        clearHttpCache = () => {
            // Clearing the cache whenever authorization level is lowered
            $cacheFactory.get('$http').removeAll();
        };
    });

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        clearHttpCache();
    });

    it('getByUrl returns the data as a promise', () => {
        var returnValue;

        api.getByUrl('https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/').then(data => {
            returnValue = data;
        });

        $httpBackend.flush();

        expect(returnValue).toEqual(mockedApiData);
    });

    it('getByUrl optionally accepts a promise to allow for cancelling the request', () => {
        const cancel = $q.defer();

        api.getByUrl('https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/', undefined, cancel)
            .then(() => {
                fail();   // Should never be resolved
            });

        cancel.resolve();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('getByUrl optionally accepts a promise, rejects the promise when the request is not cancelled', () => {
        var returnValue;
        const cancel = $q.defer();

        api.getByUrl('https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/', undefined, cancel)
            .then(data => {
                returnValue = data;
            });

        let isRejected = false;
        cancel.promise.then(angular.noop, () => isRejected = true);

        $httpBackend.flush();

        expect(returnValue).toEqual(mockedApiData);
        expect(isRejected).toBe(true);
    });

    it('getByUri can be used when the API ROOT is unknown', () => {
        var returnValue;

        api.getByUri('bag/verblijfsobject/123/').then(data => {
            returnValue = data;
        });

        $httpBackend.flush();

        expect(returnValue).toEqual(mockedApiData);
    });

    it('does not add an Authorization header if the user is not logged in', () => {
        // Not logged in
        isLoggedIn = false;

        $httpBackend.expectGET(
            'https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/',
            $http.defaults.headers.common
        );
        api.getByUrl('https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/');
        $httpBackend.flush();
    });

    it('adds an Authorization header if the user is logged in', () => {
        // Logged in
        isLoggedIn = true;
        $httpBackend.expectGET(
            'https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/',
            angular.merge({}, $http.defaults.headers.common, {Authorization: 'Bearer MY_FAKE_ACCESS_TOKEN'})
        );
        api.getByUrl('https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/');
        $httpBackend.flush();
    });

    describe('generating a URL with an access token', () => {
        it('adds the access token when logged in', () => {
            isLoggedIn = true;
            api.createUrlWithToken('https://test.amsterdam.nl/').then(actual => {
                expect(actual).toBe('https://test.amsterdam.nl/?access_token=MY_FAKE_ACCESS_TOKEN');
            });

            api.createUrlWithToken('https://test.amsterdam.nl/?a=b').then(actual => {
                expect(actual).toBe('https://test.amsterdam.nl/?a=b&access_token=MY_FAKE_ACCESS_TOKEN');
            });

            $rootScope.$digest();
        });

        it('does not add the access token when not logged in', () => {
            isLoggedIn = false;

            api.createUrlWithToken('https://test.amsterdam.nl/').then(actual => {
                expect(actual).toBe('https://test.amsterdam.nl/');
            });

            api.createUrlWithToken('https://test.amsterdam.nl/?a=b').then(actual => {
                expect(actual).toBe('https://test.amsterdam.nl/?a=b');
            });

            $rootScope.$digest();
        });

        it('adds extra params to the url when specified', () => {
            isLoggedIn = false;

            api.createUrlWithToken('https://test.amsterdam.nl/', {c: 'd'}).then(actual => {
                expect(actual).toBe('https://test.amsterdam.nl/?c=d');
            });

            api.createUrlWithToken('https://test.amsterdam.nl/?a=b', {c: 'd'}).then(actual => {
                expect(actual).toBe('https://test.amsterdam.nl/?a=b&c=d');
            });

            $rootScope.$digest();
        });
    });
});
