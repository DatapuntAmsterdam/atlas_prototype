(function () {
    'use strict';

    angular
        .module('dpMap')
        .constant('MEASURE_CONFIG', {
            position: 'topleft',
            primaryLengthUnit: 'atlasMeters',
            secondaryLengthUnit: null,
            primaryAreaUnit: 'atlasVierkanteMeters',
            activeColor: '#333',
            completedColor: '#333',
            localization: 'nl',
            units: {
                atlasMeters: {
                    factor: 1,
                    display: 'm',
                    decimals: 2
                },
                atlasVierkanteMeters: {
                    factor: 1,
                    display: 'm2',
                    decimals: 2
                }
            }
        });
})();
