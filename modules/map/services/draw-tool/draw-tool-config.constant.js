(function () {
    'use strict';

    angular
        .module('dpMap')
        .constant('DRAW_TOOL_CONFIG', {
            edit: {
            },
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                    showLength: true,
                    metric: ['km', 'm'],
                    precision: {
                        m: 1
                    }
                },
                marker: false,
                circle: false,
                rectangle: false,
                polyline: false
            },
            MAX_POINTS: 10,
            POINT_WARNING_THRESHOLD: 5
        });
})();
