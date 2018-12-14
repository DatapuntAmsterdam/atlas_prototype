import {
    getImageDataById,
    getImageDataByLocation
} from '../../../../src/shared/services/panorama-api/panorama-api';

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
