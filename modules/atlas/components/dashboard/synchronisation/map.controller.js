(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('MapController', MapController);

    MapController.$inject = ['store', 'crsConverter'];

    function MapController (store, crsConverter) {
        let vm = this;

        store.subscribe(update);

        update();

        function update () {
            const state = store.getState();

            vm.markers = {
                regular: [],
                clustered: []
            };

            if (state.search && state.search.location) {
                vm.markers.regular.push({
                    id: 'search',
                    geometry: convertLocationToGeoJSON(state.search.location),
                    useAutoFocus: false
                });
            }

            if (state.detail && state.detail.geometry) {
                vm.markers.regular.push({
                    id: 'detail',
                    geometry: state.detail.geometry,
                    useAutoFocus: true
                });
            }

            if (state.straatbeeld && angular.isArray(state.straatbeeld.location)) {
                vm.markers.regular.push({
                    id: 'straatbeeld_orientation',
                    geometry: convertLocationToGeoJSON(state.straatbeeld.location),
                    orientation: state.straatbeeld.heading,
                    useAutoFocus: false
                });

                vm.markers.regular.push({
                    id: 'straatbeeld_person',
                    geometry: convertLocationToGeoJSON(state.straatbeeld.location),
                    useAutoFocus: false
                });
            }

            if (angular.isObject(state.dataSelection)) {
                vm.markers.clustered = state.dataSelection.markers;
            } else {
                vm.markers.clustered = [];
            }

            vm.mapState = state.map;
            vm.showLayerSelection = state.layerSelection && state.layerSelection.isEnabled;
        }

        function convertLocationToGeoJSON (location) {
            return {
                type: 'Point',
                coordinates: crsConverter.wgs84ToRd(location)
            };
        }
    }
})();
