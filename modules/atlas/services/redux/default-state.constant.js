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
                isLoading: false,
                drawingMode: null,
                pointsDrawn: 0
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
                isLoading: false,
                isFullscreen: false
            }
            */
            straatbeeld: null,
            /*
            straatbeeld: {
                id: 'ABC123',
                date: new Date(),
                location: [52.8, 4.9],
                image: {
                    pattern: 'http://www.example.com/path/some-id/{this}/{that}/{thingie}.jpg',
                    preview: 'http://www.example.com/path/some-id/preview.jpg'
                },
                heading: 270,
                pitch: -10,
                fov: 65,
                hotspots: [{
                    id: 'ABC124',
                    heading: 90,
                    distance: 18
                }],
                isLoading: false,
                isInitial: true,
                isFullscreen: true
            },
            */
            dataSelection: null,
            /*
            dataSelection: {
                view: 'TABLE',
                dataset: 'bag',
                filters: { (OR :String)
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                query: 'searchText',
                page: 1,
                markers: [
                    [52.1, 4.1],
                    [52.2, 4.0]
                ],
                isFullscreen: true,
                isLoading: false,
                shape: [
                    [52.1, 4.1],
                    [52.2, 4.0],
                    [52.3, 4.2]
                ]
            },
            */
            isPrintMode: false
        });
})();
