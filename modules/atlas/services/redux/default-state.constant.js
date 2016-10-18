(function () {
    angular
        .module('atlas')
        .constant('DEFAULT_STATE', {
            map: {
                baseLayer: 'topografie',
                overlays: [],
                viewCenter: [52.3719, 4.9012],
                zoom: 9,
                showActiveOverlays: false,
                isFullscreen: false,
                isLoading: false
            },
            layerSelection: false,
            search: null,
            /*
            search: {
                isLoading: false,
                query: 'linnaeus',
                location: [52.123, 4.789],
                category: null,
                numberOfResults: null
            }
            */
            page: 'home',
            detail: null,
            /*
            detail: {
                endpoint: 'http://api.example.com/bag/verblijfsobject/123/',
                display: 'This is the _display variable as available in each endpoint',
                geometry: null,
                isLoading: false
            }
            */
            straatbeeld: null,
            /*
            straatbeeld: {
                id: 1,
                searchLocation: null,
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
