(function () {
    'use strict';

    angular
        .module('dpShared')
        .constant('CRS_CONFIG', {
            RD: {
                code: 'EPSG:28992',
                projection: '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +' +
                    'y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.3507326' +
                    '76542563,-1.8703473836068,4.0812 +no_defs',
                transformation: {
                    resolutions: [
                        3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360,
                        1.680, 0.840, 0.420, 0.210, 0.105, 0.0525
                    ],
                    bounds: [
                        [-285401.92, 22598.08],
                        [595401.9199999999, 903401.9199999999]
                    ],
                    origin: [-285401.92, 22598.08]
                }
            },
            WGS84: {
                code: 'EPSG:4326',
                projection: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
            },
            EARTH_RADIUS: 6378137 // The radius in meters
        });
})();
