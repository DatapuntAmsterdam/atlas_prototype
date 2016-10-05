describe('The dp-data-selection component', function () {
    var $rootScope,
        $compile,
        $q,
        dataSelectionApi,
        mockedState,
        mockedApiData;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                dataSelectionApi: {
                    query: function () {
                        var q = $q.defer();

                        q.resolve(mockedApiData);

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.factory('dpLoadingIdicatorDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionFiltersDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionDownloadButtonDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionTableDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionPaginationDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$rootScope_, _$compile_, _$q_, _dataSelectionApi_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $q = _$q_;
            dataSelectionApi = _dataSelectionApi_;
        });

        mockedState = {
            dataset: 'zwembaden',
            filters: {
                type: 'Buitenbad'
            },
            page: 2
        };

        mockedApiData = {
            number_of_pages: 107,
            number_of_records: 77,
            filters: 'MOCKED_FILTER_DATA',
            tableData: 'MOCKED_TABLE_DATA'
        };

        spyOn(dataSelectionApi, 'query').and.callThrough();
    });

    function getComponent (state) {
        var component,
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
        var component = getComponent(mockedState),
            scope = component.isolateScope();

        expect(component.find('dp-data-selection-filters').length).toBe(1);
        expect(component.find('dp-data-selection-filters').attr('dataset')).toBe('zwembaden');
        expect(component.find('dp-data-selection-filters').attr('available-filters')).toBe('vm.availableFilters');
        expect(component.find('dp-data-selection-filters').attr('active-filters')).toBe('vm.state.filters');
        expect(scope.vm.availableFilters).toBe('MOCKED_FILTER_DATA');
        expect(scope.vm.state.filters).toEqual({
            type: 'Buitenbad'
        });

        expect(component.find('dp-data-selection-table').length).toBe(1);
        expect(component.find('dp-data-selection-table').attr('content')).toBe('vm.tableData');
        expect(scope.vm.tableData).toBe('MOCKED_TABLE_DATA');
        expect(scope.vm.currentPage).toBe(2);

        expect(component.find('dp-data-selection-pagination').length).toBe(1);
        expect(component.find('dp-data-selection-pagination').attr('current-page')).toBe('vm.currentPage');
        expect(component.find('dp-data-selection-pagination').attr('number-of-pages')).toBe('vm.numberOfPages');
        expect(scope.vm.currentPage).toBe(2);
        expect(scope.vm.numberOfPages).toBe(107);
        expect(scope.vm.numberOfRecords).toBe(77);
        expect(scope.vm.noDataToDisplay).toBe(false);
    });

    it('retrieves new data when the state changes', function () {
        var component = getComponent(mockedState),
            scope = component.isolateScope();

        expect(dataSelectionApi.query).toHaveBeenCalledTimes(1);
        expect(scope.vm.currentPage).toBe(2);

        //Change the state
        scope.vm.state.page = 3;
        $rootScope.$apply();

        expect(dataSelectionApi.query).toHaveBeenCalledTimes(2);
        expect(scope.vm.currentPage).toBe(3);
    });

    it('cannot show more than 100 pages', function () {
        var component = getComponent(mockedState),
            scope = component.isolateScope();

        //Change the state
        scope.vm.state.page = 101;
        $rootScope.$apply();

        expect(scope.vm.currentPage).toBe(101);
        expect(scope.vm.noDataToDisplay).toBe(true);
    });

});