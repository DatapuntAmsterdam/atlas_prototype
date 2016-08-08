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
            page: 'welkom',
            detail: null,
            /*
            detail: {
                endpoint: 'bag/verblijfsobject/123/',
                geometry: null,
                isLoading: false
            }
            */
            straatbeeld: null
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
            }
            */
        });
})();
