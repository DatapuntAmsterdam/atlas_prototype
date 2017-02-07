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
                    options: {
                        MAX_NUMBER_OF_CLUSTERED_MARKERS: 500
                    },
                    datasets: {
                        zwembaden: {
                            TITLE: 'Zwembaden',
                            MAX_AVAILABLE_PAGES: 5
                        }
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
            geometryFilter: [[1, 2]],
            page: 2,
            isLoading: false
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

    it('retieves the available-filters and table data and passes it to it\'s child directives', function () {
        const component = getComponent(mockedState);
        let scope = component.isolateScope();

        expect(component.find('dp-data-selection-available-filters').length).toBe(1);
        expect(component.find('dp-data-selection-available-filters').attr('dataset')).toBe('zwembaden');
        expect(component.find('dp-data-selection-available-filters').attr('available-filters'))
            .toBe('vm.availableFilters');
        expect(component.find('dp-data-selection-available-filters').attr('active-filters')).toBe('vm.activeFilters');
        expect(scope.vm.availableFilters).toBe(mockedApiPreviewData.filters);
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

    it('either calls the TABLE, LIST or CARDS view', function () {
        let component;

        mockedState.view = 'TABLE';
        component = getComponent(mockedState);
        expect(component.find('dp-data-selection-table').length).toBe(1);
        expect(component.find('dp-data-selection-table').attr('content')).toBe('vm.data');
        expect(component.find('dp-data-selection-list').length).toBe(0);
        expect(component.find('dp-data-selection-cards').length).toBe(0);

        mockedState.view = 'LIST';
        component = getComponent(mockedState);
        expect(component.find('dp-data-selection-list').length).toBe(1);
        expect(component.find('dp-data-selection-list').attr('content')).toBe('vm.data');
        expect(component.find('dp-data-selection-table').length).toBe(0);
        expect(component.find('dp-data-selection-cards').length).toBe(0);

        mockedState.view = 'CARDS';
        component = getComponent(mockedState);
        expect(component.find('dp-data-selection-cards').length).toBe(1);
        expect(component.find('dp-data-selection-cards').attr('content')).toBe('vm.data');
        expect(component.find('dp-data-selection-list').length).toBe(0);
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
        it('sends an empty Array if the TABLE or CARDS view is active', function () {
            mockedState.view = 'TABLE';
            getComponent(mockedState);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: []
            });

            store.dispatch.calls.reset();

            mockedState.view = 'CARDS';
            $rootScope.$apply();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: []
            });
        });

        it('sends an empty Array if there are too many records (> MAX_NUMBER_OF_CLUSTERED_MARKERS)', function () {
            mockedState.view = 'LIST';

            // It should still send data with 10000 records
            mockedApiPreviewData.numberOfRecords = 500;

            getComponent(mockedState);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: [
                    [52.1, 4.1],
                    [52.2, 4.2],
                    [52.3, 4.3]
                ]
            });

            // It should send an empty Array with more than MAX_NUMBER_OF_CLUSTERED_MARKERS
            mockedApiPreviewData.numberOfRecords = 501;

            getComponent(mockedState);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: []
            });
        });

        it('sends locations (LIST view) when there are less than MAX_NUMBER_OF_CLUSTERED_MARKERS', function () {
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
    });
});
