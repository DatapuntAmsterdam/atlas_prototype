describe('The user factory', () => {
    const FORCE_REFRESH_TIMEOUT = 350,
        FORCE_END_TIMEOUT = 5500;

    let $rootScope,
        $interval,
        $window,
        $httpBackend,
        $cacheFactory,
        api,
        userSettings,
        refreshToken,
        userType,
        user;

    const testToken = 'test token';

    // The test access tokens 0, 1, 3, and 99 are for users with auth level
    // 0 (NONE), 1 (EMPLOYEE), 3 (EMPLOYEE_PLUS) and 99 (unknown level, which should map to NONE)

    /* eslint-disable max-len */
    const
        testRefreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMyNDMsImV4cCI6MTQ4Nzg0ODk4Miwic3ViIjoiSSBhbSB0aGUgc3ViIGZpZWxkIiwianRpIjoiZWE3ZjViMzMtYjA0Ni00ZDAxLWJmZTUtY2NiODYwYjFmZTVmIn0.2QAsGMbyRk5g5SOgRBlTqFh2MCMQE4ELaU2JuHVCkBg',
        testAnonymousRefreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDM0ODAsImV4cCI6MTQ5MDQzNTQ4MCwic3ViIjpudWxsfQ.tT81eOuAFns6EU2kowjrL-4Wxo34mQPBVY8hK4wFGo4',
        testAccessTokenAuthz0 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMwMjgsImV4cCI6MTQ4Nzg0MzMyOCwiYXV0aHoiOjB9.dFYWAzKl_-eoWlnwhnXW7L0bf5y1dy-ECTzbQtZN3gk',
        testAccessTokenAuthz1 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMwMjgsImV4cCI6MTQ4Nzg0OTA1NCwiYXV0aHoiOjEsImp0aSI6Ijk1M2U3Y2NlLWEwYzQtNDAyZi1iZTc0LTg3MjY2ZDE3NThjMSJ9.QMu_x1Iys0GX0-zkb3NpZmEPX2rSU9-G7Q59_hlbpFg',
        testAccessTokenAuthz3 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMwMjgsImV4cCI6MTQ4Nzg0OTExMCwiYXV0aHoiOjMsImp0aSI6ImY4ZDJiNzQ4LTg2MzAtNDFmOC05Y2M4LWE1Njg4OTUzNTFjOCJ9.TlqGvT5HX979p0IcYm2DgGIIqb45Is6_hAS9F3YOnlU',
        testAccessTokenAuthz99 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMwMjgsImV4cCI6MTQ4Nzg0ODc3NiwiYXV0aHoiOjk5LCJqdGkiOiI4Y2VjYTk1My03YzEzLTQwMmMtODIyMS1jM2RjYWE0ZWY1Y2MifQ.LahevkWI06bVCY66khV1z5WKoAByNC_kMSwjKsABkwY';
    /* eslint-enable max-len */

    beforeEach(() => {
        angular.mock.module(
            'dpShared',
            {
                userSettings: {
                    refreshToken: {
                        get value () { return refreshToken; },
                        set value (value) { refreshToken = value; },
                        remove: () => refreshToken = null
                    },
                    userType: {
                        get value () { return userType; },
                        set value (value) { userType = value; },
                        remove: () => userType = null
                    }
                }
            }
        );

        angular.mock.inject((
            _$rootScope_,
            _$interval_,
            _$window_,
            _$httpBackend_,
            _$cacheFactory_,
            _api_,
            _userSettings_,
            _user_
        ) => {
            $rootScope = _$rootScope_;
            $interval = _$interval_;
            $window = _$window_;
            $httpBackend = _$httpBackend_;
            $cacheFactory = _$cacheFactory_;
            api = _api_;
            userSettings = _userSettings_;
            user = _user_;
        });

        $httpBackend.whenGET('https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/').respond({});

        spyOn($window.location, 'reload').and.returnValue(null);
    });

    describe('The regular behaviour', () => {
        it('can store and tell the refresh token for the user', () => {
            user.setRefreshToken(testToken);
            expect(user.getRefreshToken()).toBe(testToken);
        });

        it('can store and tell the access token for the user', () => {
            user.setAccessToken(testToken);
            expect(user.getAccessToken()).toBe(testToken);
        });

        it('can tell the name of the user', () => {
            user.setRefreshToken(testRefreshToken);
            expect(user.getName()).toBe('I am the sub field');
        });

        it('tells "" as the name of an anonymous user', () => {
            user.setRefreshToken(testAnonymousRefreshToken);
            expect(user.getName()).toBe('');
        });

        it('can tell the authorization level of the user', () => {
            user.setAccessToken(testAccessTokenAuthz0);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.DEFAULT);
            user.setAccessToken(testAccessTokenAuthz1);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.EMPLOYEE);
            user.setAccessToken(testAccessTokenAuthz3);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS);
        });

        it('returns authorization level NONE for unknown authorization levels', () => {
            user.setAccessToken(testAccessTokenAuthz99);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.NONE);
        });

        it('can store and tell the type of the user', () => {
            user.setRefreshToken(testToken, user.USER_TYPE.ANONYMOUS);
            expect(user.getUserType()).toBe(user.USER_TYPE.ANONYMOUS);
        });

        it('stores the refresh token and user type in the userSettings', () => {
            user.setRefreshToken(testToken, user.USER_TYPE.ANONYMOUS);
            expect(userSettings.refreshToken.value).toBe(testToken);
            expect(userSettings.userType.value).toBe(user.USER_TYPE.ANONYMOUS);
        });

        it('returns a default access token null', () => {
            expect(user.getAccessToken()).toBe(null);
        });

        it('can clear all tokens for the user', () => {
            user.clearToken();
            expect(user.getAccessToken()).toBe(null);
            expect(user.getRefreshToken()).toBe(null);
            expect(user.getUserType()).toBe(user.USER_TYPE.NONE);
        });

        it('returns a default user type NONE for unknown user types', () => {
            userSettings.userType.value = 'unknown usertype';
            expect(user.getUserType()).toBe(user.USER_TYPE.NONE);
        });
    });

    describe('The tests wether the user meets a required authorization level', () => {
        const dummyValues = [null, 0, true, false, 'some strange value'];

        it('can test wether the a non-authorized user meets a required authorization level', () => {
            ['NONE']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(true));
            ['DEFAULT', 'EMPLOYEE', 'EMPLOYEE_PLUS']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(false));
            dummyValues.forEach(level => expect(user.meetsRequiredLevel(level)).toBe(false));
            expect(user.meetsRequiredLevel(undefined)).toBe(true);
        });

        it('can test wether a user with unknown auth. level meets a required authorization level', () => {
            user.setAccessToken(testAccessTokenAuthz99);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.NONE);
            ['NONE']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(true));
            ['DEFAULT', 'EMPLOYEE', 'EMPLOYEE_PLUS']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(false));
            dummyValues.forEach(level => expect(user.meetsRequiredLevel(level)).toBe(false));
            expect(user.meetsRequiredLevel(undefined)).toBe(true);
        });

        it('can test wether a DEFAULT user meets a required authorization level', () => {
            user.setAccessToken(testAccessTokenAuthz0);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.DEFAULT);
            ['NONE', 'DEFAULT']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(true));
            ['EMPLOYEE', 'EMPLOYEE_PLUS']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(false));
            dummyValues.forEach(level => expect(user.meetsRequiredLevel(level)).toBe(false));
            expect(user.meetsRequiredLevel(undefined)).toBe(true);
        });

        it('can test wether a EMPLOYEE user meets a required authorization level', () => {
            user.setAccessToken(testAccessTokenAuthz1);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.EMPLOYEE);
            ['NONE', 'DEFAULT', 'EMPLOYEE']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(true));
            ['EMPLOYEE_PLUS']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(false));
            dummyValues.forEach(level => expect(user.meetsRequiredLevel(level)).toBe(false));
            expect(user.meetsRequiredLevel(undefined)).toBe(true);
        });

        it('can test wether a EMPLOYEE_PLUS user meets a required authorization level', () => {
            user.setAccessToken(testAccessTokenAuthz3);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS);
            ['NONE', 'DEFAULT', 'EMPLOYEE', 'EMPLOYEE_PLUS']
                .forEach(level => expect(user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL[level])).toBe(true));
            dummyValues.forEach(level => expect(user.meetsRequiredLevel(level)).toBe(false));
            expect(user.meetsRequiredLevel(undefined)).toBe(true);
        });
    });

    describe('The behaviour when the user authorization changes', () => {
        it('reloads the application on logout', () => {
            user.clearToken();
            expect($window.location.reload).toHaveBeenCalledWith(true);
        });

        it('reloads the application on a lower authorization level', () => {
            user.setAccessToken(testAccessTokenAuthz1);
            expect($window.location.reload).not.toHaveBeenCalled();
            user.setAccessToken(testAccessTokenAuthz0);
            expect($window.location.reload).toHaveBeenCalledWith(true);
        });

        it('does not reload the application on a higher authorization level', () => {
            user.setAccessToken(testAccessTokenAuthz0);
            expect($window.location.reload).not.toHaveBeenCalled();
            user.setAccessToken(testAccessTokenAuthz1);
            expect($window.location.reload).not.toHaveBeenCalled();
        });
        it('clears cache on refresh token change', () => {
            api.getByUrl('https://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/');
            $httpBackend.flush();
            const $httpCache = $cacheFactory.get('$http');
            expect($httpCache.info().size).toBe(1);
            user.setRefreshToken(testToken, user.USER_TYPE.ANONYMOUS);
            expect($httpCache.info().size).toBe(0);
        });
    });

    describe('The behaviour when a refreshToken and userType is available from the session storage', () => {
        beforeEach(() => {
            refreshToken = 'refreshToken';
            userType = 'NONE';
        });

        it('returns a default refresh token and user type as are stored in the userSettings', () => {
            expect(user.getRefreshToken()).toBe(userSettings.refreshToken.value);
            expect(user.getUserType()).toBe(userSettings.userType.value);
        });
    });

    describe('The behaviour when no refreshToken and/or userType is available from the session storage', () => {
        beforeEach(() => {
            refreshToken = null;
            userType = null;
        });

        it('returns refresh token and user type as are stored in the userSettings', () => {
            expect(user.getRefreshToken()).toBe(null);
            expect(user.getUserType()).toBe(user.USER_TYPE.NONE);
        });

        it('tells "" as the name of an anonymous user', () => {
            expect(user.getName()).toBe('');
        });
    });

    describe('waiting for an access token if user is logging in', () => {
        it('continues if an access token is already available', () => {
            var accessToken;

            refreshToken = 'refreshToken';
            user.setAccessToken(testAccessTokenAuthz1);

            user.waitForAccessToken().then(token => {
                accessToken = token;
            });

            $rootScope.$digest();

            expect(accessToken).toEqual(testAccessTokenAuthz1);
        });

        it('continues if login succeeds', () => {
            var accessToken;

            refreshToken = 'refreshToken';

            user.waitForAccessToken().then(token => {
                accessToken = token;
            });

            $rootScope.$digest();

            user.setAccessToken(testAccessTokenAuthz1);
            $interval.flush(FORCE_REFRESH_TIMEOUT);   // force refresh of access token
            $rootScope.$digest();

            expect(accessToken).toEqual(testAccessTokenAuthz1);
        });

        it('continues if login fails', () => {
            var accessToken;

            refreshToken = 'refreshToken';

            user.waitForAccessToken().then(token => {
                accessToken = token;
            });

            $rootScope.$digest();

            refreshToken = null;
            $interval.flush(FORCE_REFRESH_TIMEOUT);   // force refresh of access token
            $rootScope.$digest();

            expect(accessToken).toEqual(null);
        });

        it('waits for max 5 seconds', () => {
            var accessToken;

            refreshToken = 'refreshToken';

            user.waitForAccessToken().then(token => {
                accessToken = token;
            });

            $rootScope.$digest();

            $interval.flush(FORCE_END_TIMEOUT);   // force end of interval
            $rootScope.$digest();

            expect(accessToken).toEqual(null);
        });
    });
});
