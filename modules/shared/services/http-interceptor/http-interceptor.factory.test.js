describe('The http interceptor', function () {
    let $httpBackend,
        $http,
        httpStatus = {
            SERVER_ERROR: 'SERVER_ERROR',
            NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
            registerError: angular.noop
        },
        mockedData,
        callbackCalled;

    beforeEach(function () {
        angular.mock.module('dpShared', { httpStatus });

        angular.mock.inject(function (_$httpBackend_, _$http_) {
            $httpBackend = _$httpBackend_;
            $http = _$http_;
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

        spyOn(httpStatus, 'registerError');
    });

    it('does not handle normal responses and requests', function () {
        $http
            .get('http://api-domain.amsterdam.nl/200')
            .then(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(200);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('does not handle response errors outside of the 400 and 500 ranges', function () {
        $http
            .get('http://api-domain.amsterdam.nl/300')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(300);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('does not handle client error responses and requests', function () {
        $http
            .get('http://api-domain.amsterdam.nl/400')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(400);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
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
                expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.NOT_FOUND_ERROR);
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('does not handle 404 errors without the correct body', function () {
        mockedData = {};

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/404')
            .respond(404, mockedData);

        $http
            .get('http://api-domain.amsterdam.nl/404')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(404);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('registers all http server error responses, leaves content untouched', function () {
        $http
            .get('http://api-domain.amsterdam.nl/500')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(500);
                expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });
});
