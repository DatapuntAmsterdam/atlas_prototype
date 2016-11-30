(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('bagAddress', bagAddressFilter);

    function bagAddressFilter () {
        return function (input) {
            const nummer = input.huisnummer + input.huisletter,
                fullNummer = nummer + (input.huisnummer_toevoeging ? '-' + input.huisnummer_toevoeging : '');

            return `${input._openbare_ruimte_naam} ${fullNummer}`;
        };
    }
})();
