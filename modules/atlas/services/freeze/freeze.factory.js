import deepFreeze from '../../../../src/shared/services/freeze/freeze';

/* istanbul ignore next */
(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('freeze', freezeFactory);

    function freezeFactory () {
        return {
            deepFreeze
        };
    }
})();
