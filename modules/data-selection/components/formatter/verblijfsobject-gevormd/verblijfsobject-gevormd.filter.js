((() => {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('verblijfsobjectGevormd', verblijfsobjectGevormdFilter);

    function verblijfsobjectGevormdFilter () {
        return statusId => {
            const VERBLIJFSOBJECT_GEVORMD = 18;
            const isVerblijfsobjectGevormd = Number(statusId) === VERBLIJFSOBJECT_GEVORMD;

            return isVerblijfsobjectGevormd ? '(verblijfsobject gevormd)' : '';
        };
    }
}))();
