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
                        let q = $q.defer();

                        q.resolve(mockedApiData);

                        return q.promise;
                    }
                },
                dataSelectionConfig: {
                    MAX_AVAILABLE_PAGES: 5,
                    zwembaden: {
                        TITLE: 'Zwembaden'
                    }
                }
            },
            function ($provide) {
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

                $provide.factory('dpPanelDirective', function () {
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
            view: 'TABLE',
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

    it('retrieves new data when the state changes', function () {
        var component = getComponent(mockedState),
            scope = component.isolateScope();

        expect(dataSelectionApi.query).toHaveBeenCalledTimes(1);
        expect(scope.vm.currentPage).toBe(2);

        // Change the state
        scope.vm.state.page = 3;
        $rootScope.$apply();

        expect(dataSelectionApi.query).toHaveBeenCalledTimes(2);
        expect(scope.vm.currentPage).toBe(3);
    });
});
