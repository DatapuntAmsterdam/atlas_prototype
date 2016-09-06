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
            straatbeeld: null,
            
            /*
            straatbeeld: {
                id: 1,
                searchLocation: null,
                date: null,
                car: {
                    location: [52.789, 4.123]
                },
                camera: {
                    heading: 180,
                    pitch: 0
                },
                hotspots: [],
                isLoading: false
            }
            */
            isPrintMode: false
        });
})();
