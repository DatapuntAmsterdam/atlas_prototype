describe('The user factory', function () {
    var $http,
        $httpBackend,
        $httpParamSerializer,
        $timeoutspy,
        user,
        storage,
        httpPostHeaders,
        httpPostLoginData,
        httpPostRefreshData,
        dummyPromise;

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('is able to login and to logout', function () {
        beforeEach(function () {
            dummyPromise = 'dummyPromise';
            $timeoutspy = jasmine.createSpy('$timeout', {cancel: function () {}}).and.returnValue(dummyPromise);

            angular.mock.module(
                'dpShared',
                {
                    environment: {
                        AUTH_ROOT: 'http://atlas.amsterdam.nl/authenticatie/'
                    },
                    storage: {
                        token: null,
                        getItem: function () { return this.token; },
                        setItem: function (k, v) { this.token = v;},
                        removeItem: function () { this.token = null; }
                    }
                },
                function ($provide) {
                    $provide.factory('$timeout', function () {
                        return $timeoutspy;
                    });
                }
            );

            angular.mock.inject(function (_$http_, _$httpBackend_, _$httpParamSerializer_, _user_, _storage_) {
                $http = _$http_;
                $httpBackend = _$httpBackend_;
                $httpParamSerializer = _$httpParamSerializer_;
                user = _user_;
                storage = _storage_;
            });

            httpPostHeaders = angular.merge(
                {},
                $http.defaults.headers.common,
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            );

            httpPostLoginData = $httpParamSerializer(
                {
                    username: 'Erik',
                    password: 'mysecretpwd'
                }
            );

            httpPostRefreshData = $httpParamSerializer(
                {
                    token: 'ERIKS_ACCESS_TOKEN'
                }
            );

            spyOn($timeoutspy, 'cancel');
            spyOn(storage, 'getItem');
            spyOn(storage, 'removeItem');
            spyOn(storage, 'setItem');
        });

        it('by default you are not logged in', function () {
            expect(user.getStatus()).toEqual({
                username: null,
                accessToken: null,
                isLoggedIn: false
            });
        });

        it('allows for logout, even if you are not logged in', function () {
            user.logout();
            expect(user.getStatus()).toEqual({
                username: null,
                accessToken: null,
                isLoggedIn: false
            });
        });

        it('can successfully login', function () {
            $httpBackend
                .expectPOST('http://atlas.amsterdam.nl/authenticatie/token/', httpPostLoginData, httpPostHeaders)
                .respond({
                    token: 'ERIKS_ACCESS_TOKEN'
                });

            user.login('Erik', 'mysecretpwd');
            $httpBackend.flush();

            expect(storage.setItem).toHaveBeenCalled();
            expect(user.getStatus()).toEqual({
                username: 'Erik',
                accessToken: 'ERIKS_ACCESS_TOKEN',
                isLoggedIn: true
            });

            //  expect timeout to be set.
            expect($timeoutspy).toHaveBeenCalledWith(user.refreshToken, 270000);
        });

        describe('and then the token to be refreshed', function () {
            it('with success', function () {
                $httpBackend
                    .expectPOST('http://atlas.amsterdam.nl/authenticatie/token/', httpPostLoginData, httpPostHeaders)
                    .respond({
                        token: 'ERIKS_ACCESS_TOKEN'
                    });

                user.login('Erik', 'mysecretpwd');
                $httpBackend.flush();

                $httpBackend
                    .expectPOST('http://atlas.amsterdam.nl/authenticatie/refresh/',
                        httpPostRefreshData,
                        httpPostHeaders)
                    .respond({
                        token: 'ERIKS_BRAND_NEW_TOKEN'
                    });

                user.refreshToken();
                $httpBackend.flush();

                expect(storage.setItem).toHaveBeenCalled();
                expect(user.getStatus()).toEqual({
                    username: 'Erik',
                    accessToken: 'ERIKS_BRAND_NEW_TOKEN',
                    isLoggedIn: true
                });
            });

            it('and gracefull failover', function () {
                $httpBackend
                    .expectPOST('http://atlas.amsterdam.nl/authenticatie/token/', httpPostLoginData, httpPostHeaders)
                    .respond({
                        token: 'ERIKS_ACCESS_TOKEN'
                    });

                user.login('Erik', 'mysecretpwd');
                $httpBackend.flush();

                $httpBackend
                    .expectPOST('http://atlas.amsterdam.nl/authenticatie/refresh/',
                        httpPostRefreshData,
                        httpPostHeaders)
                    .respond(400);

                user.refreshToken();
                $httpBackend.flush();

                expect(storage.removeItem).toHaveBeenCalled();
                expect(user.getStatus()).toEqual({
                    username: null,
                    accessToken: null,
                    isLoggedIn: false
                });

                //  expect interval to be cancelled
                expect($timeoutspy.cancel).toHaveBeenCalledWith(dummyPromise);
            });
        });

        describe('and fail by throwing an error with an error message', function () {
            it('400 - Bad request', function () {
                var errorMessage;

                $httpBackend
                    .expectPOST('http://atlas.amsterdam.nl/authenticatie/token/', httpPostLoginData, httpPostHeaders)
                    .respond(400);

                user
                    .login('Erik', 'mysecretpwd')
                    .catch(function (_errorMessage_) {
                        errorMessage = _errorMessage_;
                    });

                $httpBackend.flush();
                expect(errorMessage).toBe('De combinatie gebruikersnaam en wachtwoord wordt niet herkend.');
            });

            it('404 - Not Found', function () {
                var errorMessage;

                $httpBackend
                    .expectPOST('http://atlas.amsterdam.nl/authenticatie/token/', httpPostLoginData, httpPostHeaders)
                    .respond(404);

                user
                    .login('Erik', 'mysecretpwd')
                    .catch(function (_errorMessage_) {
                        errorMessage = _errorMessage_;
                    });

                $httpBackend.flush();
                expect(errorMessage).toBe('Er is iets mis met de inlog server, probeer het later nog eens.');
            });

            it('fallback error messagge', function () {
                var errorMessage;

                $httpBackend
                    .expectPOST('http://atlas.amsterdam.nl/authenticatie/token/', httpPostLoginData, httpPostHeaders)
                    .respond(408, null, null, 'Duurt te lang, ga ik niet op wachten');

                user
                    .login('Erik', 'mysecretpwd')
                    .catch(function (_errorMessage_) {
                        errorMessage = _errorMessage_;
                    });

                $httpBackend.flush();

                expect(errorMessage).toBe('Er is een fout opgetreden. Neem contact op met de beheerder en vermeld cod' +
                    'e: 408 status: Duurt te lang, ga ik niet op wachten.');
            });
        });

        it('can logout', function () {
            // Login first
            $httpBackend.expectPOST('http://atlas.amsterdam.nl/authenticatie/token/',
                httpPostLoginData,
                httpPostHeaders)
                .respond({token: 'ERIKS_ACCESS_TOKEN'});

            user.login('Erik', 'mysecretpwd');
            $httpBackend.flush();

            expect(storage.setItem).toHaveBeenCalled();
            expect(user.getStatus()).toEqual({
                username: 'Erik',
                accessToken: 'ERIKS_ACCESS_TOKEN',
                isLoggedIn: true
            });

            // Now logout
            user.logout();

            expect(storage.removeItem).toHaveBeenCalled();
            expect(user.getStatus()).toEqual({
                username: null,
                accessToken: null,
                isLoggedIn: false
            });

            //  expect interval to be cancelled
            expect($timeoutspy.cancel).toHaveBeenCalledWith(dummyPromise);
        });
    });

    describe('is able to survive a browser refresh', function () {
        beforeEach(function () {
            angular.mock.module(
                'dpShared',
                {
                    environment: {
                        AUTH_ROOT: 'http://atlas.amsterdam.nl/authenticatie/'
                    },
                    storage: {
                        token: 'aToken',
                        getItem: function () { return this.token; },
                        setItem: function (k, v) { this.token = v;},
                        removeItem: function () { this.token = null; }
                    }
                }
            );

            angular.mock.inject(function (_$http_, _$httpBackend_, _$httpParamSerializer_, _user_, _storage_) {
                $http = _$http_;
                $httpBackend = _$httpBackend_;
                $httpParamSerializer = _$httpParamSerializer_;
                user = _user_;
                storage = _storage_;
            });

            httpPostHeaders = angular.merge(
                {},
                $http.defaults.headers.common,
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            );
        });

        it('uses the token in the storage factory and refreshes it immediately', function () {
            $httpBackend
                .expectPOST('http://atlas.amsterdam.nl/authenticatie/refresh/',
                    $httpParamSerializer({
                        token: 'aToken'
                    }),
                    httpPostHeaders)
                .respond({
                    token: 'ERIKS_BRAND_NEW_TOKEN'
                });
            $httpBackend.flush();
            expect(storage.getItem()).toBe('ERIKS_BRAND_NEW_TOKEN');
        });

        it('clears the token in the storage factory on logout', function () {
            $httpBackend
                .expectPOST('http://atlas.amsterdam.nl/authenticatie/refresh/',
                    $httpParamSerializer({
                        token: 'aToken'
                    }),
                    httpPostHeaders)
                .respond({
                    token: 'ERIKS_BRAND_NEW_TOKEN'
                });
            $httpBackend.flush();
            user.logout();
            expect(storage.getItem()).toBeNull();
            expect(user.getStatus()).toEqual({
                username: null,
                accessToken: null,
                isLoggedIn: false
            });
        });
    });
});
