/* globals d3, BBGA */

(function () {
    'use strict';

    angular
        .module('atlasDetail')
        .config(configuration);

    configuration.$inject = ['$provide'];

    function configuration ($provide) {
        $provide.constant('BBGA', BBGA);
        $provide.constant('d3', d3);
    }
})();
