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
                $provide.factory('dpHeaderDirective', function () {
                    return {};
                });

                $provide.factory('dpPageDirective', function () {
                    return {};
                });

                $provide.factory('dpDetailDirective', function () {
                    return {};
                });

                $provide.factory('dpSearchResultsDirective', function () {
                    return {};
                });

                $provide.factory('dpLayerSelectionDirective', function () {
                    return {};
                });

                $provide.factory('dpMapDirective', function () {
                    return {};
                });

                $provide.factory('dpStraatbeeldDirective', function () {
                    return {};
                });

                $provide.factory('dpDataSelectionDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _dashboardColumns_, _DEFAULT_STATE_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            dashboardColumns = _dashboardColumns_;
            defaultState = angular.copy(_DEFAULT_STATE_);
        });

        mockedState = angular.copy(defaultState);

        spyOn(store, 'getState').and.callThrough();
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

    describe('error message', function () {
        var component,
            mockedVisibility = {
                httpStatus: {
                    hasErrors: false
                }
            };

        beforeEach(function () {
            spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);
        });

        it('when not shown, does not flags the dashboard body', function () {
            component = getComponent();

            expect(component.find('.c-dashboard__body').attr('class')).not.toContain('c-dashboard__body--error');
        });

        it('when shown, flags the dashboard body', function () {
            mockedVisibility.httpStatus.hasErrors = true;
            component = getComponent();

            expect(component.find('.c-dashboard__body').attr('class')).toContain('c-dashboard__body--error');
        });
    });

    describe('column sizes', function () {
        var component,
            mockedVisibility,
            mockedColumnSizes;

        beforeEach(function () {
            mockedVisibility = {
                httpStatus: {
                    hasErrors: false
                }
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

            expect(component.find('.c-dashboard__layer-selection').length).toBe(1);
            expect(component.find('.c-dashboard__map').length).toBe(1);
            expect(component.find('.c-dashboard__content').length).toBe(1);
        });

        it('does not display a column on zero size', function () {
            mockedColumnSizes.left = 0;
            component = getComponent();

            expect(component.find('.c-dashboard__layer-selection').length).toBe(0);
            expect(component.find('.c-dashboard__map').length).toBe(1);
            expect(component.find('.c-dashboard__content').length).toBe(1);
        });

        it('does not display a column on missing size', function () {
            delete mockedColumnSizes.left;
            delete mockedColumnSizes.middle;
            delete mockedColumnSizes.right;
            component = getComponent();

            expect(component.find('.c-dashboard__layer-selection').length).toBe(0);
            expect(component.find('.c-dashboard__map').length).toBe(0);
            expect(component.find('.c-dashboard__content').length).toBe(0);
        });

        it('adds the correct class according to the column size', function () {
            component = getComponent();

            expect(component.find('.c-dashboard__layer-selection').attr('class')).toContain('u-col-sm--1');
            expect(component.find('.c-dashboard__map').attr('class')).toContain('u-col-sm--2');
            expect(component.find('.c-dashboard__content').attr('class')).toContain('u-col-sm--3');
        });
    });
});
