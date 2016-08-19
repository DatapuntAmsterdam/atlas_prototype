describe('The dashboard component', function () {
    var $compile,
        $rootScope,
        store,
        defaultState;

    beforeEach(function () {
        angular.mock.module('atlas', function($provide){
            $provide.factory('atlasHeaderDirective', function(){
                return {};
            });
            $provide.factory('atlasPageDirective', function(){
                return {};
            });
            $provide.factory('atlasDetailDirective', function(){
                return {};
            });
            $provide.factory('atlasSearchResultsDirective', function(){
                return {};
            });
            $provide.factory('atlasLayerSelectionDirective', function(){
                return {};
            });
            $provide.factory('dpMapDirective', function(){
                return {};
            });
            $provide.factory('dpStraatbeeldDirective', function(){
                return {};
            });
            $provide.factory('atlasPrintStateDirective', function(){
                return {};
            });
        });

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _DEFAULT_STATE_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            defaultState = angular.copy(_DEFAULT_STATE_);
        });
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('atlas-dashboard');
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

    describe('visible panels and column sizes', function () {
        describe('by default (non print version)', function () {
            describe('when visiting a page', function () {
                var component;

                beforeEach(function () {
                    spyOn(store, 'getState').and.returnValue(defaultState);

                    component = getComponent();
                });

                it('has no the left column', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                });

                it('shows a small map (1/3) in the middle column', function () {
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .toContain('u-col-sm--4');
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .not.toContain('u-col-sm--8');

                    expect(component.find('.qa-dashboard__content__column--middle dp-map')).not.toBeNull();
                });

                it('shows a large page (2/3) in the right column', function () {
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .toContain('u-col-sm--8');
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .not.toContain('u-col-sm--4');

                    //It is scrollable
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .toContain('c-dashboard__content--scrollable');

                    expect(component.find('.qa-dashboard__content__column--right atlas-page').length).toBe(1);
                    expect(component.find('.qa-dashboard__content__column--right atlas-detail').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--right atlas-search-results').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--right dp-straatbeeld').length).toBe(0);
                });
            });

            ['query', 'location'].forEach(function (searchInput) {
                describe('after searching by ' + searchInput, function () {
                    var component;

                    beforeEach(function () {
                        var mockedState = angular.copy(defaultState);

                        mockedState.page = null;

                        if (searchInput === 'query') {
                            mockedState.search = {
                                query: 'this is a search query',
                                location: null
                            };
                        } else {
                            mockedState.search = {
                                query: null,
                                location: [52.123, 4789]
                            };
                        }

                        spyOn(store, 'getState').and.returnValue(mockedState);

                        component = getComponent();
                    });

                    it('shows no left column', function () {
                        expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                    });

                    it('shows a small map (1/3) in the middle column', function () {
                        expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                            .toContain('u-col-sm--4');
                        expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                            .not.toContain('u-col-sm--8');

                        expect(component.find('.qa-dashboard__content__column--middle dp-map').length).toBe(1);
                    });

                    it('shows search results in a large (2/3) right column', function () {
                        expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                            .toContain('u-col-sm--8');
                        expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                            .not.toContain('u-col-sm--4');

                        //It is scrollable
                        expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                            .toContain('c-dashboard__content--scrollable');

                        expect(component.find('.qa-dashboard__content__column--right atlas-search-results').length)
                            .toBe(1);
                        expect(component.find('.qa-dashboard__content__column--right atlas-page').length).toBe(0);
                        expect(component.find('.qa-dashboard__content__column--right atlas-detail').length).toBe(0);
                        expect(component.find('.qa-dashboard__content__column--right dp-straatbeeld').length).toBe(0);
                    });
                });
            });

            describe('when visiting a detail page', function () {
                var component;

                beforeEach(function () {
                    var mockedState = angular.copy(defaultState);

                    mockedState.detail = {};
                    mockedState.page = null;

                    spyOn(store, 'getState').and.returnValue(mockedState);

                    component = getComponent();
                });

                it('shows no left column', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                });

                it('shows a small map (1/3) in the middle column', function () {
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .toContain('u-col-sm--4');
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .not.toContain('u-col-sm--8');

                    expect(component.find('.qa-dashboard__content__column--middle dp-map').length).toBe(1);
                });

                it('shows a large detail page (2/3) in the right column', function () {
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .toContain('u-col-sm--8');
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .not.toContain('u-col-sm--4');

                    //It is scrollable
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .toContain('c-dashboard__content--scrollable');

                    expect(component.find('.qa-dashboard__content__column--right atlas-detail').length).toBe(1);
                    expect(component.find('.qa-dashboard__content__column--right atlas-search-results').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--right atlas-page').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--right dp-straatbeeld').length).toBe(0);
                });
            });

            describe('when visiting straatbeeld', function () {
                var component;

                beforeEach(function () {
                    var mockedState = angular.copy(defaultState);

                    mockedState.straatbeeld = {};
                    mockedState.page = null;

                    spyOn(store, 'getState').and.returnValue(mockedState);

                    component = getComponent();
                });

                it('shows no left column', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                });

                it('shows a small map (1/3) in the middle column', function () {
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .toContain('u-col-sm--4');
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .not.toContain('u-col-sm--8');

                    expect(component.find('.qa-dashboard__content__column--middle dp-map').length).toBe(1);
                });

                it('shows a large straatbeeld (2/3) in the right column', function () {
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .toContain('u-col-sm--8');
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .not.toContain('u-col-sm--4');

                    //It is not scrollable
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .not.toContain('c-dashboard__content--scrollable');

                    expect(component.find('.qa-dashboard__content__column--right dp-straatbeeld').length).toBe(1);
                    expect(component.find('.qa-dashboard__content__column--right atlas-detail').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--right atlas-search-results').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--right atlas-page').length).toBe(0);
                });
            });

            describe('when using layer selection', function () {
                var component;

                beforeEach(function () {
                    var mockedState = angular.copy(defaultState);

                    mockedState.map.showLayerSelection = true;
                    mockedState.detail = {
                        uri: 'blah/blah/123',
                        isLoading: false
                    };

                    spyOn(store, 'getState').and.returnValue(mockedState);

                    component = getComponent();
                });

                it('shows layer selection in a large (2/3) left column', function () {
                    expect(component.find('.qa-dashboard__content__column--left atlas-layer-selection').length).toBe(1);
                    expect(component.find('.qa-dashboard__content__column--left').attr('class'))
                        .toContain('u-col-sm--8');

                    expect(component.find('.qa-dashboard__content__column--left').attr('class'))
                        .not.toContain('u-col-sm--4');

                    //It has a 100% height
                    expect(component.find('.qa-dashboard__content__column--left').attr('class'))
                        .toContain('u-height--100');
                });

                it('shows a small map (1/3) in the middle column', function () {
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .toContain('u-col-sm--4');
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .not.toContain('u-col-sm--8');

                    expect(component.find('.qa-dashboard__content__column--middle dp-map').length).toBe(1);
                });

                it('shows no right column', function () {
                    expect(component.find('.qa-dashboard__content__column--right').length).toBe(0);
                });
            });

            describe('when using a fullscreen map', function () {
                var component;

                beforeEach(function () {
                    var mockedState = angular.copy(defaultState);

                    mockedState.map.isFullscreen = true;

                    spyOn(store, 'getState').and.returnValue(mockedState);

                    component = getComponent();
                });

                it('only shows one full-width column (3/3) with the map', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--middle').length).toBe(1);
                    expect(component.find('.qa-dashboard__content__column--right').length).toBe(0);

                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .toContain('u-col-sm--12');
                    expect(component.find('.qa-dashboard__content__column--middle dp-map').length).toBe(1);

                    //It is not scrollable
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .not.toContain('c-dashboard__content--scrollable');
                });
            });
        });

        describe('when viewing the print version', function () {
            describe('when visiting a page', function () {
                var component;

                beforeEach(function () {
                    defaultState.isPrintMode = true;
                    spyOn(store, 'getState').and.returnValue(defaultState);

                    component = getComponent();
                });

                it('hides the left and middle column', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--middle').length).toBe(0);
                });

                it('shows the right column, full width, with a page', function () {
                    expect(component.find('.qa-dashboard__content__column--right').length).toBe(1);
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .toContain('u-col-sm--12');
                    expect(component.find('.qa-dashboard__content__column--right atlas-page').length).toBe(1);
                });
            });

            ['query', 'location'].forEach(function (searchInput) {
                describe('after searching by ' + searchInput, function () {
                    var component;

                    beforeEach(function () {
                        var mockedState = angular.copy(defaultState);

                        mockedState.page = null;

                        if (searchInput === 'query') {
                            mockedState.search = {
                                query: 'this is a search query',
                                location: null
                            };
                        } else {
                            mockedState.search = {
                                query: null,
                                location: [52.123, 4789]
                            };
                        }

                        mockedState.isPrintMode = true;

                        spyOn(store, 'getState').and.returnValue(mockedState);

                        component = getComponent();
                    });

                    it('hides the left and middle column', function () {
                        expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                        expect(component.find('.qa-dashboard__content__column--middle').length).toBe(0);
                    });

                    it('shows the right column, full width, with search results', function () {
                        expect(component.find('.qa-dashboard__content__column--right').length).toBe(1);
                        expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                            .toContain('u-col-sm--12');
                        expect(component.find('.qa-dashboard__content__column--right atlas-search-results').length)
                            .toBe(1);
                    });
                });
            });

            describe('when visiting a detail page', function () {
                var component;

                beforeEach(function () {
                    var mockedState = angular.copy(defaultState);

                    mockedState.detail = {};
                    mockedState.page = null;
                    mockedState.isPrintMode = true;

                    spyOn(store, 'getState').and.returnValue(mockedState);

                    component = getComponent();
                });

                it('shows no left column', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                });

                it('shows a full-width map in the middle column', function () {
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .toContain('u-col-sm--12');

                    expect(component.find('.qa-dashboard__content__column--middle dp-map').length).toBe(1);
                });

                it('shows a full-width detail page in the right column', function () {
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .toContain('u-col-sm--12');

                    expect(component.find('.qa-dashboard__content__column--right atlas-detail').length).toBe(1);
                });
            });

            describe('when visiting straatbeeld', function () {
                var component;

                beforeEach(function () {
                    var mockedState = angular.copy(defaultState);

                    mockedState.straatbeeld = {};
                    mockedState.page = null;
                    mockedState.isPrintMode = true;

                    spyOn(store, 'getState').and.returnValue(mockedState);

                    component = getComponent();
                });

                it('shows no left column', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                });

                it('shows a full-width map in the middle column', function () {
                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .toContain('u-col-sm--12');

                    expect(component.find('.qa-dashboard__content__column--middle dp-map').length).toBe(1);
                });

                it('shows a full-width straatbeeld in the right column', function () {
                    expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                        .toContain('u-col-sm--12');

                    expect(component.find('.qa-dashboard__content__column--right dp-straatbeeld').length).toBe(1);
                });
            });

            describe('when using layer selection', function () {
                var component;

                beforeEach(function () {
                    var mockedState = angular.copy(defaultState);

                    mockedState.map.showLayerSelection = true;
                    mockedState.detail = {
                        uri: 'blah/blah/123',
                        isLoading: false
                    };
                    mockedState.isPrintMode = true;

                    spyOn(store, 'getState').and.returnValue(mockedState);

                    component = getComponent();
                });

                it('shows the left column, full width, with layer selection', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(1);
                    expect(component.find('.qa-dashboard__content__column--left').attr('class'))
                        .toContain('u-col-sm--12');
                    expect(component.find('.qa-dashboard__content__column--left atlas-layer-selection').length).toBe(1);
                });

                it('shows no middle and right column', function () {
                    expect(component.find('.qa-dashboard__content__column--middle').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--right').length).toBe(0);
                });
            });

            describe('when using a fullscreen map', function () {
                var component;

                beforeEach(function () {
                    var mockedState = angular.copy(defaultState);

                    mockedState.map.isFullscreen = true;
                    mockedState.isPrintMode = true;

                    spyOn(store, 'getState').and.returnValue(mockedState);

                    component = getComponent();
                });

                it('only shows one full-width column with the map', function () {
                    expect(component.find('.qa-dashboard__content__column--left').length).toBe(0);
                    expect(component.find('.qa-dashboard__content__column--middle').length).toBe(1);
                    expect(component.find('.qa-dashboard__content__column--right').length).toBe(0);

                    expect(component.find('.qa-dashboard__content__column--middle').attr('class'))
                        .toContain('u-col-sm--12');
                    expect(component.find('.qa-dashboard__content__column--middle dp-map').length).toBe(1);
                });
            });
        });
    });


    describe('the print state is communicated to atlas-print-state', function () {
        var component,
            scope,
            mockedState;

        beforeEach(function () {
            mockedState = angular.copy(defaultState);
        });

        it('can be disabled', function () {
            mockedState.isPrintMode = false;
            spyOn(store, 'getState').and.returnValue(mockedState);

            component = getComponent();
            scope = component.isolateScope();

            expect(component.find('.c-dashboard').attr('atlas-print-state')).toBeDefined();
            expect(component.find('.c-dashboard').attr('is-print-mode')).toBe('vm.isPrintMode');
            expect(scope.vm.isPrintMode).toBe(false);
        });

        it('can be enabled', function () {
            mockedState.isPrintMode = true;
            spyOn(store, 'getState').and.returnValue(mockedState);

            component = getComponent();
            scope = component.isolateScope();

            expect(component.find('.c-dashboard').attr('atlas-print-state')).toBeDefined();
            expect(component.find('.c-dashboard').attr('is-print-mode')).toBe('vm.isPrintMode');
            expect(scope.vm.isPrintMode).toBe(true);
        });
    });

    describe('the print mode has variable height', function () {
        var component,
            mockedState;

        beforeEach(function () {
            mockedState = angular.copy(defaultState);
        });

        it('uses a maximum height in non-print mode', function () {
            mockedState.isPrintMode = false;
            spyOn(store, 'getState').and.returnValue(mockedState);

            //Default 'screen' mode
            component = getComponent();

            expect(component.find('.u-grid').hasClass('u-height--100')).toBe(true);
            expect(component.find('.u-grid').hasClass('u-height--auto')).toBe(false);

            expect(component.find('.u-row').hasClass('u-height--100')).toBe(true);
            expect(component.find('.u-row').hasClass('u-height--false')).toBe(false);

            //Middle column
            expect(component.find('.qa-dashboard__content__column--middle').hasClass('u-height--100')).toBe(true);
            expect(component.find('.qa-dashboard__content__column--middle').hasClass('u-height--auto')).toBe(false);

            //Right column
            expect(component.find('.qa-dashboard__content__column--right').hasClass('u-height--100')).toBe(true);
            expect(component.find('.qa-dashboard__content__column--right').hasClass('u-height--auto')).toBe(false);

            //Open the left column
            mockedState.map.showLayerSelection = true;
            component = getComponent();

            //Check the left column
            expect(component.find('.qa-dashboard__content__column--left').hasClass('u-height--100')).toBe(true);
            expect(component.find('.qa-dashboard__content__column--left').hasClass('u-height--auto')).toBe(false);
        });

        it('uses the default (auto) height in print mode', function () {
            mockedState.detail = {};
            mockedState.page = null;
            mockedState.isPrintMode = true;
            spyOn(store, 'getState').and.returnValue(mockedState);

            //Default 'screen' mode
            component = getComponent();

            expect(component.find('.u-grid').hasClass('u-height--auto')).toBe(true);
            expect(component.find('.u-row').hasClass('u-height--auto')).toBe(true);

            //Middle column
            expect(component.find('.qa-dashboard__content__column--middle').hasClass('u-height--auto')).toBe(true);

            //Right column
            expect(component.find('.qa-dashboard__content__column--right').hasClass('u-height--auto')).toBe(true);

            //Open the left column
            mockedState.map.showLayerSelection = true;
            component = getComponent();

            //Check the left column
            expect(component.find('.qa-dashboard__content__column--left').hasClass('u-height--auto')).toBe(true);
        });
    });
});