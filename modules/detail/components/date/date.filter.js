((() => {
    'use strict';

    angular
        .module('dpDetail')
        .filter('dpDate', dpDateFilter);

    dpDateFilter.$inject = ['dateFilter'];

    function dpDateFilter (dateFilter) {
        return input => dateFilter(input, 'd MMMM yyyy');
    }
}))();
