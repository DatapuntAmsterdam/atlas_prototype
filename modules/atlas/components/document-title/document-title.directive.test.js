describe('The dp-document-title directive', function () {
    var $compile,
        $rootScope,
        storeHandler,
        store = {
            subscribe: angular.noop,
            getState: angular.noop
        },
        moduleDocumentTitle = { getTitle: angular.noop },
        dashboardColumns = { determineVisibility: angular.noop },
        dataSelectionDocumentTitle = { getTitle: angular.noop },
        detailDocumentTitle = { getTitle: angular.noop },
        layerSelectionDocumentTitle = { getTitle: angular.noop },
        mapDocumentTitle = { getTitle: angular.noop },
        pageDocumentTitle = { getTitle: angular.noop },
        searchResultsDocumentTitle = { getTitle: angular.noop },
        straatbeeldDocumentTitle = { getTitle: angular.noop };

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            function ($provide) {
                $provide.value('store', store);
                $provide.value('dashboardColumns', dashboardColumns);
                $provide.value('dpDataSelectionDocumentTitle', dataSelectionDocumentTitle);
                $provide.value('dpDetailDocumentTitle', detailDocumentTitle);
                $provide.value('dpLayerSelectionDocumentTitle', layerSelectionDocumentTitle);
                $provide.value('dpMapDocumentTitle', mapDocumentTitle);
                $provide.value('dpPageDocumentTitle', pageDocumentTitle);
                $provide.value('dpSearchResultsDocumentTitle', searchResultsDocumentTitle);
                $provide.value('dpStraatbeeldDocumentTitle', straatbeeldDocumentTitle);
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        spyOn(store, 'subscribe');
        spyOn(moduleDocumentTitle, 'getTitle');
        spyOn(dataSelectionDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(detailDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(layerSelectionDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(mapDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(pageDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(searchResultsDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(straatbeeldDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
    });

    function getComponent (numberOfResults, query, location, category) {
        var component,
            element,
            scope;

        element = document.createElement('span');
        element.setAttribute('dp-document-title', 'dp-document-title');
        element.innerText = 'Atlas';

        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        storeHandler = store.subscribe.calls.argsFor(0)[0];
        storeHandler();
        scope.$apply();

        return component;
    }

    it('shows the element content as default title', function () {
        spyOn(store, 'getState').and.returnValue({ page: {} });
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
        moduleDocumentTitle.getTitle.and.returnValue('');

        var component = getComponent();

        expect(component.text()).toBe('Atlas');
    });

    it('passes the state on in the call to determineVisibility', function () {
        const state = { key: 'value' };

        spyOn(store, 'getState').and.returnValue(state);
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({});

        getComponent();

        expect(dashboardColumns.determineVisibility).toHaveBeenCalledWith(state);
    });

    describe('getTitle', function () {
        it('does not get called when there is no visible item', function () {
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ unknownModule: true });

            getComponent();

            expect(moduleDocumentTitle.getTitle).not.toHaveBeenCalled();
        });

        it('does not get called when there is no state for the visible item', function () {
            spyOn(store, 'getState').and.returnValue({});
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });

            getComponent();

            expect(moduleDocumentTitle.getTitle).not.toHaveBeenCalled();
        });

        it('does not get called when the visible item is loading', function () {
            spyOn(store, 'getState').and.returnValue({ page: { isLoading: true } });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });

            getComponent();

            expect(moduleDocumentTitle.getTitle).not.toHaveBeenCalled();
        });

        it('gets called with the item\'s state', function () {
            const itemState = { key: 'value' };
            spyOn(store, 'getState').and.returnValue({ page: itemState });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });

            getComponent();

            expect(moduleDocumentTitle.getTitle).toHaveBeenCalledWith(itemState);
        });
    });

    it('prepends the base title with the item title', function () {
        spyOn(store, 'getState').and.returnValue({ page: {} });
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
        moduleDocumentTitle.getTitle.and.returnValue('Item title');

        var component = getComponent();

        expect(component.text()).toBe('Item title - Atlas');
    });

    it('simply displays the base title when the item title is empty', function () {
        spyOn(store, 'getState').and.returnValue({ page: {} });
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
        moduleDocumentTitle.getTitle.and.returnValue('');

        var component = getComponent();

        expect(component.text()).toBe('Atlas');
    });

    describe('data selection', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ dataSelection: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ dataSelection: true });
            dataSelectionDocumentTitle.getTitle.and.returnValue('Data selection title');

            var component = getComponent();

            expect(component.text()).toBe('Data selection title - Atlas');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ dataSelection: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true, dataSelection: true });
            dataSelectionDocumentTitle.getTitle.and.returnValue('Data selection title');

            var component = getComponent();

            expect(component.text()).toBe('Data selection title - Atlas');
        });
    });

    describe('detail', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ detail: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ detail: true });
            detailDocumentTitle.getTitle.and.returnValue('Detail title');

            var component = getComponent();

            expect(component.text()).toBe('Detail title - Atlas');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ detail: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true, detail: true });
            detailDocumentTitle.getTitle.and.returnValue('Detail title');

            var component = getComponent();

            expect(component.text()).toBe('Detail title - Atlas');
        });
    });

    describe('layer selection', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ layerSelection: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ layerSelection: true });
            layerSelectionDocumentTitle.getTitle.and.returnValue('Layer selection title');

            var component = getComponent();

            expect(component.text()).toBe('Layer selection title - Atlas');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ layerSelection: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true, layerSelection: true });
            layerSelectionDocumentTitle.getTitle.and.returnValue('Layer selection title');

            var component = getComponent();

            expect(component.text()).toBe('Layer selection title - Atlas');
        });
    });

    describe('map', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ map: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true });
            mapDocumentTitle.getTitle.and.returnValue('Map title');

            var component = getComponent();

            expect(component.text()).toBe('Map title - Atlas');
        });
    });

    describe('page', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ page: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
            pageDocumentTitle.getTitle.and.returnValue('Page title');

            var component = getComponent();

            expect(component.text()).toBe('Page title - Atlas');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ page: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true, map: true });
            pageDocumentTitle.getTitle.and.returnValue('Page title');

            var component = getComponent();

            expect(component.text()).toBe('Page title - Atlas');
        });
    });

    describe('search results', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ search: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ searchResults: true });
            searchResultsDocumentTitle.getTitle.and.returnValue('Search results title');

            var component = getComponent();

            expect(component.text()).toBe('Search results title - Atlas');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ search: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ searchResults: true, map: true });
            searchResultsDocumentTitle.getTitle.and.returnValue('Search results title');

            var component = getComponent();

            expect(component.text()).toBe('Search results title - Atlas');
        });
    });

    describe('straatbeeld', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ straatbeeld: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ straatbeeld: true });
            straatbeeldDocumentTitle.getTitle.and.returnValue('Straatbeeld title');

            var component = getComponent();

            expect(component.text()).toBe('Straatbeeld title - Atlas');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ straatbeeld: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ straatbeeld: true, map: true });
            straatbeeldDocumentTitle.getTitle.and.returnValue('Straatbeeld title');

            var component = getComponent();

            expect(component.text()).toBe('Straatbeeld title - Atlas');
        });
    });
});
