describe('The user factory', function () {
    let userSettings,
        refreshToken,
        userType,
        user;

    const testToken = 'test token';

    /* eslint-disable max-len */
    const
        testRefreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMyNDMsImV4cCI6MTQ4Nzg0ODk4Miwic3ViIjoiSSBhbSB0aGUgc3ViIGZpZWxkIiwianRpIjoiZWE3ZjViMzMtYjA0Ni00ZDAxLWJmZTUtY2NiODYwYjFmZTVmIn0.2QAsGMbyRk5g5SOgRBlTqFh2MCMQE4ELaU2JuHVCkBg',
        testAnonymousRefreshToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDM0ODAsImV4cCI6MTQ5MDQzNTQ4MCwic3ViIjpudWxsfQ.tT81eOuAFns6EU2kowjrL-4Wxo34mQPBVY8hK4wFGo4',
        testAccessTokenAuthz0 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMwMjgsImV4cCI6MTQ4Nzg0MzMyOCwiYXV0aHoiOjB9.dFYWAzKl_-eoWlnwhnXW7L0bf5y1dy-ECTzbQtZN3gk',
        testAccessTokenAuthz1 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMwMjgsImV4cCI6MTQ4Nzg0OTA1NCwiYXV0aHoiOjEsImp0aSI6Ijk1M2U3Y2NlLWEwYzQtNDAyZi1iZTc0LTg3MjY2ZDE3NThjMSJ9.QMu_x1Iys0GX0-zkb3NpZmEPX2rSU9-G7Q59_hlbpFg',
        testAccessTokenAuthz3 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMwMjgsImV4cCI6MTQ4Nzg0OTExMCwiYXV0aHoiOjMsImp0aSI6ImY4ZDJiNzQ4LTg2MzAtNDFmOC05Y2M4LWE1Njg4OTUzNTFjOCJ9.TlqGvT5HX979p0IcYm2DgGIIqb45Is6_hAS9F3YOnlU',
        testAccessTokenAuthz99 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0ODc4NDMwMjgsImV4cCI6MTQ4Nzg0ODc3NiwiYXV0aHoiOjk5LCJqdGkiOiI4Y2VjYTk1My03YzEzLTQwMmMtODIyMS1jM2RjYWE0ZWY1Y2MifQ.LahevkWI06bVCY66khV1z5WKoAByNC_kMSwjKsABkwY';
    /* eslint-enable max-len */

    beforeEach(function () {
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

        angular.mock.inject(function (_userSettings_, _user_) {
            userSettings = _userSettings_;
            user = _user_;
        });
    });

    describe('The regular behaviour', function () {
        it('can store and tell the refresh token for the user', function () {
            user.setRefreshToken(testToken);
            expect(user.getRefreshToken()).toBe(testToken);
        });

        it('can store and tell the access token for the user', function () {
            user.setAccessToken(testToken);
            expect(user.getAccessToken()).toBe(testToken);
        });

        it('can tell the name of the user', function () {
            user.setRefreshToken(testRefreshToken);
            expect(user.getName()).toBe('I am the sub field');
        });

        it('tells "" as the name of an anonymous user', function () {
            user.setRefreshToken(testAnonymousRefreshToken);
            expect(user.getName()).toBe('');
        });

        it('can tell the authorization level of the user', function () {
            user.setAccessToken(testAccessTokenAuthz0);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.DEFAULT);
            user.setAccessToken(testAccessTokenAuthz1);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.EMPLOYEE);
            user.setAccessToken(testAccessTokenAuthz3);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS);
        });

        it('returns authorization level NONE for unknown authorization levels', function () {
            user.setAccessToken(testAccessTokenAuthz99);
            expect(user.getAuthorizationLevel()).toBe(user.AUTHORIZATION_LEVEL.NONE);
        });

        it('can store and tell the type of the user', function () {
            user.setRefreshToken(testToken, user.USER_TYPE.ANONYMOUS);
            expect(user.getUserType()).toBe(user.USER_TYPE.ANONYMOUS);
        });

        it('stores the refresh token and user type in the userSettings', function () {
            user.setRefreshToken(testToken, user.USER_TYPE.ANONYMOUS);
            expect(userSettings.refreshToken.value).toBe(testToken);
            expect(userSettings.userType.value).toBe(user.USER_TYPE.ANONYMOUS);
        });

        it('returns a default access token null', function () {
            expect(user.getAccessToken()).toBe(null);
        });

        it('can clear all tokens for the user', function () {
            user.clearToken();
            expect(user.getAccessToken()).toBe(null);
            expect(user.getRefreshToken()).toBe(null);
            expect(user.getUserType()).toBe(user.USER_TYPE.NONE);
        });

        it('returns a default user type NONE for unknown user types', function () {
            userSettings.userType.value = 'unknown usertype';
            expect(user.getUserType()).toBe(user.USER_TYPE.NONE);
        });
    });

    describe('The behaviour when a refreshToken and userType is available from the session storage', function () {
        beforeEach(function () {
            refreshToken = 'refreshToken';
            userType = 'NONE';
        });

        it('returns a default refresh token and user type as are stored in the userSettings', function () {
            expect(user.getRefreshToken()).toBe(userSettings.refreshToken.value);
            expect(user.getUserType()).toBe(userSettings.userType.value);
        });
    });

    describe('The behaviour when no refreshToken and/or userType is available from the session storage', function () {
        beforeEach(function () {
            refreshToken = null;
            userType = null;
        });

        it('returns refresh token and user type as are stored in the userSettings', function () {
            expect(user.getRefreshToken()).toBe(null);
            expect(user.getUserType()).toBe(user.USER_TYPE.NONE);
        });

        it('tells "" as the name of an anonymous user', function () {
            expect(user.getName()).toBe('');
        });
    });
});
