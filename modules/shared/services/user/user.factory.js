(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('user', userFactory);

    userFactory.$inject = ['userSettings'];

    function userFactory (userSettings) {
        const USER_TYPE = {
            NONE: 'NONE',
            ANONYMOUS: 'ANONYMOUS',
            AUTHENTICATED: 'AUTHENTICATED'
        };

        let accessToken = null;

        return {
            getRefreshToken,
            setRefreshToken,
            getAccessToken,
            setAccessToken,
            getUserType,
            clearToken,
            USER_TYPE
        };

        function getRefreshToken () {
            return userSettings.refreshToken.value;
        }

        function setRefreshToken (token, userType) {
            userSettings.refreshToken.value = token;
            userSettings.userType.value = USER_TYPE[userType];
        }

        function getAccessToken () {
            return accessToken;
        }

        function setAccessToken (token) {
            accessToken = token;
        }

        function getUserType () {
            return USER_TYPE[userSettings.userType.value] || USER_TYPE.NONE;
        }

        function clearToken () {
            accessToken = null;
            userSettings.refreshToken.remove();
            userSettings.userType.remove();
        }
    }
})();
