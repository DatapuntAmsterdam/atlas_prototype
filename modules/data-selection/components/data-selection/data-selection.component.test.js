describe('The dp-data-selection component', function () {
    let $rootScope,
        $compile,
        $q,
        dataSelectionApi,
        store,
        ACTIONS,
        config,
        mockedState,
        mockedFilters,
        mockedUser,
        mockedApiPreviewData,
        mockedApiMarkersData;

    beforeEach(function () {
        config = {
            datasets: {
                zwembaden: {
                    MAX_NUMBER_OF_CLUSTERED_MARKERS: 1000,
                    TITLE: 'Zwembaden',
                    TITLE_TAB: 'Zwembaden',
                    MAX_AVAILABLE_PAGES: 5
                }
            }
        };

        angular.mock.module(
            'dpDataSelection',
            {
                dataSelectionApi: {
                    query: function () {
                        const q = $q.defer();

                        q.resolve(mockedApiPreviewData);

                        return q.promise;
                    },
                    getMarkers: function () {
                        const q = $q.defer();

                        q.resolve(mockedApiMarkersData);

                        return q.promise;
                    }
                },
                store: {
                    dispatch: angular.noop,
                    getState: angular.noop
                }
            },
            function ($provide) {
                $provide.constant('DATA_SELECTION_CONFIG', config);

                $provide.factory('dpLoadingIndicatorDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionFiltersDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionHeaderDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionTableDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionListDirective', function () {
                    return {};
                });

                $provide.factory('dpPanelDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionPaginationDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$rootScope_, _$compile_, _$q_, _dataSelectionApi_, _store_, _ACTIONS_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $q = _$q_;
            dataSelectionApi = _dataSelectionApi_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedState = {
            view: 'TABLE',
            dataset: 'zwembaden',
            geometryFilter: {
                markers: [[1, 2]]
            },
            page: 2,
            isLoading: false,
            catalogFilters: {
                formatTypes: [],
                serviceTypes: [],
                distributionTypes: []
            }
        };

        mockedFilters = {
            type: 'Buitenbad'
        };

        mockedUser = {
            authenticated: true,
            scopes: ['HR/R'],
            name: ''
        };

        mockedApiPreviewData = {
            numberOfPages: 107,
            numberOfRecords: 77,
            filters: [{
                slug: 'type',
                options: ['zwembaden']
            }],
            data: 'MOCKED_PREVIEW_DATA'
        };

        mockedApiMarkersData = {
            clusterMarkers: [
                [52.1, 4.1],
                [52.2, 4.2],
                [52.3, 4.3]
            ]
        };

        spyOn(dataSelectionApi, 'query').and.callThrough();
        spyOn(dataSelectionApi, 'getMarkers').and.callThrough();
        spyOn(store, 'dispatch');
        spyOn(store, 'getState').and.returnValue(mockedState);
    });

    function getComponent (state, filters, user) {
        const element = document.createElement('dp-data-selection');
        element.setAttribute('state', 'state');
        element.setAttribute('filters', 'filters');
        element.setAttribute('user', 'user');
        element.setAttribute('dataset', 'dataset');
        element.setAttribute('view', 'view');

        const scope = $rootScope.$new();
        scope.state = state;
        scope.filters = filters;
        scope.user = user || mockedUser;
        scope.dataset = state.dataset;
        scope.view = state.view;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('retrieves the available-filters and table data and passes it to it\'s child directives', function () {
        const component = getComponent(mockedState, mockedFilters);
        const scope = component.isolateScope();

        expect(component.find('dp-data-selection-available-filters').length).toBe(1);
        expect(component.find('dp-data-selection-available-filters').attr('dataset')).toBe('zwembaden');
        expect(component.find('dp-data-selection-available-filters').attr('available-filters'))
            .toBe('vm.availableFilters');
        expect(component.find('dp-data-selection-available-filters').attr('active-filters')).toBe('vm.filters');
        expect(scope.vm.availableFilters).toBe(mockedApiPreviewData.filters);
        expect(scope.vm.filters).toEqual({
            type: 'Buitenbad'
        });

        expect(component.find('dp-data-selection-table').length).toBe(1);
        expect(component.find('dp-data-selection-table').attr('content')).toBe('vm.data');
        expect(scope.vm.data).toBe('MOCKED_PREVIEW_DATA');
        expect(scope.vm.currentPage).toBe(2);

        expect(component.find('dp-data-selection-pagination').length).toBe(1);
        expect(component.find('dp-data-selection-pagination').attr('current-page')).toBe('vm.currentPage');
        expect(component.find('dp-data-selection-pagination').attr('number-of-pages')).toBe('vm.numberOfPages');
        expect(scope.vm.currentPage).toBe(2);
        expect(scope.vm.numberOfPages).toBe(107);
        expect(scope.vm.numberOfRecords).toBe(77);
    });

    it('hides the available-filters when no results are found', () => {
        mockedApiPreviewData.numberOfRecords = 0;
        const component = getComponent(mockedState, mockedFilters);
        expect(component.find('dp-data-selection-available-filters').length).toBe(0);
    });

    it('hides the tab header in CATALOG view when no search query is provided', function () {
        mockedState.view = 'CATALOG';
        mockedState.query = '';
        mockedApiPreviewData.data = [];
        const component = getComponent(mockedState, mockedFilters);
        const scope = component.isolateScope();
        expect(scope.vm.showTabHeader()).toBe(false);
        expect(component.find('dp-tab-header').length).toBe(0);
    });

    it('shows the tab header in CATALOG view when a search query is provided', function () {
        mockedState.view = 'CATALOG';
        mockedState.query = 'foo';
        mockedApiPreviewData.data = [];
        const component = getComponent(mockedState, mockedFilters);
        const scope = component.isolateScope();
        expect(scope.vm.showTabHeader()).toBe(true);
        expect(component.find('dp-tab-header').length).toBe(1);
    });

    it('hides the tab header in any other than CATALOG view', function () {
        ['TABLE', 'LIST'].forEach(view => {
            [{}, {filter: 'any filter'}].forEach(filters => {
                mockedState.view = view;
                mockedState.filters = filters;
                const component = getComponent(mockedState, mockedFilters);
                const scope = component.isolateScope();
                expect(scope.vm.showTabHeader()).toBe(false);
                expect(component.find('dp-tab-header').length).toBe(0);
            });
        });
    });

    it('either calls the TABLE, LIST or CATALOG view', function () {
        let component;

        mockedState.view = 'TABLE';
        component = getComponent(mockedState, mockedFilters);
        expect(component.find('dp-data-selection-table').length).toBe(1);
        expect(component.find('dp-data-selection-table').attr('content')).toBe('vm.data');
        expect(component.find('dp-data-selection-list').length).toBe(0);
        expect(component.find('dp-data-selection-cards').length).toBe(0);
        expect(component.find('dp-data-selection-catalog').length).toBe(0);

        mockedState.view = 'LIST';
        component = getComponent(mockedState, mockedFilters);
        expect(component.find('dp-data-selection-list').length).toBe(1);
        expect(component.find('dp-data-selection-list').attr('content')).toBe('vm.data');
        expect(component.find('dp-data-selection-catalog').length).toBe(0);
        expect(component.find('dp-data-selection-table').length).toBe(0);
        expect(component.find('dp-data-selection-cards').length).toBe(0);

        mockedState.view = 'CATALOG';
        mockedApiPreviewData.data = [];
        component = getComponent(mockedState, mockedFilters);
        expect(component.find('dp-data-selection-catalog').length).toBe(1);
        expect(component.find('dp-data-selection-catalog').attr('content')).toBe('vm.data');
        expect(component.find('dp-data-selection-cards').length).toBe(0);
        expect(component.find('dp-data-selection-list').length).toBe(0);
        expect(component.find('dp-data-selection-table').length).toBe(0);
    });

    it('retrieves new data when the state changes', function () {
        const component = getComponent(mockedState, mockedFilters);
        const scope = component.isolateScope();

        expect(dataSelectionApi.query).toHaveBeenCalledTimes(1);
        expect(scope.vm.currentPage).toBe(2);

        // Change the state
        scope.vm.state.page = 3;
        $rootScope.$apply();

        expect(dataSelectionApi.query).toHaveBeenCalledTimes(2);
        expect(scope.vm.currentPage).toBe(3);
    });

    describe('it triggers SHOW_DATA_SELECTION to communicate the related marker locations', function () {
        it('dispatches the RESET_DATA_SELECTION action when state.reset is set', () => {
            mockedState.view = 'TABLE';
            mockedState.reset = true;
            getComponent(mockedState, mockedFilters);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.RESET_DATA_SELECTION,
                payload: []
            });

            // TODO: refactor, fix test or replace with other logic
            // store.dispatch.calls.reset();
            //
            // mockedState.view = 'CATALOG';
            // mockedApiPreviewData.data = [];
            // $rootScope.$apply();
            // expect(store.dispatch).toHaveBeenCalledWith({
            //     type: ACTIONS.RESET_DATA_SELECTION,
            //     payload: []
            // });
        });

        it('sends an empty Array if the TABLE or CATALOG view is active', function () {
            mockedState.view = 'TABLE';
            getComponent(mockedState, mockedFilters);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: []
            });

            // TODO: refactor, fix test or replace with other logic
            // store.dispatch.calls.reset();
            //
            // store.dispatch.calls.reset();
            // mockedState.view = 'CATALOG';
            // mockedApiPreviewData.data = [];
            // $rootScope.$apply();
            // expect(store.dispatch).toHaveBeenCalledWith({
            //     type: ACTIONS.SHOW_DATA_SELECTION,
            //     payload: []
            // });
        });

        it('sends an empty Array if there are too many records (> MAX_NUMBER_OF_CLUSTERED_MARKERS)', function () {
            mockedState.view = 'LIST';

            // It should still send data with less than MAX_NUMBER_OF_CLUSTERED_MARKERS
            mockedApiPreviewData.numberOfRecords = 1000;

            getComponent(mockedState, mockedFilters);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: {
                    clusterMarkers: [
                        [52.1, 4.1],
                        [52.2, 4.2],
                        [52.3, 4.3]
                    ]
                }
            });

            // It should send an empty Array with more than MAX_NUMBER_OF_CLUSTERED_MARKERS
            mockedApiPreviewData.numberOfRecords = 1001;

            getComponent(mockedState, mockedFilters);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: []
            });
        });

        it('sends locations (LIST view) when there are less than MAX_NUMBER_OF_CLUSTERED_MARKERS', function () {
            mockedState.view = 'LIST';

            getComponent(mockedState, mockedFilters);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: {
                    clusterMarkers: [
                        [52.1, 4.1],
                        [52.2, 4.2],
                        [52.3, 4.3]
                    ]
                }
            });
        });
    });

    describe('it has a technical limit for the MAX_AVAILABLE_PAGES', function () {
        it('shows the content on pages up to this limit', function () {
            mockedState.page = 5;
            const component = getComponent(mockedState, mockedFilters);

            expect(component.find('dp-data-selection-table').length).toBe(1);
        });

        it('doesn\'t show the content for pages above this limit', function () {
            mockedState.page = 6;
            const component = getComponent(mockedState, mockedFilters);

            expect(component.find('dp-data-selection-table').length).toBe(0);
        });

        it('shows the max pages messages if page > max pages', () => {
            let component;

            // Don't show the message
            mockedState.page = 5;
            component = getComponent(mockedState, mockedFilters);
            expect(component.find('.qa-message-max-pages').length).toBe(0);

            // Show the message
            mockedState.page = 6;
            component = getComponent(mockedState, mockedFilters);
            expect(component.find('.qa-message-max-pages').length).toBe(1);
        });
    });

    describe('the clustered marker message', () => {
        it('is potentially shown on the LIST view', () => {
            let component;
            mockedState.view = 'LIST';

            // Don't show the message
            mockedApiPreviewData.numberOfRecords = 1000;
            component = getComponent(mockedState, mockedFilters);
            expect(component.find('.qa-message-clustered-markers').length).toBe(0);

            // Show the message
            mockedApiPreviewData.numberOfRecords = 1001;
            component = getComponent(mockedState, mockedFilters);
            expect(component.find('.qa-message-clustered-markers').length).toBe(1);
        });

        it('is not shown on the CATALOG view', () => {
            mockedState.view = 'CATALOG';
            mockedApiPreviewData.data = [];
            mockedApiPreviewData.numberOfRecords = 1001;
            const component = getComponent(mockedState, mockedFilters);
            expect(component.find('.qa-message-clustered-markers').length).toBe(0);
        });

        it('is not shown on the TABLE view', () => {
            mockedState.view = 'TABLE';
            mockedApiPreviewData.numberOfRecords = 1001;
            const component = getComponent(mockedState, mockedFilters);
            expect(component.find('.qa-message-clustered-markers').length).toBe(0);
        });
    });

    it('the messages about MAX_PAGES and MAX_CLUSTERED_MARKERS use DATA_SELECTION_CONFIG', () => {
        mockedState.page = 6;
        mockedApiPreviewData.numberOfRecords = 1001;
        mockedState.view = 'LIST'; // required to even show cluster message

        const component = getComponent(mockedState, mockedFilters);

        expect(component.find('.qa-message-max-pages').text()).toContain('de eerste 5 pagina\'s');
        expect(component.find('.qa-message-clustered-markers').text()).toContain('niet meer dan 1.000 resultaten');
    });

    it('shows data when allowed', () => {
        // Normally it's there
        const component = getComponent(mockedState, mockedFilters);
        expect(component.find('.qa-data-grid').length).toBe(1);
    });

    it('does not show data when not allowed', () => {
        // Use existing dataset name
        mockedState.dataset = 'hr';
        config.datasets.hr = config.datasets.zwembaden;
        // With required auth scope
        config.datasets.hr.AUTH_SCOPE = 'HR/R';
        // which the user does not have
        mockedUser.scopes = [];
        const disabledComponent = getComponent(mockedState, mockedFilters);

        // It is not shown
        expect(disabledComponent.find('.qa-data-grid').length).toBe(0);

        // and a message is displayed
        expect(disabledComponent.find('.qa-disabled-message').length).toBe(1);
    });
});
