import * as piwik from '../../../../src/shared/services/piwik-tracker/piwik-tracker';

describe('The dp-document-title directive', function () {
    let $compile,
        $rootScope,
        $q,
        storeHandler,
        $timeout;
    const store = {
            subscribe: angular.noop,
            getState: angular.noop
        },
        moduleDocumentTitle = { getTitle: angular.noop },
        dashboardColumns = { determineVisibility: angular.noop, determineActivity: angular.noop },
        dataSelectionDocumentTitle = { getTitle: angular.noop },
        detailDocumentTitle = { getTitle: angular.noop },
        mapDocumentTitle = { getTitle: angular.noop },
        pageDocumentTitle = { getTitle: angular.noop },
        searchResultsDocumentTitle = { getTitle: angular.noop },
        straatbeeldDocumentTitle = { getTitle: angular.noop },
        combinedDocumentTitle = { getTitle: angular.noop };

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            function ($provide) {
                $provide.value('store', store);
                $provide.value('dashboardColumns', dashboardColumns);
                $provide.value('dpDataSelectionDocumentTitle', dataSelectionDocumentTitle);
                $provide.value('dpDetailDocumentTitle', detailDocumentTitle);
                $provide.value('dpMapDocumentTitle', mapDocumentTitle);
                $provide.value('dpPageDocumentTitle', pageDocumentTitle);
                $provide.value('dpSearchResultsDocumentTitle', searchResultsDocumentTitle);
                $provide.value('dpStraatbeeldDocumentTitle', straatbeeldDocumentTitle);
                $provide.value('dpCombinedDocumentTitle', combinedDocumentTitle);
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _$timeout_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            $timeout = _$timeout_;
        });

        spyOn(store, 'subscribe');
        spyOn(moduleDocumentTitle, 'getTitle');
        spyOn(dataSelectionDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(detailDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(mapDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(pageDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(searchResultsDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(straatbeeldDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(combinedDocumentTitle, 'getTitle').and.callFake(moduleDocumentTitle.getTitle);
        spyOn(piwik, 'trackPageNavigation').and.callFake(angular.noop);
    });

    function getComponent (numberOfResults, query, location, category) {
        const element = document.createElement('span');
        element.setAttribute('dp-document-title', 'dp-document-title');
        element.innerText = 'Dataportaal';

        const scope = $rootScope.$new();

        const component = $compile(element)(scope);
        scope.$apply();

        storeHandler = store.subscribe.calls.argsFor(0)[0];
        storeHandler();
        scope.$apply();

        return component;
    }

    it('shows the element content as default title', function () {
        spyOn(store, 'getState').and.returnValue({ page: {} });
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
        spyOn(dashboardColumns, 'determineActivity').and.returnValue({});
        moduleDocumentTitle.getTitle.and.returnValue('');

        const component = getComponent();

        expect(component.text()).toBe('Dataportaal');
    });

    it('passes the state on in the call to determineVisibility', function () {
        const state = { key: 'value' };

        spyOn(store, 'getState').and.returnValue(state);
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({});
        spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

        getComponent();

        expect(dashboardColumns.determineVisibility).toHaveBeenCalledWith(state);
    });

    describe('getTitle', function () {
        it('does not get called when there is no visible item', function () {
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ unknownModule: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            getComponent();

            expect(moduleDocumentTitle.getTitle).not.toHaveBeenCalled();
        });

        it('does not get called when there is no state for the visible item', function () {
            spyOn(store, 'getState').and.returnValue({});
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            getComponent();

            expect(moduleDocumentTitle.getTitle).not.toHaveBeenCalled();
        });

        it('does not get called when the visible item is loading', function () {
            spyOn(store, 'getState').and.returnValue({ page: { isLoading: true } });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            getComponent();

            expect(moduleDocumentTitle.getTitle).not.toHaveBeenCalled();
        });

        it('gets called with the item\'s state and filters', function () {
            const itemState = { key: 'value' },
                filterState = { foo: 'bar' };
            spyOn(store, 'getState').and.returnValue({ page: itemState, filters: filterState });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            getComponent();

            expect(moduleDocumentTitle.getTitle).toHaveBeenCalledWith(itemState, filterState);
        });

        it('gets called with the full state and filters', function () {
            const itemState = { key: 'value' },
                filterState = { foo: 'bar' },
                restState = { other: 'value', another: 'val', map: 'bar' },
                fullState = { page: itemState, filters: filterState, ...restState };

            spyOn(store, 'getState').and.returnValue(fullState);
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({ mapPreviewPanel: true });

            getComponent();

            expect(moduleDocumentTitle.getTitle).toHaveBeenCalledWith(fullState);
        });

        it('does not get called if the map state does not exist', function () {
            const itemState = { key: 'value' },
                filterState = { foo: 'bar' },
                restState = { other: 'value', another: 'val' },
                fullState = { page: itemState, filters: filterState, ...restState };

            spyOn(store, 'getState').and.returnValue(fullState);
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({ mapPreviewPanel: true });

            getComponent();

            expect(moduleDocumentTitle.getTitle).not.toHaveBeenCalled();
        });
    });

    it('prepends the base title with the item title', function () {
        spyOn(store, 'getState').and.returnValue({ page: {} });
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
        spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

        moduleDocumentTitle.getTitle.and.returnValue('Item title');

        const component = getComponent();

        expect(component.text()).toBe('Item title - Dataportaal');
    });

    it('prepends the base title with the item title from promise', function () {
        const q = $q.defer();
        q.resolve('Promise title');
        spyOn(store, 'getState').and.returnValue({ page: {} });
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
        spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

        moduleDocumentTitle.getTitle.and.returnValue(q.promise);

        const component = getComponent();

        expect(component.text()).toBe('Promise title - Dataportaal');
    });

    it('does not prepend the base title with empty item title from promise', function () {
        const q = $q.defer();
        q.resolve('');
        spyOn(store, 'getState').and.returnValue({ page: {} });
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
        spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

        moduleDocumentTitle.getTitle.and.returnValue(q.promise);

        const component = getComponent();

        expect(component.text()).toBe('Dataportaal');
    });

    it('simply displays the base title when the item title is empty', function () {
        spyOn(store, 'getState').and.returnValue({ page: {} });
        spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
        spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

        moduleDocumentTitle.getTitle.and.returnValue('');

        const component = getComponent();

        expect(component.text()).toBe('Dataportaal');
    });

    describe('data selection', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ dataSelection: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ dataSelection: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            dataSelectionDocumentTitle.getTitle.and.returnValue('Data selection title');

            const component = getComponent();

            expect(component.text()).toBe('Data selection title - Dataportaal');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ dataSelection: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true, dataSelection: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            dataSelectionDocumentTitle.getTitle.and.returnValue('Data selection title');

            const component = getComponent();

            expect(component.text()).toBe('Data selection title - Dataportaal');
        });
    });

    describe('detail', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ detail: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ detail: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            detailDocumentTitle.getTitle.and.returnValue('Detail title');

            const component = getComponent();

            expect(component.text()).toBe('Detail title - Dataportaal');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ detail: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true, detail: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            detailDocumentTitle.getTitle.and.returnValue('Detail title');

            const component = getComponent();

            expect(component.text()).toBe('Detail title - Dataportaal');
        });
    });

    describe('map', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ map: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            mapDocumentTitle.getTitle.and.returnValue('Map title');

            const component = getComponent();

            expect(component.text()).toBe('Map title - Dataportaal');
        });
    });

    describe('page', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ page: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            pageDocumentTitle.getTitle.and.returnValue('Page title');

            const component = getComponent();

            expect(component.text()).toBe('Page title - Dataportaal');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ page: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ page: true, map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            pageDocumentTitle.getTitle.and.returnValue('Page title');

            const component = getComponent();

            expect(component.text()).toBe('Page title - Dataportaal');
        });
    });

    describe('search results', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ search: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ searchResults: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            searchResultsDocumentTitle.getTitle.and.returnValue('Search results title');

            const component = getComponent();

            expect(component.text()).toBe('Search results title - Dataportaal');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ search: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ searchResults: true, map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            searchResultsDocumentTitle.getTitle.and.returnValue('Search results title');

            const component = getComponent();

            expect(component.text()).toBe('Search results title - Dataportaal');
        });
    });

    describe('straatbeeld', function () {
        it('maps the right names and services', function () {
            spyOn(store, 'getState').and.returnValue({ straatbeeld: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ straatbeeld: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            straatbeeldDocumentTitle.getTitle.and.returnValue('Straatbeeld title');

            const component = getComponent();

            expect(component.text()).toBe('Straatbeeld title - Dataportaal');
        });

        it('has precedence over the map module', function () {
            spyOn(store, 'getState').and.returnValue({ straatbeeld: {} });
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ straatbeeld: true, map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            straatbeeldDocumentTitle.getTitle.and.returnValue('Straatbeeld title');

            const component = getComponent();

            expect(component.text()).toBe('Straatbeeld title - Dataportaal');
        });
    });

    describe('print, preview, or embed view', function () {
        it('adds (printversie) to the title', function () {
            spyOn(store, 'getState').and.returnValue({
                ui: {
                    isPrintMode: true
                },
                map: {}
            });

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            mapDocumentTitle.getTitle.and.returnValue('Map title');

            const component = getComponent();

            expect(component.text()).toBe('Map title | Printversie - Dataportaal');
        });

        it('adds (embedversie) to the title', function () {
            spyOn(store, 'getState').and.returnValue({
                ui: {
                    isEmbedPreview: true
                },
                map: {}
            });

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            mapDocumentTitle.getTitle.and.returnValue('Map title');

            const component = getComponent();

            expect(component.text()).toBe('Map title | Embedversie - Dataportaal');
        });

        it('adds (embedded) to the title', function () {
            spyOn(store, 'getState').and.returnValue({
                ui: {
                    isEmbed: true
                },
                map: {}
            });

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            mapDocumentTitle.getTitle.and.returnValue('Map title');

            const component = getComponent();

            expect(component.text()).toBe('Map title | Embedded - Dataportaal');
        });

        it('adds nothing to the title', function () {
            spyOn(store, 'getState').and.returnValue({
                ui: {},
                map: {}
            });

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({ map: true });
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            mapDocumentTitle.getTitle.and.returnValue('Map title');

            const component = getComponent();

            expect(component.text()).toBe('Map title - Dataportaal');
        });
    });

    describe('tracker trigger mechanism', function () {
        it('triggers if the page title is set', function () {
            spyOn(store, 'getState').and.returnValue({
                map: {}
            });

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({map: true});
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            mapDocumentTitle.getTitle.and.returnValue('Map title');

            const component = getComponent();

            expect(component.text()).toBe('Map title - Dataportaal');
            expect(piwik.trackPageNavigation).toHaveBeenCalled();
        });

        it('retries if the page is still loading', function () {
            const firstReturnVal = {
                map: {
                },
                isLoading: true
            };
            const secondReturnVal = {
                map: {
                },
                isLoading: true
            };
            const thirdReturnVal = {
                map: {
                },
                isLoading: false
            };

            // getState() is called in the setTitle() fn and in the triggerTracker() fn.
            // isLoading is for this test 'false' in the second time getState() is
            // called in the triggerTracker() fn.
            // we mock it 3 times here, because of the extra call done by the setTitle() fn.
            spyOn(store, 'getState').and.returnValues(firstReturnVal, secondReturnVal, thirdReturnVal);

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue({map: true});
            spyOn(dashboardColumns, 'determineActivity').and.returnValue({});

            mapDocumentTitle.getTitle.and.returnValue('Map title');

            const component = getComponent();

            expect(piwik.trackPageNavigation).not.toHaveBeenCalled();
            $timeout.flush();
            expect(piwik.trackPageNavigation).toHaveBeenCalled();
            expect(component.text()).toBe('Map title - Dataportaal');
        });
    });
});
