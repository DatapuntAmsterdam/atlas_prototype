xdescribe('The user service', function() {
    // ========================================================
    // 1. We define our dependencies
    // ========================================================

    var userService;

    var environment = {
        'OAUTH_ROOT': 'http://test/o/'
    };

    var $window;

    beforeEach(function () {
        angular.mock.module('dpShared', function($provide) {
            $provide.value('environment', environment);
            $provide.value('$window', $window);
            $provide.constant('CLIENT_ID', 'lalalala');
        });
        $window = {history: { back: jasmine.createSpy()} };
    });

    // ========================================================
    // 2. Inject our dependencies
    // ========================================================

    beforeEach(function () {
        angular.mock.inject(function(_userService_) {
            userService = _userService_;
        });
    });

    // ========================================================
    // 3. The Actual Tests
    // ========================================================

    it('is defined', function() {
        expect(userService).toBeDefined();
    });

    it('always exposes a current user', function() {
        expect(userService.user).toBeDefined();
        expect(userService.user.loggedIn).toBe(false);
        expect(userService.user.username).toBe('');
        expect(userService.user.token).toBe('');
    });

    describe('the login function', function() {
        var backend, $http;

        beforeEach(function () {
            angular.mock.inject(function($httpBackend, _$http_) {
                backend = $httpBackend;
                $http = _$http_;

                backend.whenPOST('http://test/o/token/',
                    function(data) {
                        return data.indexOf('username=yigal') >= 0;
                    },
                    function(headers) {
                        return headers['Content-Type'] === 'application/x-www-form-urlencoded';
                    }
                ).respond({
                    'access_token': '1234',
                    'scope': 'write read',
                    'refresh_token': '4567',
                    'expires_in': 3600,
                    'token_type': 'Bearer'
                });

                backend.whenPOST('http://test/o/token/',
                    function(data) {
                        return data.indexOf('username=tristan') >= 0;
                    },
                    function(headers) {
                        return headers['Content-Type'] === 'application/x-www-form-urlencoded';
                    }
                ).respond(401, {
                    'error': 'invalid_grant',
                    'error_description': 'Invalid credentials given'
                });
            });
        });

        afterEach(function() {
            backend.verifyNoOutstandingRequest();
        });

        it('retrieves a token', function() {
            userService.login('yigal', 'pwd');
            backend.flush();

            expect(userService.user.loggedIn).toBe(true);
            expect(userService.user.username).toBe('yigal');
            expect(userService.user.token).toBe('1234');
        });

        it('sets the token as an HTTP default', function() {
            expect($http.defaults.headers.common.Authorization).toBeUndefined();

            userService.login('yigal', 'pwd');
            backend.flush();

            expect($http.defaults.headers.common.Authorization).toBe('Bearer 1234');
        });

        it('returns a promise that is fulfilled after successful login', function() {
            var result;

            var promise = userService.login('yigal', 'pwd');
            expect(promise).toBeDefined();

            promise.then(function(user) { result = user; });

            backend.flush();

            expect(result).toBeDefined();
            expect(result.username).toBe('yigal');
            expect($window.history.back).toHaveBeenCalled();
        });

        it('returns a promise that is fulfilled after a failed login', function() {
            var result;

            var promise = userService.login('tristan', 'pwd');
            expect(promise).toBeDefined();

            promise.then(function() {}, function(error) { result = error; });
            backend.flush();

            expect(result).toBeDefined();
            expect(result.error).toBe('invalid_grant');

            expect(userService.user.loggedIn).toBe(false);
            expect(userService.user.username).toBe('');
            expect(userService.user.token).toBe('');
        });
    });

    describe('the logout function', function() {
        var backend, $http;

        beforeEach(function () {
            angular.mock.inject(function($httpBackend, _$http_) {
                backend = $httpBackend;
                $http = _$http_;

                userService.user.username = 'yigal';
                userService.user.loggedIn = true;
                userService.user.token = '0987';
                $http.defaults.headers.common.Authorization = 'Bearer 0987';

                backend.expectPOST('http://test/o/revoke_token/', 'client_id=lalalala&token=0987').respond();
            });
        });

        it('invalidates the token on the server', function() {
            userService.logout();
            backend.flush();
        });

        it('invalidates the current user', function() {
            userService.logout();
            backend.flush();

            expect(userService.user.username).toBe('');
            expect(userService.user.loggedIn).toBe(false);
            expect(userService.user.token).toBe('');
        });

        it('invalidates the authorization header', function() {
            userService.logout();
            backend.flush();

            expect($http.defaults.headers.Authorization).toBe(undefined);
        });
    });
});

