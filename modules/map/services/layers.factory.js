(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('layers', layersFactory);

    layersFactory.$inject = ['L', 'mapConfig', 'BASE_LAYERS', 'OVERLAYS'];

    function layersFactory (L, mapConfig, BASE_LAYERS, OVERLAYS) {
        var baseLayer,
            wmsLayers = {};

        return {
            setBaseLayer: setBaseLayer,
            addOverlay: addOverlay,
            removeOverlay: removeOverlay
        };

        function getBaseLayerTemplate (layerName) {
            var baseLayerTemplate;

            baseLayerTemplate = BASE_LAYERS.filter(function (layer) {
                return layerName === layer.slug;
            })[0];

            return baseLayerTemplate.urlTemplate;
        }

        /*
         * @param {Object} map - A Leaflet map instance
         * @param {String} layerName - A reference to a slug from base-layers.constant.js
         */
        function setBaseLayer (leafletMap, layerName) {
            var template;

            if (leafletMap.hasLayer(baseLayer)) {
                leafletMap.removeLayer(baseLayer);
            }

            template = getBaseLayerTemplate(layerName);

            baseLayer = L.tileLayer(
                template,
                mapConfig.BASE_LAYER_OPTIONS
            );

            leafletMap.addLayer(baseLayer);
        }

        function addOverlay (leafletMap, layerName) {
            getSubLayers(leafletMap, layerName).forEach(function (layer) {
                leafletMap.addLayer(layer);
            });
        }

        function removeOverlay (leafletMap, layerName) {
            getSubLayers(leafletMap, layerName).forEach(function (layer) {
                leafletMap.removeLayer(layer);
            });
        }

        function getSubLayers (leafletMap, overlayName) {
            var wmsLayerId,
                wmsUrl,
                wmsSource;

            wmsLayerId = leafletMap._leaflet_id + '_' + overlayName;

            if (angular.isUndefined(wmsLayers[wmsLayerId])) {
                wmsLayers[wmsLayerId] = [];
                wmsUrl = OVERLAYS.SOURCES[overlayName].url;

                if (!OVERLAYS.SOURCES[overlayName].external) {
                    wmsUrl = mapConfig.OVERLAY_ROOT + wmsUrl;
                }

                wmsSource = L.WMS.source(wmsUrl, mapConfig.OVERLAY_OPTIONS);

                OVERLAYS.SOURCES[overlayName].layers.forEach(function (layerName) {
                    wmsLayers[wmsLayerId].push(wmsSource.getLayer(layerName));
                });
            }

            return wmsLayers[wmsLayerId];
        }
    }
})();
