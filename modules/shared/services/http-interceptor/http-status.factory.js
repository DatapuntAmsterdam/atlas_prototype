(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('httpStatus', httpStatusFactory);

    function httpStatusFactory () {
        // The sole reponsability is to register if there have been any http errors
        let status = {
            hasErrors: false
        };

        return {
            getStatus,
            registerError
        };

        function getStatus () {
            return status;
        }

        function registerError () {
            status.hasErrors = true;
        }
    }
})();
