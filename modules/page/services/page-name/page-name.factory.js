(function () {
    'use strict';

    angular
        .module('dpPage')
        .factory('pageName', pageNameFactory);

    pageNameFactory.$inject = ['PAGE_NAMES'];

    function pageNameFactory (PAGE_NAMES) {
        return pageName => PAGE_NAMES[pageName];
    }
})();
