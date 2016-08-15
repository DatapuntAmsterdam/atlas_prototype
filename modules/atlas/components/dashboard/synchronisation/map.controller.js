(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('MapController', MapController);

    MapController.$inject = ['store', 'crsConverter'];

    function MapController (store, crsConverter) {
        var vm = this;

        store.subscribe(update);

        update();

        function update () {
            var state = store.getState();

            vm.markers = [];

            if (state.search && state.search.location) {
                vm.markers.push({
                    id: 'search',
                    geometry: convertLocationToGeoJSON(state.search.location),
                    useAutoFocus: false
                });
            }

            if (state.detail && state.detail.geometry) {
                vm.markers.push({
                    id: 'detail',
                    geometry: state.detail.geometry,
                    useAutoFocus: true
                });
            }

            if (state.straatbeeld && state.straatbeeld.car && state.straatbeeld.car.location) {
                vm.markers.push({
                    id: 'straatbeeld_orientation',
                    geometry: convertLocationToGeoJSON(state.straatbeeld.car.location),
                    orientation: state.straatbeeld.camera.heading,
                    useAutoFocus: false
                });

                vm.markers.push({
                    id: 'straatbeeld_person',
                    geometry: convertLocationToGeoJSON(state.straatbeeld.car.location),
                    useAutoFocus: false
                });
            }

            vm.mapState = state.map;
        }

        function convertLocationToGeoJSON (location) {
            return {
                type: 'Point',
                coordinates: crsConverter.wgs84ToRd(location)
            };
        }
    }
})();