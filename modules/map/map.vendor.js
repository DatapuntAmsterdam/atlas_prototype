/* globals L */

((() => {
    'use strict';

    angular
        .module('dpMap')
        .config(configuration);

    configuration.$inject = ['$provide'];

    function configuration ($provide) {
        $provide.constant('L', L);
    }
}))();
