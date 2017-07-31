((() => {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .constant('STRAATBEELD_CONFIG', {
            STRAATBEELD_ENDPOINT_ALL: 'panorama/recente_opnames/alle/',
            STRAATBEELD_ENDPOINT_YEAR: 'panorama/recente_opnames/',
            DEFAULT_FOV: 80,
            MAX_FOV: 90,
            MAX_RESOLUTION: 12 * 1024,
            CAMERA_HEIGHT: 1.8,
            LEVEL_PROPERTIES_LIST: [
                {
                    tileSize: 256,
                    size: 256,
                    fallbackOnly: true
                },
                {
                    tileSize: 512,
                    size: 512
                },
                {
                    tileSize: 512,
                    size: 1024
                },
                {
                    tileSize: 512,
                    size: 2048
                }
            ]
        });
}))();
