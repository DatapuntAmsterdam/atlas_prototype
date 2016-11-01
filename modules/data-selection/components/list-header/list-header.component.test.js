describe('The dp-data-selection-list-header component', function () {
    var $rootScope,
        $compile,
        mockedState;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            function ($provide, $compileProvider) {
                $provide.factory('store', function () {
                    return {};
                });

                $provide.factory('dataSelectionConfig', function () {
                    return {
                        zwembaden: {
                            FILTERS: [{
                                slug: 'type',
                                label: 'Type',
                                format: undefined
                            }, {
                                slug: 'regio',
                                label: 'Regio',
                                format: undefined
                            }]
                        }
                    };
                });

                $provide.factory('dpDataSelectionFormattedValueDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
        });

        mockedState = {
            dataset: 'zwembaden',
            filters: {
                type: 'Buitenbad'
            },
            page: 2
        };
    });

    function getComponent (state, numberOfRecords) {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-selection-list-header');
        element.setAttribute('state', 'state');
        element.setAttribute('number-of-records', 'numberOfRecords');
        element.setAttribute('header-title', 'headerTitle');

        scope = $rootScope.$new();
        scope.state = state;
        scope.numberOfRecords = numberOfRecords;
        scope.headerTitle = 'Adressen';

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('shows a message with nr records and active filters when records are present', function () {
        var component = getComponent(mockedState, 10);

        expect(component.find('.qa-data-selection-header__no-records').length).toBe(0);

        expect(component.find('.qa-data-selection-header__with-records').length).toBe(1);
        expect(component.find('.qa-data-selection-list-header__title').text()).toBe('10 adressen');

        expect(component.find('.qa-data-selection-list-header__filters')
            .text().split(/\s+/).filter(item => item.length))
            .toEqual(['met', 'type:']);
    });

    it('can show more than one filter', function () {
        mockedState.filters.regio = 'Centrum';
        var component = getComponent(mockedState, 10);

        expect(component.find('.qa-data-selection-list-header__filters')
            .text().split(/\s+/).filter(item => item.length))
            .toEqual(['met', 'type:', 'en', 'regio:']);
    });

    it('can have no filters active', function () {
        delete mockedState.filters.type;
        var component = getComponent(mockedState, 10);

        expect(component.find('.qa-data-selection-list-header__filters').length).toBe(0);
    });

    it('shows an error message when no records are present', function () {
        var component = getComponent(mockedState, 0);

        expect(component.find('.qa-data-selection-header__no-records').length).toBe(1);

        expect(component.find('.qa-data-selection-header__with-records').length).toBe(0);
    });
});
