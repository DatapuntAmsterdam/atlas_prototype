((() => {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('nevenadres', nevenadresFilter);

    function nevenadresFilter () {
        return hoofdadres => {
            const isNevenadres = String(hoofdadres).toLowerCase() === 'false';

            return isNevenadres ? '(nevenadres)' : '';
        };
    }
}))();
