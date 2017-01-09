(function () {
    'use strict';

    angular
        .module('dpDataShared')
        .filter('nevenadres', nevenadresFilter);

    function nevenadresFilter () {
        return function (hoofdadres) {
            const isNevenadres = String(hoofdadres).toLowerCase() === 'false';

            return isNevenadres ? '(nevenadres)' : '';
        };
    }
})();
