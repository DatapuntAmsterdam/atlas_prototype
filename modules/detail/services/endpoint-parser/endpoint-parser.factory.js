import endpointParser from '../../../../src/detail/services/endpoint-parser/endpoint-parser';

(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('endpointParser', () => endpointParser);
})();
