/* globals Marzipano */

(function () {
    'use strict';

    angular
        .module('dpPanorama')
        .config(configuration);

    configuration.$inject = ['$provide'];

    function configuration ($provide) {
        $provide.constant('Marzipano', Marzipano);
    }
})();