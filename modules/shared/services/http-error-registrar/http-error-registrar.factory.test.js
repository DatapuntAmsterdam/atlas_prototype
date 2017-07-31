describe('The http error registrar', () => {
    const FLUSH_PERIOD = 1,
        httpStatus = {
            SERVER_ERROR: 'SERVER_ERROR',
            NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
            registerError: angular.noop
        };
    let $httpBackend,
        $http,
        $rootScope,
        $interval,
        mockedData,
        onError,
        callbackCalled;

    beforeEach(() => {
        onError = null;
        const window = {
            addEventListener: function (type, func) {
                if (type === 'error') {
                    onError = func;
                }
            }
        };

        angular.mock.module('dpShared', { httpStatus });

        angular.mock.module($provide => {
            $provide.value('$window', window);
        });

        angular.mock.inject((_$httpBackend_, _$http_, _$rootScope_, _$interval_) => {
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            $rootScope = _$rootScope_;
            $interval = _$interval_;
        });

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
            .whenGET('http://api-domain.amsterdam.nl/500')
            .respond(500, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/-1')
            .respond(-1, mockedData);

        spyOn(httpStatus, 'registerError');
    });

    it('does not handle normal responses and requests', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('does not handle response errors outside of the 400 and 500 ranges', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('does handle client error responses and requests', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('does handle 404 errors with the correct body', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('handles 404 errors with an unexpected body as server errors', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('registers all http server error responses, leaves content untouched', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('registers url load errors by listening to window error events', () => {
        // onError is the window error event listener (see mock of $window)
        // If called with an event that contains a target src url it will issue a server error

        onError({});    // without target src url
        expect(httpStatus.registerError).not.toHaveBeenCalledWith(httpStatus.SERVER_ERROR);

        onError({
            target: {
                src: 'aap'
            }
        }); // with target src url
        $rootScope.$digest();
        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
    });

    it('does not register error if piwik is not loaded', () => {
        onError({
            target: {
                src: 'https://piwik.data.amsterdam.nl/piwik.js'
            }
        });
        expect(httpStatus.registerError).not.toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
    });

    it('registers http server error -1 for non-cancellable responses, leaves content untouched', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('registers http server error -1 for non-cancelled responses, leaves content untouched', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('skips http server error -1 for cancelled responses, leaves content untouched', () => {
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
        expect(callbackCalled).toBe(true);
    });

    it('calls the local error handler before the global one', () => {
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
        expect(callbackCalled).toBe(true);

        $interval.flush(FLUSH_PERIOD);

        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
    });

    it('does not handle an error that has already been handled locally', () => {
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
        expect(callbackCalled).toBe(true);
    });
});
