((() => {
    'use strict';

    angular
        .module('dpMap')
        .factory('layers', layersFactory);

    layersFactory.$inject = ['$q', 'api', 'L', 'mapConfig', 'BASE_LAYERS', 'overlays'];

    function layersFactory ($q, api, L, mapConfig, BASE_LAYERS, overlays) {
        var baseLayer,
            wmsLayers = {};

        return {
            setBaseLayer: setBaseLayer,
            addOverlay: addOverlay,
            removeOverlay: removeOverlay
        };

        function getBaseLayerTemplate (layerName) {
            var baseLayerTemplate;

            baseLayerTemplate = BASE_LAYERS.filter(layer => layerName === layer.slug)[0];

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
            getSubLayers(leafletMap, layerName).then(subLayers => {
                subLayers.forEach(layer => {
                    leafletMap.addLayer(layer);
                });
            });
        }

        function removeOverlay (leafletMap, layerName) {
            getSubLayers(leafletMap, layerName).then(subLayers => {
                subLayers.forEach(layer => {
                    leafletMap.removeLayer(layer);
                });
            });
        }

        function getSubLayers (leafletMap, overlayName) {
            const wmsLayerId = leafletMap._leaflet_id + '_' + overlayName;

            if (!wmsLayers[wmsLayerId] && overlays.SOURCES[overlayName]) {
                wmsLayers[wmsLayerId] = getWmsUrl(overlayName).then(wmsUrl => {
                    const wmsSource = L.WMS.source(wmsUrl, mapConfig.OVERLAY_OPTIONS);
                    return overlays.SOURCES[overlayName].layers.map(layerName => {
                        return wmsSource.getLayer(layerName);
                    });
                });
            } else if (!wmsLayers[wmsLayerId]) {
                wmsLayers[wmsLayerId] = $q.resolve([]);
            }

            return wmsLayers[wmsLayerId];
        }

        function getWmsUrl (overlayName) {
            const overlay = overlays.SOURCES[overlayName];
            return overlay.external ? $q.resolve(overlay.url)
                : api.createUrlWithToken(mapConfig.OVERLAY_ROOT + overlay.url);
        }
    }
}))();
