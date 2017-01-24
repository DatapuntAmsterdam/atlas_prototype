describe('The dashboard component', function () {
    var $compile,
        $rootScope,
        store,
        dashboardColumns,
        defaultState,
        mockedState;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            {
                store: {
                    subscribe: angular.noop,
                    getState: function () {
                        return mockedState;
                    }
                }
            },
            function ($provide) {
                [
                    'dpHeaderDirective',
                    'dpCardsHeaderDirective',
                    'dpPageDirective',
                    'dpDetailDirective',
                    'dpSearchResultsDirective',
                    'dpLayerSelectionDirective',
                    'dpMapDirective',
                    'dpStraatbeeldDirective',
                    'dpDataSelectionDirective'
                ].forEach(d => $provide.factory(d, () => {
                    return {};
                }));
            }
        );

        const DEFAULT_STATE = {
            map: {
                baseLayer: 'topografie',
                overlays: [],
                viewCenter: [52.3719, 4.9012],
                zoom: 9,
                showActiveOverlays: false,
                isFullscreen: false,
                isLoading: false
            },
            layerSelection: {
                isEnabled: false
            },
            search: null,
            page: 'home',
            detail: null,
            straatbeeld: null,
            dataSelection: null,
            atlas: {
                isPrintMode: false
            }
        };

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _dashboardColumns_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            dashboardColumns = _dashboardColumns_;
            defaultState = angular.copy(DEFAULT_STATE);
        });

        mockedState = angular.copy(defaultState);
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('dp-dashboard');
        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('subscribes to the store to listen for changes', function () {
        spyOn(store, 'subscribe');

        getComponent();

        expect(store.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('shows a special header for a catalogus and its detail page', function () {
        mockedState.dataSelection = {
            view: 'CARDS'
        };
        let component = getComponent();
        expect(component.find('.qa-dashboard__catalogus-header').length).toBe(1);
        expect(component.find('.qa-dashboard__default-header').length).toBe(0);

        mockedState.dataSelection = {
            view: 'SOMETHING ELSE'
        };
        component = getComponent();
        expect(component.find('.qa-dashboard__catalogus-header').length).toBe(0);
        expect(component.find('.qa-dashboard__default-header').length).toBe(1);

        mockedState.detail = {
            endpoint: 'http://somewhere/catalogus/api/somewhere'
        };
        component = getComponent();
        expect(component.find('.qa-dashboard__catalogus-header').length).toBe(1);
        expect(component.find('.qa-dashboard__default-header').length).toBe(0);
    });

    describe('error message', function () {
        var component,
            mockedVisibility = {
                httpStatus: false
            };

        beforeEach(function () {
            spyOn(dashboardColumns, 'determineVisibility').and.callFake(() => mockedVisibility);
        });

        it('when not shown, does not flags the dashboard body', function () {
            component = getComponent();

            expect(component.find('.c-dashboard__body').attr('class')).not.toContain('c-dashboard__body--error');
        });

        it('when shown, flags the dashboard body', function () {
            mockedVisibility.httpStatus = true;
            component = getComponent();

            expect(component.find('.c-dashboard__body').attr('class')).toContain('c-dashboard__body--error');
        });

        it('watches for changes to error message and rerenders the dashboard when needed', function () {
            // Start without the error message
            component = getComponent();
            mockedVisibility = {
                httpStatus: false
            };
            $rootScope.$apply();
            expect(component.find('dp-api-error').length).toBe(0);

            // Set the error message
            mockedVisibility = {
                httpStatus: true
            };
            $rootScope.$apply();
            expect(component.find('dp-api-error').length).toBe(1);

            // Remove the message again
            mockedVisibility = {
                httpStatus: false
            };
            $rootScope.$apply();
            expect(component.find('dp-api-error').length).toBe(0);
        });
    });

    describe('column sizes', function () {
        var component,
            mockedVisibility,
            mockedColumnSizes;

        beforeEach(function () {
            mockedVisibility = {
                httpStatus: false,
                map: true
            };
            mockedColumnSizes = {
                left: 1,
                middle: 2,
                right: 3
            };

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);
            spyOn(dashboardColumns, 'determineColumnSizes').and.returnValue(mockedColumnSizes);
        });

        it('displays the columns according to the column size', function () {
            component = getComponent();

            expect(component.find('.qa-dashboard__column--left').hasClass('ng-hide')).toBe(false);
            expect(component.find('.qa-dashboard__column--middle').hasClass('ng-hide')).toBe(false);
            expect(component.find('.qa-dashboard__column--right').hasClass('ng-hide')).toBe(false);
        });

        it('does not display a column on zero size', function () {
            mockedColumnSizes.left = 0;
            component = getComponent();

            expect(component.find('.qa-dashboard__column--left').hasClass('ng-hide')).toBe(true);
            expect(component.find('.qa-dashboard__column--middle').hasClass('ng-hide')).toBe(false);
            expect(component.find('.qa-dashboard__column--right').hasClass('ng-hide')).toBe(false);
        });

        it('does not display a column on missing size', function () {
            delete mockedColumnSizes.left;
            delete mockedColumnSizes.middle;
            delete mockedColumnSizes.right;
            component = getComponent();

            expect(component.find('.qa-dashboard__column--left').hasClass('ng-hide')).toBe(true);
            expect(component.find('.qa-dashboard__column--middle').hasClass('ng-hide')).toBe(true);
            expect(component.find('.qa-dashboard__column--right').hasClass('ng-hide')).toBe(true);
        });

        it('adds the correct class according to the column size', function () {
            component = getComponent();

            expect(component.find('.qa-dashboard__column--left').attr('class')).toContain('u-col-sm--1');
            expect(component.find('.qa-dashboard__column--middle').attr('class')).toContain('u-col-sm--2');
            expect(component.find('.qa-dashboard__column--right').attr('class')).toContain('u-col-sm--3');
        });
    });
});
