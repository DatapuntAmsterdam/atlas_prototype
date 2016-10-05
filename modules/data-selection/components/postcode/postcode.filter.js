(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('postcode', postcodeFilter);

    function postcodeFilter () {
        return function (input) {
            // Only touch valid Dutch postcodes, leave all other input unchanged
            if (input && input.match(/^[1-9][0-9]{3}[a-zA-Z]{2}$/)){
                return input.substr(0, 4) + ' ' + input.substr(4, 2).toUpperCase();
            } else {
                return input;
            }
        };
    }
})();
