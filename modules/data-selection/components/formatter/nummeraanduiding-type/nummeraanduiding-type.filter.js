((() => {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('nummeraanduidingType', nummeraanduidingTypeFilter);

    function nummeraanduidingTypeFilter () {
        return input => {
            let type;

            if (input.ligplaats_id) {
                type = 'ligplaats';
            } else if (input.standplaats_id) {
                type = 'standplaats';
            }

            return type ? '(' + type + ')' : '';
        };
    }
}))();
