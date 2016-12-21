describe('The dp-data-selection component', function () {
    let $rootScope,
        $compile,
        $q,
        dataSelectionApi,
        store,
        ACTIONS,
        mockedState,
        mockedApiPreviewData,
        mockedApiMarkersData;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                dataSelectionApi: {
                    query: function () {
                        let q = $q.defer();

                        q.resolve(mockedApiPreviewData);

                        return q.promise;
                    },
                    getMarkers: function () {
                        let q = $q.defer();

                        q.resolve(mockedApiMarkersData);

                        return q.promise;
                    }
                },
                store: {
                    dispatch: angular.noop
                }
            },
            function ($provide) {
                $provide.constant('DATA_SELECTION_CONFIG', {
                    HAS_PAGE_LIMIT: true,
                    MAX_AVAILABLE_PAGES: 5,
                    zwembaden: {
                        TITLE: 'Zwembaden'
                    }
                });

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
            filters: {
                type: 'Buitenbad'
            },
            page: 2,
            isLoading: false
        };

        mockedApiPreviewData = {
            numberOfPages: 107,
            numberOfRecords: 77,
            filters: 'MOCKED_FILTER_DATA',
            data: 'MOCKED_PREVIEW_DATA'
        };

        mockedApiMarkersData = [
            [52.1, 4.1],
            [52.2, 4.2],
            [52.3, 4.3]
        ];

        spyOn(dataSelectionApi, 'query').and.callThrough();
        spyOn(dataSelectionApi, 'getMarkers').and.callThrough();
        spyOn(store, 'dispatch');
    });

    function getComponent (state) {
        let component,
            element,
            scope;

        element = document.createElement('dp-data-selection');
        element.setAttribute('state', 'state');

        scope = $rootScope.$new();
        scope.state = state;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('retieves the filter and table data and passes it to it\'s child directives', function () {
        const component = getComponent(mockedState);
        let scope = component.isolateScope();

        expect(component.find('dp-data-selection-filters').length).toBe(1);
        expect(component.find('dp-data-selection-filters').attr('dataset')).toBe('zwembaden');
        expect(component.find('dp-data-selection-filters').attr('available-filters')).toBe('vm.availableFilters');
        expect(component.find('dp-data-selection-filters').attr('active-filters')).toBe('vm.state.filters');
        expect(scope.vm.availableFilters).toBe('MOCKED_FILTER_DATA');
        expect(scope.vm.state.filters).toEqual({
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

    it('either calls the table or list view', function () {
        let component;

        mockedState.view = 'TABLE';
        component = getComponent(mockedState);
        expect(component.find('dp-data-selection-table').length).toBe(1);
        expect(component.find('dp-data-selection-table').attr('content')).toBe('vm.data');
        expect(component.find('dp-data-selection-list').length).toBe(0);

        mockedState.view = 'LIST';
        component = getComponent(mockedState);
        expect(component.find('dp-data-selection-list').length).toBe(1);
        expect(component.find('dp-data-selection-list').attr('content')).toBe('vm.data');
        expect(component.find('dp-data-selection-table').length).toBe(0);
    });

    it('retrieves new data when the state changes', function () {
        const component = getComponent(mockedState);
        let scope = component.isolateScope();

        expect(dataSelectionApi.query).toHaveBeenCalledTimes(1);
        expect(scope.vm.currentPage).toBe(2);

        // Change the state
        scope.vm.state.page = 3;
        $rootScope.$apply();

        expect(dataSelectionApi.query).toHaveBeenCalledTimes(2);
        expect(scope.vm.currentPage).toBe(3);
    });

    describe('it triggers SHOW_DATA_SELECTION to communicate the related marker locations', function () {
        it('sends an empty Array if the table view is active', function () {
            mockedState.view = 'TABLE';
            getComponent(mockedState);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: []
            });
        });

        it('sends an empty Array if there are too many records (> 10000) to show', function () {
            mockedState.view = 'LIST';

            // It should still send data with 10000 records
            mockedApiPreviewData.numberOfRecords = 10000;

            getComponent(mockedState);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: [
                    [52.1, 4.1],
                    [52.2, 4.2],
                    [52.3, 4.3]
                ]
            });

            // It should send an empty Array with more than 10000
            mockedApiPreviewData.numberOfRecords = 10001;

            getComponent(mockedState);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: []
            });
        });

        it('shows a message in the LIST view when there are too many records', function () {
            let component;

            mockedApiPreviewData.numberOfRecords = 10001;

            // The message is not shown in the TABLE view
            mockedState.view = 'TABLE';
            component = getComponent(mockedState);
            expect(component.find('dp-panel').length).toBe(0);

            // The message is shown in the LIST view
            mockedState.view = 'LIST';
            component = getComponent(mockedState);
            expect(component.find('dp-panel').length).toBe(1);
        });

        it('sends an Array with locations if the LIST view is active and there are < 10000 records', function () {
            mockedState.view = 'LIST';

            getComponent(mockedState);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: [
                    [52.1, 4.1],
                    [52.2, 4.2],
                    [52.3, 4.3]
                ]
            });
        });
    });

    describe('it has a technical limit for the MAX_AVAILABLE_PAGES', function () {
        it('shows the content on pages up to this limit', function () {
            let component;

            mockedState.page = 5;
            component = getComponent(mockedState);

            expect(component.find('dp-data-selection-table').length).toBe(1);
        });

        it('doesn\'t show the content for pages above this limit', function () {
            let component;

            mockedState.page = 6;
            component = getComponent(mockedState);

            expect(component.find('dp-data-selection-table').length).toBe(0);
        });

        it('shows a message when the content isn\'t shown because of this limit', function () {
            let component;

            // When there is content, don't show the message
            mockedState.page = 5;
            component = getComponent(mockedState);
            expect(component.find('dp-panel').length).toBe(0);

            // Where there is no content, because of the page limit, do show the message
            mockedState.page = 6;
            component = getComponent(mockedState);
            expect(component.find('dp-panel').length).toBe(1);
            expect(component.find('dp-panel').text()).toContain('Deze pagina kan niet worden getoond');
        });
    });
});
