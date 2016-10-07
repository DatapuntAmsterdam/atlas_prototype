(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('mapConfig', mapConfigFactory);

    mapConfigFactory.$inject = ['environment', 'crsService', 'BOUNDING_BOX'];

    function mapConfigFactory (environment, crsService, BOUNDING_BOX) {
        var globalConfig,
            environmentConfig;

        globalConfig = {
            BASE_LAYER_OPTIONS: {
                minZoom: 8,
                maxZoom: 16,
                tms: true
            },
            MAP_OPTIONS: {
                crs: crsService.getRd(),
                maxBounds: [
                    BOUNDING_BOX.COORDINATES.southWest,
                    BOUNDING_BOX.COORDINATES.northEast
                ],
                attributionControl: false,
                zoomControl: false
            },
            OVERLAY_OPTIONS: {
                identify: false,
                format: 'image/png',
                transparent: true
            },
            SCALE_OPTIONS: {
                position: 'bottomright',
                metric: true,
                imperial: false
            },
            ZOOM_OPTIONS: {
                position: 'bottomright',
                zoomInTitle: 'Inzoomen',
                zoomOutTitle: 'Uitzoomen'
            },
            DEFAULT_ZOOM_HIGHLIGHT: 14
        };

        environmentConfig = {
            DEVELOPMENT: {
                BASE_LAYER_OPTIONS: {
                    subdomains: ['t1-acc', 't2-acc', 't3-acc', 't4-acc']
                },
                OVERLAY_ROOT: 'https://map-acc.datapunt.amsterdam.nl/'
            },
            PRODUCTION: {
                BASE_LAYER_OPTIONS: {
                    subdomains: ['t1', 't2', 't3', 't4']
                },
                OVERLAY_ROOT: 'https://map.datapunt.amsterdam.nl/'
            }
        };

        return angular.merge(globalConfig, environmentConfig[environment.NAME]);
    }
})();
