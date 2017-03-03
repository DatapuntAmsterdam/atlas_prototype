describe('The user factory', function () {
    let userSettings,
        user;

    const testToken = 'test token';

    beforeEach(function () {
        let refreshToken = 'refreshToken',
            userType = 'NONE';

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

    it('can store and tell the refresh token for the user', function () {
        user.setRefreshToken(testToken);
        expect(user.getRefreshToken()).toBe(testToken);
    });

    it('can store and tell the access token for the user', function () {
        user.setAccessToken(testToken);
        expect(user.getAccessToken()).toBe(testToken);
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

    it('returns a default refresh token and user type as are stored in the userSettings', function () {
        expect(user.getRefreshToken()).toBe(userSettings.refreshToken.value);
        expect(user.getUserType()).toBe(userSettings.userType.value);
    });

    it('returns a default user type NONE for unknown user types', function () {
        userSettings.userType.value = 'unknown usertype';
        expect(user.getUserType()).toBe(user.USER_TYPE.NONE);
    });

    it('can clear all tokens for the user', function () {
        user.clearToken();
        expect(user.getAccessToken()).toBe(null);
        expect(user.getRefreshToken()).toBe(null);
        expect(user.getUserType()).toBe(user.USER_TYPE.NONE);
    });
});
