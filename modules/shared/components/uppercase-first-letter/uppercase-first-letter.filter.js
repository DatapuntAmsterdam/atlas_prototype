((() => {
    'use strict';

    angular
        .module('dpShared')
        .filter('dpUppercaseFirstLetter', dpUppercaseFirstLetterFilter);

    function dpUppercaseFirstLetterFilter () {
        return input => input.substring(0, 1).toUpperCase() + input.substring(1);
    }
}))();
