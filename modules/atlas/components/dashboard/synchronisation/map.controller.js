(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('MapController', MapController);

    MapController.$inject = ['store', 'crsConverter'];

    function MapController (store, crsConverter) {
        const vm = this;

        store.subscribe(update);

        update();

        function update () {
            const state = store.getState();

            vm.markers = {
                regular: [],
                clustered: [],
                parkeervakken: []
            };

            // drawGeometry = geometryfilter of dataselection
            vm.drawGeometry = {
                markers: []
            };

            if (state.search && state.search.location) {
                vm.markers.regular.push({
                    id: 'search',
                    geometry: angular.copy(convertLocationToGeoJSON(state.search.location)),
                    useAutoFocus: false
                });
            }

            if (state.detail && state.detail.geometry) {
                vm.markers.regular.push({
                    id: 'detail',
                    geometry: angular.copy(state.detail.geometry),
                    useAutoFocus: true
                });
            }

            if (state.straatbeeld && angular.isArray(state.straatbeeld.location)) {
                vm.markers.regular.push({
                    id: 'straatbeeld_orientation',
                    geometry: angular.copy(convertLocationToGeoJSON(state.straatbeeld.location)),
                    orientation: state.straatbeeld.heading,
                    useAutoFocus: false
                });

                vm.markers.regular.push({
                    id: 'straatbeeld_person',
                    geometry: angular.copy(convertLocationToGeoJSON(state.straatbeeld.location)),
                    useAutoFocus: false
                });
            }

            if (state.parkeervakken.geolocation && state.parkeervakken.geolocation.singleshape) {
                vm.markers.regular.push({
                    id: 'parkeervakken',
                    geometry: state.parkeervakken.geolocation.singleshape,
                    useAutoFocus: false
                });
            }

            if (angular.isObject(state.dataSelection)) {
                vm.markers.regular = [];
                vm.markers.clustered = state.dataSelection.markers;
                vm.drawGeometry.markers = state.dataSelection.geometryFilter.markers;
            } else {
                vm.markers.clustered = [];
                vm.drawGeometry.markers = [];
            }

            vm.mapState = state.map;
            vm.parkeervakken = state.parkeervakken;
        }

        function convertLocationToGeoJSON (location) {
            return {
                type: 'Point',
                coordinates: crsConverter.wgs84ToRd(location)
            };
        }
    }
})();
