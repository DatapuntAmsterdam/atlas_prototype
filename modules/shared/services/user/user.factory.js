(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('user', userFactory);

    userFactory.$inject = [
        '$http',
        '$httpParamSerializer',
        '$q',
        '$timeout',
        'sharedConfig',
        'API_CONFIG',
        'userSettings'
    ];

    function userFactory ($http, $httpParamSerializer, $q, $timeout, sharedConfig, API_CONFIG, userSettings) {
        var userState = {},
            accessToken = userSettings.token.value;

        // if sessionStorage is available use the refreshToken function to check if a token is available and valid
        if (accessToken) {
            refreshToken();
        } else {
            userState.username = null;
            userState.accessToken = null;
            userState.isLoggedIn = false;
        }

        //  Refresh the successfully obtained token every 4 and a half minutes (token expires in 5 minutes)
        var intervalDuration = 270000;
        var intervalPromise = null;

        return {
            login: login,
            refreshToken: refreshToken,
            logout: logout,
            getStatus: getStatus
        };

        function login (username, password) {
            return $http({
                method: 'POST',
                url: sharedConfig.API_ROOT + API_CONFIG.AUTH + 'token/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializer(
                    {
                        username: username,
                        password: password
                    }
                )
            })
                .then(loginSuccess, loginError);

            function loginSuccess (response) {
                // This is the username as entered by the user in the login form, backend doesn't return the username
                userState.username = username;
                userState.accessToken = response.data.token;
                userState.isLoggedIn = true;

                userSettings.token.value = userState.accessToken;
                accessToken = response.data.token;

                intervalPromise = $timeout(refreshToken, intervalDuration);
            }

            function loginError (response) {
                var q = $q.defer();

                switch (response.status) {
                    case 400:
                    case 401:
                        q.reject('De combinatie gebruikersnaam en wachtwoord wordt niet herkend.');
                        break;
                    case 404:
                        q.reject('Er is iets mis met de inlog server, probeer het later nog eens.');
                        break;
                    default:
                        q.reject('Er is een fout opgetreden. Neem contact op met de beheerder en vermeld code: ' +
                            response.status + ' status: ' + response.statusText + '.');
                }

                return q.promise;
            }
        }

        function refreshToken () {
            return $http({
                method: 'POST',
                url: sharedConfig.API_ROOT + API_CONFIG.AUTH + 'refresh/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializer(
                    {
                        token: accessToken
                    }
                    )
            })
                .then(refreshSuccess, logout);

            function refreshSuccess (response) {
                userState.accessToken = response.data.token;
                userSettings.token.value = userState.accessToken;
                accessToken = response.data.token;
                userState.isLoggedIn = true;

                intervalPromise = $timeout(refreshToken, intervalDuration);
            }
        }

        function logout () {
            if (intervalPromise) {
                $timeout.cancel(intervalPromise);
            }
            userSettings.token.remove();

            userState.username = null;
            userState.accessToken = null;
            userState.isLoggedIn = false;
        }

        function getStatus () {
            return userState;
        }
    }
})();
