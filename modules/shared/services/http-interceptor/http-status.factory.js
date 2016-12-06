(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('httpStatus', httpStatusFactory);

    function httpStatusFactory () {
        // The sole reponsability is to register if there have been any http errors
        const errorTypes = ['SERVER_ERROR', 'NOT_FOUND_ERROR'],
            exportObject = exportErrorTypes({
                getStatus,
                registerError,
                registerCancel
            });

        let currentStatus = {
            hasErrors: false
        };

        resetTypeFlags();

        return exportObject;

        function getStatus () {
            return currentStatus;
        }

        function registerError (errorType) {
            // Make sure the key is valid. Default to SERVER_ERROR
            const key = errorTypes.filter(type => type === errorType)[0] || errorTypes[0];

            if (!currentStatus.hasErrors) {
                resetTypeFlags();
            }

            currentStatus[key] = true;
            currentStatus.hasErrors = true;
        }

        function registerCancel (request) {
            currentStatus.cancelled = request;
        }

        function resetTypeFlags () {
            errorTypes.forEach(key => {
                currentStatus[key] = false;
            });
        }

        function exportErrorTypes (object) {
            errorTypes.forEach(key => {
                object[key] = key;
            });

            return object;
        }
    }
})();
