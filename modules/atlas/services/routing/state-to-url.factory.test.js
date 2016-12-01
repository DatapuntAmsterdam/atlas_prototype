describe('The stateToUrl factory', function () {
    var $location,
        stateToUrl,
        mockedState;

    beforeEach(function () {
        angular.mock.module('atlas', function ($provide) {
            $provide.constant('URL_COMPRESSION', []);
        });

        angular.mock.inject(function (_$location_, _stateToUrl_, _DEFAULT_STATE_) {
            $location = _$location_;
            stateToUrl = _stateToUrl_;
            mockedState = angular.copy(_DEFAULT_STATE_);
        });

        spyOn($location, 'replace');
        spyOn($location, 'search');
    });

    describe('create', function () {
        it('creates a query string', function () {
            expect(stateToUrl.create(mockedState)).toBe([
                '#?lat=', mockedState.map.viewCenter[0],
                '&lon=', mockedState.map.viewCenter[1],
                '&basiskaart=', mockedState.map.baseLayer,
                '&zoom=', mockedState.map.zoom,
                '&pagina=', mockedState.page
            ].join(''));
        });
    });

    describe('Search', function () {
        it('can contain a query', function () {
            mockedState.search = {
                query: 'i_am_a_query',
                location: null,
                category: null
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                zoek: 'i_am_a_query'
            }));
        });

        it('can contain a location', function () {
            mockedState.search = {
                query: null,
                location: [52.123, 4.789],
                category: null
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                zoek: '52.123,4.789'
            }));
        });

        it('can have an active category', function () {
            mockedState.search = {
                query: 'i_am_a_query',
                location: null,
                category: 'adres'
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                categorie: 'adres'
            }));
        });

        it('can be omitted', function () {
            mockedState.search = null;

            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                zoek: jasmine.any(String)
            }));
        });
    });

    describe('Map', function () {
        it('updates the location', function () {
            mockedState.map.viewCenter = [52.789, 4.123];

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                lat: '52.789',
                lon: '4.123'
            }));
        });

        it('updates the baseLayer', function () {
            mockedState.map.baseLayer = 'historische_luchtfoto_1825';

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                basiskaart: 'historische_luchtfoto_1825'
            }));
        });

        it('can contain one of more overlays', function () {
            // No overlays, no parameter
            mockedState.map.overlays = [];

            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                lagen: jasmine.any(String)
            }));

            // One overlay
            mockedState.map.overlays = [{id: 'overlay_x', isVisible: true}];

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                lagen: 'overlay_x:zichtbaar'
            }));

            // Two overlays
            mockedState.map.overlays = [
                {id: 'overlay_x', isVisible: true},
                {id: 'overlay_y', isVisible: false}
            ];

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                lagen: 'overlay_x:zichtbaar,overlay_y:onzichtbaar'
            }));
        });

        it('keeps track of the zoom level', function () {
            mockedState.map.zoom = 8;

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                zoom: '8'
            }));
        });

        it('keeps track of the state of the layer selection (opened or closed)', function () {
            // Closed
            mockedState.map.showActiveOverlays = false;
            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                'actieve-kaartlagen': jasmine.anything()
            }));

            // Opened
            mockedState.map.showActiveOverlays = true;
            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                'actieve-kaartlagen': 'aan'
            }));
        });

        it('keeps track of the isFullscreen state', function () {
            // Closed
            mockedState.map.isFullscreen = false;
            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                'volledig-scherm': jasmine.anything()
            }));

            // Opened
            mockedState.map.isFullscreen = true;
            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                'volledig-scherm': 'aan'
            }));
        });
    });

    describe('Layer selection', function () {
        it('keeps track of the state of the layer selection (opened or closed)', function () {
            // Closed
            mockedState.layerSelection = false;
            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                'kaartlagen-selectie': jasmine.anything()
            }));

            // Opened
            mockedState.layerSelection = true;
            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                'kaartlagen-selectie': 'aan'
            }));
        });
    });

    describe('Page', function () {
        it('can store the name of the page', function () {
            // No page, no parameter
            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                pagina: jasmine.Any(String)
            }));

            // With a page
            mockedState.page = 'welkom';

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                pagina: 'welkom'
            }));
        });
    });

    describe('Detail', function () {
        it('can store the api endpoint of the detail page', function () {
            // No detail, no parameter
            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                detail: jasmine.Any(String)
            }));

            // With a detail page
            mockedState.detail = {
                endpoint: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/'
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                detail: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/'
            }));
        });

        it('can set the invisibility of the detail', function () {
            mockedState.detail = {
                endpoint: 'ABC',
                isInvisible: true
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                detail: 'ABC',
                detailInvisible: true
            }));
        });

        it('can unset the invisibility of the detail', function () {
            mockedState.detail = {
                endpoint: 'ABC',
                isInvisible: false
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                detailInvisible: true
            }));
            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                detailInvisible: false
            }));
        });

        it('can set the invisibility of the detail, even without endpoint', function () {
            mockedState.detail = {
                isInvisible: true
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                detailInvisible: true
            }));
        });
    });

    describe('Straatbeeld', function () {
        it('does nothing is there is no active straatbeeld', function () {
            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                id: jasmine.Any(String)
            }));

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                plat: jasmine.Any(String),
                plon: jasmine.Any(String)
            }));
        });

        it('can set the straatbeeld id if it\'s known', function () {
            mockedState.straatbeeld = {
                id: 'ABC'
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                id: 'ABC'
            }));
        });

        it('Has orientation with heading, pitch and fov', function () {
            mockedState.straatbeeld = {
                id: 'ABC',
                heading: 270,
                pitch: 10.4,
                fov: 20
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                heading: '270',
                pitch: '10.4',
                fov: '20'
            }));
        });

        it('can set the straatbeeld invisibility', function () {
            mockedState.straatbeeld = {
                id: 'ABC',
                isInvisible: true
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                id: 'ABC',
                straatbeeldInvisible: true
            }));
        });

        it('can unset the straatbeeld invisibility', function () {
            mockedState.straatbeeld = {
                id: 'ABC',
                isInvisible: false
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                straatbeeldInvisible: false
            }));
            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                straatbeeldInvisible: true
            }));
        });

        it('can set the straatbeeld location if it\'s known', function () {
            mockedState.straatbeeld = {
                id: 'ABC',
                location: [1, 2]
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                id: 'ABC',
                straatbeeld: '1,2'
            }));
        });
    });

    describe('Data selection', function () {
        it('does nothing if there is no active dataset', function () {
            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                dataset: jasmine.Any(String)
            }));

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                'dataset-filters': jasmine.Any(String)
            }));

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                'dataset-pagina': jasmine.Any(String)
            }));
        });

        it('can set a dataset with (URL encoded) filters and a page number', function () {
            mockedState.dataSelection = {
                dataset: 'bag',
                filters: {},
                page: 5
            };

            // Without any filters
            stateToUrl.update(mockedState, false);
            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                dataset: 'bag'
            }));

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                'dataset-filters': jasmine.any(String)
            }));

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                'dataset-pagina': '5' // The page is converted to a string
            }));

            // With one filter
            mockedState.dataSelection.filters = {
                buurt: 'Mijn buurt'
            };

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                'dataset-filters': 'buurt:Mijn%20buurt'
            }));

            // With two filters
            mockedState.dataSelection.filters.buurtcombinatie = 'Mijn buurtcombinatie';

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                'dataset-filters': 'buurt:Mijn%20buurt,buurtcombinatie:Mijn%20buurtcombinatie'
            }));

            // Enable the list view
            mockedState.dataSelection.view = 'LIST';
            $location.search.calls.reset();

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                view: 'LIST'
            }));

            // Enable the table view
            mockedState.dataSelection.view = 'TABLE';
            $location.search.calls.reset();

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                view: 'TABLE'
            }));

            // Enable the default view (left to the reducer)
            delete mockedState.dataSelection.view;
            $location.search.calls.reset();

            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                view: undefined
            }));
        });
    });

    describe('Print', function () {
        it('keeps track of the document mode (web vs. print)', function () {
            // Regular, non-print
            stateToUrl.update(mockedState, false);

            expect($location.search).not.toHaveBeenCalledWith(jasmine.objectContaining({
                'print-versie': jasmine.anything()
            }));

            // Print version
            mockedState.isPrintMode = true;
            stateToUrl.update(mockedState, false);

            expect($location.search).toHaveBeenCalledWith(jasmine.objectContaining({
                'print-versie': 'aan'
            }));
        });
    });

    it('has the option to replace the URL', function () {
        // Without replace
        stateToUrl.update(mockedState, false);
        expect($location.replace).not.toHaveBeenCalled();

        // With replace
        stateToUrl.update(mockedState, true);
        expect($location.replace).toHaveBeenCalled();
    });
});
