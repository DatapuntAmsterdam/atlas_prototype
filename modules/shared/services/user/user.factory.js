(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('user', userFactory);

    userFactory.$inject = ['$window', 'userSettings'];

    function userFactory ($window, userSettings) {
        const USER_TYPE = { // the possible types of a user
            NONE: 'NONE',
            ANONYMOUS: 'ANONYMOUS',
            AUTHENTICATED: 'AUTHENTICATED'
        };

        const AUTHORIZATION_LEVEL = {   // The possible user authorization levels
            NONE: 'NONE',
            DEFAULT: 'DEFAULT',
            EMPLOYEE: 'EMPLOYEE',
            EMPLOYEE_PLUS: 'EMPLOYEE_PLUS'
        };

        const AUTHORIZATION_LEVEL_MAPPING = {   // maps the backend level codes upon a valid authorization level
            0: AUTHORIZATION_LEVEL.DEFAULT,
            1: AUTHORIZATION_LEVEL.EMPLOYEE,
            3: AUTHORIZATION_LEVEL.EMPLOYEE_PLUS
        };

        class User {
            constructor () {
                this.init = function () {   // initialize private properties
                    this._accessToken = null;
                    this._authorizationLevel = AUTHORIZATION_LEVEL.NONE;
                    this.name = '';
                };

                this.decodeToken = function (token) {
                    try {
                        return angular.fromJson(
                            $window.atob(token
                                .split('.')[1]
                                .replace('-', '+')
                                .replace('_', '/')
                            ));
                    } catch (e) {
                        return {};
                    }
                };

                this.parseToken = function (token) {   // private method to parse a refresh or access token
                    let content = this.decodeToken(token);

                    if (angular.isDefined(content.sub)) {   // contained in refresh token
                        this.name = content.sub || '';
                    }

                    if (angular.isDefined(content.authz)) { // contained in access token
                        this.authorizationLevel = content.authz;
                    }
                };

                this.init();

                if (this.refreshToken) {                // get any existing refresh token
                    this.parseToken(this.refreshToken); // and parse its contents
                }
            }

            clear () {
                userSettings.refreshToken.remove();
                userSettings.userType.remove();

                this.init();
            }

            get refreshToken () {
                return userSettings.refreshToken.value; // the refresh token in stored in the session
            }

            set refreshToken (value) {
                userSettings.refreshToken.value = value;
                this.parseToken(value);
            }

            get accessToken () {
                return this._accessToken;
            }

            set accessToken (value) {
                this._accessToken = value;
                this.parseToken(value);
            }

            get type () {
                return USER_TYPE[userSettings.userType.value] || USER_TYPE.NONE;
            }

            set type (value) {
                userSettings.userType.value = USER_TYPE[value];
            }

            get name () {
                return this._name;
            }

            set name (value) {
                this._name = value;
            }

            get authorizationLevel () {
                return AUTHORIZATION_LEVEL[this._authorizationLevel];
            }

            set authorizationLevel (value) {
                this._authorizationLevel = AUTHORIZATION_LEVEL_MAPPING[value] || AUTHORIZATION_LEVEL.NONE;
            }
        }

        let user = new User();

        return {
            getRefreshToken,
            setRefreshToken,
            getAccessToken,
            setAccessToken,
            getName,
            getAuthorizationLevel,
            getUserType,
            clearToken,
            USER_TYPE,
            AUTHORIZATION_LEVEL
        };

        function getRefreshToken () {
            return user.refreshToken;
        }

        function setRefreshToken (token, userType) {
            user.type = userType;
            user.refreshToken = token;
        }

        function getAccessToken () {
            return user.accessToken;
        }

        function setAccessToken (token) {
            user.accessToken = token;
        }

        function getUserType () {
            return user.type;
        }

        function getName () {
            return user.name;
        }

        function getAuthorizationLevel () {
            return user.authorizationLevel;
        }

        function clearToken () {
            user.clear();
        }
    }
})();
