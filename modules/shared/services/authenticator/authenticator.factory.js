(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('authenticator', authenticatorFactory);

    authenticatorFactory.$inject = [
        '$http',
        '$interval',
        'sharedConfig',
        'user',
        '$window',
        '$location',
        'storage',
        'uriStripper'
    ];

    function authenticatorFactory (
        $http,
        $interval,
        sharedConfig,
        user,
        $window,
        $location,
        storage,
        uriStripper) {
        const ERROR_MESSAGES = {
            400: 'Verplichte parameter is niet aanwezig.',
            404: 'Er is iets mis met de inlog server, probeer het later nog eens.',
            502: 'Probleem in de communicatie met de inlog server.',
            504: 'Inlog server timeout, probeer het later nog eens.'
        };

        const AUTH_PARAMS = ['a-select-server', 'aselect_credentials', 'rid'];

        const AUTH_PATH = 'auth/';
        const LOGIN_PATH = 'idp/login';
        const REFRESH_TOKEN_PATH = 'idp/token';
        const ACCESS_TOKEN_PATH = 'accesstoken';

        const CALLBACK_PARAMS = 'callbackParams';   // save callback params in session storage

        const REFRESH_INTERVAL = 1000 * 60 * 4.5;   // every 4.5 minutes

        const STATE = {     // State transitions used in tokenLoop
            INIT: () =>
                STATE.RESTORE_REFRESH_TOKEN,
            RESTORE_REFRESH_TOKEN: () =>
                user.getRefreshToken() ? STATE.REQUEST_ACCESS_TOKEN : STATE.WAIT,
            ON_REFRESH_TOKEN: () =>
                STATE.REQUEST_ACCESS_TOKEN,
            ON_REFRESH_TOKEN_ERROR: () =>
                STATE.WAIT,
            REQUEST_ACCESS_TOKEN: () =>
                requestAccessToken(user.getRefreshToken()),
            ON_ACCESS_TOKEN: () =>
                tokenLoop(STATE.REQUEST_ACCESS_TOKEN, REFRESH_INTERVAL),
            ON_ACCESS_TOKEN_ERROR: () =>
                STATE.WAIT,
            ON_LOGOUT: () =>
                STATE.WAIT,
            WAITING: () =>
                null // Wait for re-invocation of the tokenLoop...
        };

        let interval;   // refresh access token or retry after error interval

        const error = {}; // message, status and statusText

        return {
            initialize,
            login,
            logout,
            isCallback,
            handleCallback,
            error
        };

        function tokenLoop (state, delay) {
            if (delay) {    // invoke tokenLoop after delay has passed
                interval = $interval(() => tokenLoop(state), delay, 1); // $timeout will fail with protractor tests
                return STATE.WAITING;
            } else if (interval) {  // cancel any existing delayed execution, eg when logout is called
                $interval.cancel(interval);
            }

            while (state) {
                state = state();    // simple keep executing state transitions
            }
        }

        function initialize () {
            setError();
            tokenLoop(STATE.INIT);
        }

        function onRefreshToken (token, userType) {
            setError();
            user.setRefreshToken(token, userType);
            tokenLoop(STATE.ON_REFRESH_TOKEN);
        }

        function onAccessToken (token) {
            setError();
            user.setAccessToken(token);
            restorePath();  // Restore path from session
            tokenLoop(STATE.ON_ACCESS_TOKEN);
        }

        function onRefreshTokenError (response) {
            onError(response, STATE.ON_REFRESH_TOKEN_ERROR);
        }

        function onAccessTokenError (response) {
            onError(response, STATE.ON_ACCESS_TOKEN_ERROR);
        }

        function logout () {
            user.clearToken();
            tokenLoop(STATE.ON_LOGOUT);
        }

        function onError (response, state) {
            user.clearToken();
            setError(
                ERROR_MESSAGES[response.status] ||
                'Er is een fout opgetreden. Neem contact op met de beheerder en vermeld ' +
                'code: ${response.status}, status: ${response.statusText}.',
                response.status,
                response.statusText);
            restorePath();  // Restore path from session
            tokenLoop(state);
        }

        function setError (message, status, statusText) {
            error.message = message || '';
            error.status = status || null;
            error.statusText = statusText || '';
        }

        function savePath () {
            const params = $location.search();
            if (params.dte) {
                // $location.search may return old parameters even though URL does not list them.
                // This mean the dte parameter may incorrectly contain the domain:
                //  e.g.: https:data.amsterdam.nl/foo/bar instead of foo/bar.
                // This step ensures no domain and protocol are stored, so the correct path is restored after login.
                // Seems like an Angular bug when not using HTML5 $location provider. Consider removing when/if
                // HTML5 location mode is activated. https://github.com/angular/angular.js/issues/1521
                params.dte = uriStripper.stripUri(params.dte);
            }
            storage.session.setItem(CALLBACK_PARAMS, angular.toJson(params));   // encode params
        }

        function restorePath () {
            let params = storage.session.getItem(CALLBACK_PARAMS);
            storage.session.removeItem(CALLBACK_PARAMS);
            if (params) {
                params = params && angular.fromJson(params);    // decode params
                $location.replace();    // overwrite the existing location (prevent back button to re-login)
                $location.search(params);
            }
        }

        function login () {     // redirect to external authentication provider
            savePath(); // Save current path in session
            const callback = $location.absUrl().replace(/\#.*$/, '').concat('#');   // Remove all parameters
            $window.location.href =
                sharedConfig.API_ROOT + AUTH_PATH +
                LOGIN_PATH + '?callback=' + encodeURIComponent(callback);
        }

        function handleCallback (params) {  // request user token with returned authorization parameters from callback
            RequestRefreshToken(params);
        }

        function isCallback (params) {
            // it is a callback when all authorization parameters are defined in the params
            // the fastest check is not to check if all parameters are defined but
            // to check that no undefined parameter can be found
            return !AUTH_PARAMS.find(key => angular.isUndefined(params[key]));
        }

        function RequestRefreshToken (params) {    // initiated externally, called by handleCallback
            const httpParams = AUTH_PARAMS.reduce((result, key) => {
                result[key] = params[key];
                return result;
            }, {});
            return authRequest(REFRESH_TOKEN_PATH, {}, httpParams)
                .then(response => onRefreshToken(response.data, user.USER_TYPE.AUTHENTICATED), onRefreshTokenError);
        }

        function requestAccessToken (token) {   // initiated by tokenLoop, return WAITING
            authRequest(ACCESS_TOKEN_PATH, {'Authorization': sharedConfig.AUTH_HEADER_PREFIX + token})
                .then(response => onAccessToken(response.data), onAccessTokenError);
            return STATE.WAITING;
        }

        function authRequest (url, headers, params) {
            return $http({
                method: 'GET',
                url: sharedConfig.API_ROOT + AUTH_PATH + url,
                headers: angular.merge({'Content-Type': 'text/plain'}, headers),
                params: params
            });
        }
    }
})();
