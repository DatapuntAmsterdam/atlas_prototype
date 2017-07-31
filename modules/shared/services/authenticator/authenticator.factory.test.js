describe(' The authenticator factory', () => {
    let $httpBackend,
        $window,
        $location,
        $interval,
        storage,
        user,
        authenticator,
        absUrl,
        mockedUser,
        uriStripper;

    const REFRESH_INTERVAL = 1000 * 60 * 5;
    const AUTH_PATH = 'auth/';
    const LOGIN_PATH = 'idp/login';
    const REFRESH_TOKEN_PATH = 'idp/token';
    const ACCESS_TOKEN_PATH = 'accesstoken';

    beforeEach(() => {
        absUrl = 'absUrl';

        const initUser = {
            refreshToken: null,
            accessToken: null,
            userType: 'NONE'
        };

        mockedUser = initUser;

        angular.mock.module(
            'dpShared',
            {
                user: {
                    setRefreshToken: (token, type) => {
                        mockedUser.refreshToken = token;
                        mockedUser.userType = type;
                    },
                    setAccessToken: (token) => mockedUser.accessToken = token,
                    getRefreshToken: () => mockedUser.refreshToken,
                    clearToken: () => mockedUser = initUser,
                    getUserType: () => mockedUser.userType,
                    USER_TYPE: {
                        NONE: 'NONE',
                        ANONYMOUS: 'ANONYMOUS',
                        AUTHENTICATED: 'AUTHENTICATED'
                    }
                },
                $window: {
                    addEventListener: angular.noop,
                    location: {
                        href: ''
                    }
                },
                $location: {
                    absUrl: () => absUrl,
                    replace: angular.noop,
                    search: angular.noop
                },
                sharedConfig: {
                    API_ROOT: '',
                    AUTH_HEADER_PREFIX: 'Bearer '
                },
                storage: {
                    session: {
                        setItem: angular.noop,
                        getItem: angular.noop,
                        removeItem: angular.noop
                    }
                },
                uriStripper: jasmine.createSpyObj('uriStripper', ['stripDomain'])
            }
        );

        angular.mock.inject((
            _$httpBackend_,
            _$window_,
            _$location_,
            _$interval_,
            _storage_,
            _user_,
            _authenticator_,
            _uriStripper_
        ) => {
            $httpBackend = _$httpBackend_;
            $window = _$window_;
            $location = _$location_;
            $interval = _$interval_;
            storage = _storage_;
            user = _user_;
            authenticator = _authenticator_;
            uriStripper = _uriStripper_;
        });

        spyOn($location, 'search').and.returnValue({});
    });

    it('requests a accesstoken if a refresh token is available', () => {
        spyOn(user, 'getRefreshToken').and.returnValue('token');
        spyOn(user, 'setAccessToken');

        $httpBackend.whenGET(AUTH_PATH + ACCESS_TOKEN_PATH).respond('accesstoken');

        authenticator.initialize();
        $httpBackend.flush();

        expect(user.setAccessToken).toHaveBeenCalledWith('accesstoken');
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('does not request an anonymous refreshtoken when no refresh token is available', () => {
        spyOn(user, 'getRefreshToken').and.returnValue(null);
        spyOn(user, 'setRefreshToken');
        spyOn(user, 'setAccessToken');

        authenticator.initialize();

        expect(user.setRefreshToken).not.toHaveBeenCalled();
        expect(user.setAccessToken).not.toHaveBeenCalled();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('does not try to get an anonymous refreshtoken on accesstoken error', () => {
        spyOn(user, 'getRefreshToken').and.returnValue('token');
        spyOn(user, 'setRefreshToken');
        spyOn(user, 'clearToken');

        $httpBackend.whenGET(AUTH_PATH + ACCESS_TOKEN_PATH).respond(499, 'error message');

        authenticator.initialize();
        $httpBackend.flush();

        expect(user.clearToken).toHaveBeenCalledWith();
        $httpBackend.verifyNoOutstandingRequest();

        $interval.flush(REFRESH_INTERVAL);
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('login', () => {
        it('can login a user by redirecting to an external security provider', () => {
            absUrl = 'absUrl/#?arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl/#'));
        });

        it('saves the current path in the session when redirecting to an external security provider', () => {
            spyOn(storage.session, 'setItem');
            $location.search.and.returnValue({one: 1});
            absUrl = 'absUrl/#?arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl/#'));
            expect(storage.session.setItem).toHaveBeenCalledWith('callbackParams', angular.toJson({one: 1}));
        });

        it('saves the current path in the session removing the protocol and domain', () => {
            spyOn(storage.session, 'setItem');
            const path = 'foo/bar';
            const dte = 'https://api.data.amsterdam.nl' + path;
            $location.search.and.returnValue({dte});
            uriStripper.stripDomain.and.returnValue(path);

            authenticator.login();

            expect(uriStripper.stripDomain).toHaveBeenCalledWith(dte);
            expect(storage.session.setItem).toHaveBeenCalledWith('callbackParams', angular.toJson({dte: path}));
        });

        it('adds # to path when missing', () => {
            absUrl = 'absUrl';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl#'));
        });

        it('removes everything after # if present', () => {
            absUrl = 'absUrl/#/?arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl/#'));

            absUrl = 'absUrl/#/arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl/#'));

            absUrl = 'absUrl/#arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl/#'));

            absUrl = 'absUrl/#?arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl/#'));

            absUrl = 'absUrl#/?arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl#'));

            absUrl = 'absUrl#/arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl#'));

            absUrl = 'absUrl#?arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl#'));

            absUrl = 'absUrl#arg';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl#'));

            absUrl = 'absUrl#';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl#'));

            absUrl = 'absUrl';
            authenticator.login();
            expect($window.location.href)
                .toBe(AUTH_PATH + LOGIN_PATH + '?callback=' + encodeURIComponent('absUrl#'));
        });
    });

    it('can logout a user by clearing its tokens', () => {
        spyOn(user, 'clearToken');

        authenticator.logout();
        expect(user.clearToken).toHaveBeenCalled();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('is able to tell whether an url is a callback message from an external security provider', () => {
        expect(authenticator.isCallback({})).toBe(false);
        expect(authenticator.isCallback({one: 1, two: 2})).toBe(false);
        expect(authenticator.isCallback({'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3})).toBe(true);
        expect(authenticator.isCallback({'aselect_credentials': 2, 'rid': 3})).toBe(false);
        expect(authenticator.isCallback({one: 1, 'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3})).toBe(true);
    });

    it('is able to intercept callback messages from external security provider, clears browser history', () => {
        spyOn(user, 'setRefreshToken');
        spyOn(user, 'setAccessToken');
        spyOn($location, 'replace');
        spyOn(storage.session, 'getItem').and.returnValue(angular.toJson({one: 1}));

        $httpBackend.whenGET(AUTH_PATH + REFRESH_TOKEN_PATH + '?a-select-server=1&aselect_credentials=2&rid=3')
            .respond('token');
        $httpBackend.whenGET(AUTH_PATH + ACCESS_TOKEN_PATH).respond('accesstoken');

        authenticator.handleCallback({one: 1, 'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3});
        $httpBackend.flush();

        expect(user.setRefreshToken).toHaveBeenCalledWith('token', user.USER_TYPE.AUTHENTICATED);
        expect($location.replace).toHaveBeenCalled();
        expect($location.search).toHaveBeenCalledWith({one: 1});
        expect(user.setAccessToken).toHaveBeenCalledWith('accesstoken');
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('returns to the saved callback path on a refresh token error', () => {
        spyOn($location, 'replace');
        spyOn(storage.session, 'getItem').and.returnValue(angular.toJson({one: 1}));

        $httpBackend.whenGET(AUTH_PATH + REFRESH_TOKEN_PATH + '?a-select-server=1&aselect_credentials=2&rid=3')
            .respond(400, 'refresh token error');

        authenticator.handleCallback({one: 1, 'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3});
        $httpBackend.flush();

        expect($location.replace).toHaveBeenCalled();
        expect($location.search).toHaveBeenCalledWith({one: 1});
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('returns to the saved callback path on an access token error', () => {
        spyOn($location, 'replace');
        spyOn(storage.session, 'getItem').and.returnValue(angular.toJson({one: 1}));

        $httpBackend.whenGET(AUTH_PATH + REFRESH_TOKEN_PATH + '?a-select-server=1&aselect_credentials=2&rid=3')
            .respond('token');
        $httpBackend.whenGET(AUTH_PATH + ACCESS_TOKEN_PATH).respond(400, 'accesstoken error');

        authenticator.handleCallback({one: 1, 'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3});
        $httpBackend.flush();

        expect($location.replace).toHaveBeenCalled();
        expect($location.search).toHaveBeenCalledWith({one: 1});
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('retrieves a saved callback path when handling callback messages from external security provider', () => {
        spyOn(storage.session, 'getItem').and.returnValue(angular.toJson({one: 1}));

        $httpBackend.whenGET(AUTH_PATH + REFRESH_TOKEN_PATH + '?a-select-server=1&aselect_credentials=2&rid=3')
            .respond('token');
        $httpBackend.whenGET(AUTH_PATH + ACCESS_TOKEN_PATH).respond('accesstoken');

        authenticator.handleCallback({'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3});
        $httpBackend.flush();

        expect($location.search).toHaveBeenCalledWith({one: 1});
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('stays at home page when no saved callback path can be found', () => {
        spyOn(storage.session, 'getItem').and.returnValue(null);

        $httpBackend.whenGET(AUTH_PATH + REFRESH_TOKEN_PATH + '?a-select-server=1&aselect_credentials=2&rid=3')
            .respond('token');
        $httpBackend.whenGET(AUTH_PATH + ACCESS_TOKEN_PATH).respond('accesstoken');

        authenticator.handleCallback({'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3});
        $httpBackend.flush();

        expect($location.search).not.toHaveBeenCalled();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('does not ask for an anonymous access token if a authenticated refresh token fails', () => {
        spyOn(user, 'setRefreshToken');

        $httpBackend.whenGET(AUTH_PATH + REFRESH_TOKEN_PATH + '?a-select-server=1&aselect_credentials=2&rid=3')
            .respond(400, 'errorMessage');
        $httpBackend.whenGET(AUTH_PATH + ACCESS_TOKEN_PATH).respond('accesstoken');

        authenticator.handleCallback({one: 1, 'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3});
        $httpBackend.flush();

        expect(user.setRefreshToken).not.toHaveBeenCalled();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('does not ask for an anonymous refresh token if an authenticated access token fails', () => {
        spyOn(user, 'setRefreshToken').and.callThrough();
        spyOn(user, 'setAccessToken').and.callThrough();

        $httpBackend.whenGET(AUTH_PATH + REFRESH_TOKEN_PATH + '?a-select-server=1&aselect_credentials=2&rid=3')
            .respond('token');
        const getAccessToken = $httpBackend.whenGET(AUTH_PATH + ACCESS_TOKEN_PATH);

        getAccessToken.respond('accesstoken');

        authenticator.handleCallback({one: 1, 'a-select-server': 1, 'aselect_credentials': 2, 'rid': 3});
        $httpBackend.flush();

        expect(user.setRefreshToken).toHaveBeenCalledWith('token', user.USER_TYPE.AUTHENTICATED);
        expect(user.setAccessToken).toHaveBeenCalledWith('accesstoken');
        expect(user.getUserType()).toBe(user.USER_TYPE.AUTHENTICATED);
        $httpBackend.verifyNoOutstandingRequest();

        user.setRefreshToken.calls.reset();
        user.setAccessToken.calls.reset();

        getAccessToken.respond(400, 'access token error');

        $interval.flush(REFRESH_INTERVAL);   // force refresh of access token
        $httpBackend.flush();

        expect(user.setRefreshToken).not.toHaveBeenCalled();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
