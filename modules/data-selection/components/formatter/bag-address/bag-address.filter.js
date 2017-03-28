(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('bagAddress', bagAddressFilter);

    function bagAddressFilter () {
        return function (input) {
            const fullNummer = (input.huisnummer + input.huisletter) +
                (input.huisnummer_toevoeging ? '-' + input.huisnummer_toevoeging : '');

            return `${input._openbare_ruimte_naam} ${fullNummer}`;
        };
    }
})();
