(function () {
    'use strict';

    angular
        .module('dpMap')
        .constant('MEASURE_CONFIG', {
            position: 'topleft',
            primaryLengthUnit: 'dpMeters',
            secondaryLengthUnit: null,
            primaryAreaUnit: 'dpSquareMeters',
            activeColor: '#333',
            completedColor: '#333',
            localization: 'nl',
            units: {
                dpMeters: {
                    factor: 1,
                    display: 'm',
                    decimals: 2
                },
                dpSquareMeters: {
                    factor: 1,
                    display: 'm2',
                    decimals: 2
                }
            }
        });
})();
