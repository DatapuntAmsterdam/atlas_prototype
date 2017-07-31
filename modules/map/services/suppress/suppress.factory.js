((() => {
    'use strict';

    angular
        .module('dpMap')
        .factory('suppress', suppressFactory);

    suppressFactory.$inject = ['$interval'];

    function suppressFactory ($interval) {
        let suppressing = false;

        return {
            isBusy: () => suppressing,
            start: (period = 100) => {
                suppressing = true;
                $interval(() => {
                    suppressing = false;
                }, period, 1);
            }
        };
    }
}))();
