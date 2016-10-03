(function () {
    angular
        .module('atlas')
        .constant('DEFAULT_STATE', {
            map: {
                baseLayer: 'topografie',
                overlays: [],
                viewCenter: [52.3719, 4.9012],
                zoom: 9,
                highlight: null,
                showLayerSelection: false,
                showActiveOverlays: false,
                isFullscreen: false,
                isLoading: false
            },
            search: null,
            /*
            search: {
                query: 'linnaeus',
                location: [52.123, 4.789],
                category: null
            }
            */
            page: 'home',
            detail: null,
            /*
            detail: {
                endpoint: 'bag/verblijfsobject/123/',
                geometry: null,
                isLoading: false
            }
            */
            panorama: null,
            /*
            panorama: {
                id: 1,
                date: null,
                car: {
                    location: [52.789, 4.123],
                    heading: 20,
                    pitch: 0.1
                },
                camera: {
                    heading: 180,
                    pitch: 0.5
                },
                hotspots: [],
                isLoading: false
            },
            */
            dataSelection: null,
            /*
            dataSelection: {
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            },
            */
            isPrintMode: false
        });
})();
