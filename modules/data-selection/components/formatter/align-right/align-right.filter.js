((() => {
    'use strict';

    angular
        .module('dpDataSelection')
        .filter('alignRight', alignRightFilter);

    function alignRightFilter () {
        return input => '<div class=\'u-align--right\'>' + input + '</div>';
    }
}))();
