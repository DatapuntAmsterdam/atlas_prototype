import {
    getImageDataById,
    getImageDataByLocation
} from '../../../../src/shared/services/straatbeeld-api/straatbeeld-api';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('straatbeeldApi', straatbeeldApiFactory);

    function straatbeeldApiFactory () {
        return {
            getImageDataById,
            getImageDataByLocation
        };
    }
})();
