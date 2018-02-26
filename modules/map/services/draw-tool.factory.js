import {
    initialize,
    enable,
    disable,
    isEnabled
} from '../../../src/map/services/draw-tool/draw-tool';

/* istanbul ignore next */
(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('drawTool', drawToolFactory);

    drawToolFactory.$inject = [];

    function drawToolFactory () {
        return {
            initialize,
            enable,
            disable,
            isEnabled
        };
    }
})();
