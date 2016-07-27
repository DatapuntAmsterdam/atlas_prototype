(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('api', apiFactory);

    apiFactory.$inject = ['$http', 'user'];

    function apiFactory ($http, user) {
        return {
            getByUrl: getByUrl
        };

        function getByUrl (url) {
            var headers = {},
                userState;

            userState = user.getStatus();

            if (userState.loggedIn) {
                headers.Authorization = 'Bearer ' + userState.accessToken;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: headers,
                /*
                Caching is set to false to enforce distinction between logged in users and guests. The API doesn't
                support tokens yet.
                */
                cache: false
            }).then(function (response) {
                return response.data;
            });
        }
    }
})();