(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('verblijfsobjectGevormd', verblijfsobjectGevormdFilter);

    function verblijfsobjectGevormdFilter () {
        return function (statusId) {
            // Status id voor verblijfsobject gevormd is 18
            return (Number(statusId) === 18) ? '(verblijfsobject gevormd)' : '';
        };
    }
})();
