(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('layers', layersFactory);

        layersFactory.$inject = ['L', 'mapConfig', 'BASE_LAYERS', 'OVERLAYS'];

    function layersFactory (L, mapConfig, BASE_LAYERS, OVERLAYS) {
        var baseLayer;

        return {
            setBaseLayer: setBaseLayer,
            addOverlay: addOverlay,
            removeOverlay: removeOverlay
        };

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

            function getBaseLayerTemplate (layerName) {
                var baseLayer;

                baseLayer = BASE_LAYERS.filter(function (baseLayer) {
                    return layerName === baseLayer.slug;
                })[0];

                return baseLayer.urlTemplate;
            }
        }

        function addOverlay (leafletMap, layerName) {
            getSubLayers(layerName).forEach(function (layer) {
                leafletMap.addLayer(layer);
            });
        }

        function removeOverlay (leafletMap, layerName) {
            getSubLayers(layerName).forEach(function (layer) {
                leafletMap.removeLayer(layer);
            });
        }

        function getSubLayers (overlayName) {
            var wmsLayers = [],
                wmsUrl,
                wmsSource;

            wmsUrl = OVERLAYS.SOURCES[overlayName].url;

            if (!OVERLAYS.SOURCES[overlayName].external) {
                wmsUrl = mapConfig.OVERLAY_ROOT + wmsUrl;
            }

            wmsSource = L.WMS.source(wmsUrl, mapConfig.OVERLAY_OPTIONS);

            OVERLAYS.SOURCES[overlayName].layers.forEach(function (layerName) {
                wmsLayers.push(wmsSource.getLayer(layerName));
            });

            return wmsLayers;
        }
    }
})();
