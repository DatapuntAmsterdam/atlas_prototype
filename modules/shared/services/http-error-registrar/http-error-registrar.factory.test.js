describe('The http error registrar', function () {
    const FLUSH_PERIOD = 1;
    const httpStatus = {
        SERVER_ERROR: 'SERVER_ERROR',
        NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
        registerError: angular.noop
    };
    const Raven = { captureMessage: angular.noop };

    let $httpBackend,
        $http,
        $rootScope,
        $interval,
        mockedData,
        onError,
        callbackCalled,
        $window,
        origAuth;

    beforeEach(function () {
        onError = null;
        const window = {
            addEventListener: function (type, func) {
                if (type === 'error') {
                    onError = func;
                }
            }
        };

        angular.mock.module('dpShared', { httpStatus, Raven });

        angular.mock.module(function ($provide) {
            $provide.value('$window', window);
        });

        angular.mock.inject(function (_$httpBackend_, _$http_, _$rootScope_, _$interval_, _$window_) {
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            $rootScope = _$rootScope_;
            $interval = _$interval_;
            $window = _$window_;
        });

        origAuth = $window.auth;
        $window.auth = {
            logout: angular.noop,
            initialize: angular.noop
        };

        mockedData = {
            Key: 'Value'
        };
        callbackCalled = false;

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/200')
            .respond(200, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/300')
            .respond(300, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/400')
            .respond(400, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/401')
            .respond(401, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/500')
            .respond(500, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/-1')
            .respond(-1, mockedData);

        spyOn(httpStatus, 'registerError');
        spyOn(Raven, 'captureMessage');
        spyOn($window.auth, 'logout');
        spyOn($window.auth, 'initialize');
    });

    afterEach(() => {
        $window.auth = origAuth;
    });

    it('does not handle normal responses and requests', function () {
        $http
            .get('http://api-domain.amsterdam.nl/200')
            .then(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(200);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush();

        expect(httpStatus.registerError).not.toHaveBeenCalled();
        expect(Raven.captureMessage).not.toHaveBeenCalled();
        expect(callbackCalled).toBe(true);
    });

    it('does not handle response errors outside of the 400 and 500 ranges', function () {
        $http
            .get('http://api-domain.amsterdam.nl/300')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(300);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).not.toHaveBeenCalled();
        expect(Raven.captureMessage).not.toHaveBeenCalled();
        expect(callbackCalled).toBe(true);
    });

    it('does handle client error responses and requests', function () {
        $http
            .get('http://api-domain.amsterdam.nl/400')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(400);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
        expect(Raven.captureMessage).toHaveBeenCalledWith(
            jasmine.stringMatching('HTTP 4xx response'),
            { tags: { statusCode: 400 } });
        expect(callbackCalled).toBe(true);
    });

    it('does handle 401 errors', function () {
        $http
            .get('http://api-domain.amsterdam.nl/401')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(401);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).not.toHaveBeenCalled();
        expect(Raven.captureMessage).not.toHaveBeenCalled();
        expect($window.auth.logout).toHaveBeenCalled();
        expect(callbackCalled).toBe(true);
    });

    it('does handle 404 errors with the correct body', function () {
        mockedData = {
            detail: 'Not found.'
        };

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/404')
            .respond(404, mockedData);

        $http
            .get('http://api-domain.amsterdam.nl/404')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(404);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.NOT_FOUND_ERROR);
        expect(Raven.captureMessage).toHaveBeenCalledWith(
            jasmine.stringMatching('HTTP response body: Not found.'),
            { tags: { statusCode: 404 } });
        expect(callbackCalled).toBe(true);
    });

    it('handles 404 errors with an unexpected body as server errors', function () {
        mockedData = {};

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/404')
            .respond(404, mockedData);

        $http
            .get('http://api-domain.amsterdam.nl/404')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(404);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
        expect(Raven.captureMessage).toHaveBeenCalledWith(
            jasmine.stringMatching('HTTP 4xx response'),
            { tags: { statusCode: 404 } });
        expect(callbackCalled).toBe(true);
    });

    it('registers all http server error responses, leaves content untouched', function () {
        $http
            .get('http://api-domain.amsterdam.nl/500')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(500);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
        expect(Raven.captureMessage).toHaveBeenCalledWith(
            jasmine.stringMatching('HTTP 5xx response'),
            { tags: { statusCode: 500 } });
        expect(callbackCalled).toBe(true);
    });

    it('registers url load errors by listening to window error events', function () {
        // onError is the window error event listener (see mock of $window)
        // If called with an event that contains a target src url it will issue a server error

        onError({}); // without target src url
        expect(httpStatus.registerError).not.toHaveBeenCalledWith(httpStatus.SERVER_ERROR);

        onError({
            target: {
                src: 'aap'
            }
        }); // with target src url
        $rootScope.$digest();
        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
        expect(Raven.captureMessage).toHaveBeenCalledWith(
            jasmine.stringMatching('HTTP external request error'),
            { tags: { statusCode: undefined } });
    });

    it('does not register error if piwik is not loaded', function () {
        onError({
            target: {
                src: 'https://piwik.data.amsterdam.nl/piwik.js'
            }
        });
        expect(httpStatus.registerError).not.toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
        expect(Raven.captureMessage).not.toHaveBeenCalled();
    });

    it('registers http server error -1 for non-cancellable responses, leaves content untouched', function () {
        $http({
            method: 'GET',
            url: 'http://api-domain.amsterdam.nl/-1'
        }).catch(data => {
            expect(data.data).toEqual(mockedData);
            expect(data.status).toBe(-1);
            callbackCalled = true;
        });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
        expect(Raven.captureMessage).toHaveBeenCalledWith(
            jasmine.stringMatching('HTTP 5xx response'),
            { tags: { statusCode: -1 } });
        expect(callbackCalled).toBe(true);
    });

    it('registers http server error -1 for non-cancelled responses, leaves content untouched', function () {
        $http({
            method: 'GET',
            url: 'http://api-domain.amsterdam.nl/-1',
            timeout: {
                then: (resolve, reject) => {
                    if (angular.isFunction(reject)) {
                        reject();
                    }
                }
            }})
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(-1);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
        expect(Raven.captureMessage).toHaveBeenCalledWith(
            jasmine.stringMatching('HTTP request ended abnormally'),
            { tags: { statusCode: -1 } });
        expect(callbackCalled).toBe(true);
    });

    it('skips http server error -1 for cancelled responses, leaves content untouched', function () {
        $http({
            method: 'GET',
            url: 'http://api-domain.amsterdam.nl/-1',
            timeout: {
                then: angular.noop
            }})
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(-1);
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).not.toHaveBeenCalled();
        expect(Raven.captureMessage).not.toHaveBeenCalled();
        expect(callbackCalled).toBe(true);
    });

    it('calls the local error handler before the global one', function () {
        mockedData = {};

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/404')
            .respond(404, mockedData);

        $http
            .get('http://api-domain.amsterdam.nl/404')
            .catch(data => {
                callbackCalled = true;
            });

        expect(callbackCalled).toBe(false);

        $httpBackend.flush();

        expect(httpStatus.registerError).not.toHaveBeenCalled();
        expect(Raven.captureMessage).not.toHaveBeenCalled();
        expect(callbackCalled).toBe(true);

        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
        expect(Raven.captureMessage).toHaveBeenCalledWith(
            jasmine.stringMatching('HTTP 4xx response'),
            { tags: { statusCode: 404 } });
    });

    it('does not handle an error that has already been handled locally', function () {
        mockedData = {};

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/404')
            .respond(404, mockedData);

        $http
            .get('http://api-domain.amsterdam.nl/404')
            .catch(data => {
                // Mark the error to be handled
                data.errorHandled = true;
                callbackCalled = true;
            });

        $httpBackend.flush();
        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).not.toHaveBeenCalled();
        expect(Raven.captureMessage).not.toHaveBeenCalled();
        expect(callbackCalled).toBe(true);
    });
});
