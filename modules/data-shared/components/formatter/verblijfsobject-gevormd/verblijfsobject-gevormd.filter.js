(function () {
    'use strict';

    angular
        .module('dpDataShared')
        .filter('verblijfsobjectGevormd', verblijfsobjectGevormdFilter);

    function verblijfsobjectGevormdFilter () {
        return function (statusId) {
            const VERBLIJFSOBJECT_GEVORMD = 18;
            const isVerblijfsobjectGevormd = Number(statusId) === VERBLIJFSOBJECT_GEVORMD;

            return isVerblijfsobjectGevormd ? '(verblijfsobject gevormd)' : '';
        };
    }
})();
