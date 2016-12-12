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

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _dashboardColumns_, _DEFAULT_STATE_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            dashboardColumns = _dashboardColumns_;
            defaultState = angular.copy(_DEFAULT_STATE_);
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
                },
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

            expect(component.find('.qa-dashboard__layer-selection').length).toBe(1);
            expect(component.find('.qa-dashboard__map').length).toBe(1);
            expect(component.find('.qa-dashboard__content').length).toBe(1);
        });

        it('does not display a column on zero size', function () {
            mockedColumnSizes.left = 0;
            component = getComponent();

            expect(component.find('.qa-dashboard__layer-selection').length).toBe(0);
            expect(component.find('.qa-dashboard__map').length).toBe(1);
            expect(component.find('.qa-dashboard__content').length).toBe(1);
        });

        it('does not display a column on missing size', function () {
            delete mockedColumnSizes.left;
            delete mockedColumnSizes.middle;
            delete mockedColumnSizes.right;
            component = getComponent();

            expect(component.find('.qa-dashboard__layer-selection').length).toBe(0);
            expect(component.find('.qa-dashboard__map').length).toBe(0);
            expect(component.find('.qa-dashboard__content').length).toBe(0);
        });

        it('adds the correct class according to the column size', function () {
            component = getComponent();

            expect(component.find('.qa-dashboard__layer-selection').attr('class')).toContain('u-col-sm--1');
            expect(component.find('.qa-dashboard__map').attr('class')).toContain('u-col-sm--2');
            expect(component.find('.qa-dashboard__content').attr('class')).toContain('u-col-sm--3');
        });
    });

    describe('straatbeeld', function () {
        var component,
            mockedVisibility,
            mockedColumnSizes;

        beforeEach(function () {
            mockedVisibility = {
                httpStatus: {
                    hasErrors: false
                },
                map: false,
                straatbeeld: true
            };
            mockedColumnSizes = {
                left: 1,
                middle: 2,
                right: 3
            };

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);
            spyOn(dashboardColumns, 'determineColumnSizes').and.returnValue(mockedColumnSizes);
        });

        it('displays a fullscreen straatbeeld on straatbeeld.isFullscreen = true', function () {
            spyOn(store, 'getState').and.returnValue({
                straatbeeld: {
                    isFullscreen: true
                },
                map: {
                }
            });
            component = getComponent();

            expect(component.find('.qa-dashboard__layer-selection').length).toBe(1);
            expect(component.find('.qa-dashboard__map').length).toBe(0);
            expect(component.find('.qa-dashboard__straatbeeld').length).toBe(1);
            expect(component.find('.qa-dashboard__content').length).toBe(1);
        });

        it('displays a normal straatbeeld on straatbeeld.isFullscreen = false', function () {
            spyOn(store, 'getState').and.returnValue({
                straatbeeld: {
                    isFullscreen: false
                },
                map: {
                }
            });
            component = getComponent();

            expect(component.find('.qa-dashboard__layer-selection').length).toBe(1);
            expect(component.find('.qa-dashboard__map').length).toBe(0);
            expect(component.find('.qa-dashboard__straatbeeld').length).toBe(0);
            expect(component.find('.qa-dashboard__content').length).toBe(1);
        });
    });
});
