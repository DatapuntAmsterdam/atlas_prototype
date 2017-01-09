(function () {
    'use strict';

    angular
        .module('dpDataShared')
        .filter('nummeraanduidingType', nummeraanduidingTypeFilter);

    function nummeraanduidingTypeFilter () {
        return function (input) {
            let type;

            if (input.ligplaats_id) {
                type = 'ligplaats';
            } else if (input.standplaats_id) {
                type = 'standplaats';
            }

            return type ? '(' + type + ')' : '';
        };
    }
})();
