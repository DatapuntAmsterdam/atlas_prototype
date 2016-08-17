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

    describe('by default', function () {
        var component,
            columns;

        beforeEach(function () {
            spyOn(store, 'getState').and.returnValue(defaultState);

            component = getComponent();
            columns = component[0].querySelectorAll('.c-dashboard__content [class^="u-col-sm--"]');
        });

        it('has no the left column', function () {
            expect(columns.length).toBe(2);
            expect(columns[0].querySelector('atlas-layer-selection')).toBeNull();
        });

        it('shows a small map (1/3) in the middle column', function () {
            expect(columns[0].getAttribute('class')).toContain('u-col-sm--4');
            expect(columns[0].getAttribute('class')).not.toContain('u-col-sm--8');

            expect(columns[0].querySelector('dp-map')).not.toBeNull();
        });

        it('shows a large page (2/3) in the right page', function () {
            expect(columns[1].getAttribute('class')).toContain('u-col-sm--8');
            expect(columns[1].getAttribute('class')).not.toContain('u-col-sm--4');

            //It is scrollable
            expect(columns[1].getAttribute('class')).toContain('c-dashboard__content--scrollable');

            expect(columns[1].querySelector('atlas-page')).not.toBeNull();
            expect(columns[1].querySelector('atlas-detail')).toBeNull();
            expect(columns[1].querySelector('atlas-search-results')).toBeNull();
            expect(columns[1].querySelector('dp-straatbeeld')).toBeNull();
        });
    });

    ['query', 'location'].forEach(function (searchInput) {
        describe('after searching by ' + searchInput, function () {
            var component,
                columns;

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
                columns = component[0].querySelectorAll('.c-dashboard__content [class^="u-col-sm--"]');
            });

            it('shows no left column', function () {
                expect(columns.length).toBe(2);
                expect(columns[0].querySelector('atlas-layer-selection')).toBeNull();
            });

            it('shows a small map (1/3) in the middle column', function () {
                expect(columns[0].getAttribute('class')).toContain('u-col-sm--4');
                expect(columns[0].getAttribute('class')).not.toContain('u-col-sm--8');

                expect(columns[0].querySelector('dp-map')).not.toBeNull();
            });

            it('shows search results in a large (2/3) right column', function () {
                expect(columns[1].getAttribute('class')).toContain('u-col-sm--8');
                expect(columns[1].getAttribute('class')).not.toContain('u-col-sm--4');

                //It is scrollable
                expect(columns[1].getAttribute('class')).toContain('c-dashboard__content--scrollable');

                expect(columns[1].querySelector('atlas-search-results')).not.toBeNull();
                expect(columns[1].querySelector('atlas-page')).toBeNull();
                expect(columns[1].querySelector('atlas-detail')).toBeNull();
                expect(columns[1].querySelector('dp-straatbeeld')).toBeNull();
            });
        });
    });

    describe('when visiting a detail page', function () {
        var component,
            columns;

        beforeEach(function () {
            var mockedState = angular.copy(defaultState);

            mockedState.detail = {};
            mockedState.page = null;

            spyOn(store, 'getState').and.returnValue(mockedState);

            component = getComponent();
            columns = component[0].querySelectorAll('.c-dashboard__content [class^="u-col-sm--"]');
        });

        it('shows no left column', function () {
            expect(columns.length).toBe(2);
            expect(columns[0].querySelector('atlas-layer-selection')).toBeNull();
        });

        it('shows a small map (1/3) in the middle column', function () {
            expect(columns[0].getAttribute('class')).toContain('u-col-sm--4');
            expect(columns[0].getAttribute('class')).not.toContain('u-col-sm--8');

            expect(columns[0].querySelector('dp-map')).not.toBeNull();

        });

        it('shows a large detail page (2/3) in the right column', function () {
            expect(columns[1].getAttribute('class')).toContain('u-col-sm--8');
            expect(columns[1].getAttribute('class')).not.toContain('u-col-sm--4');

            //It is scrollable
            expect(columns[1].getAttribute('class')).toContain('c-dashboard__content--scrollable');

            expect(columns[1].querySelector('atlas-detail')).not.toBeNull();
            expect(columns[1].querySelector('atlas-search-results')).toBeNull();
            expect(columns[1].querySelector('atlas-page')).toBeNull();
            expect(columns[1].querySelector('dp-straatbeeld')).toBeNull();
        });
    });

    describe('when visiting straatbeeld', function () {
        var component,
            columns;

        beforeEach(function () {
            var mockedState = angular.copy(defaultState);

            mockedState.straatbeeld = {};
            mockedState.page = null;

            spyOn(store, 'getState').and.returnValue(mockedState);

            component = getComponent();
            columns = component[0].querySelectorAll('.c-dashboard__content [class^="u-col-sm--"]');
        });

        it('shows no left column', function () {
            expect(columns.length).toBe(2);
            expect(columns[0].querySelector('atlas-layer-selection')).toBeNull();
        });

        it('shows a small map (1/3) in the middle column', function () {
            expect(columns[0].getAttribute('class')).toContain('u-col-sm--4');
            expect(columns[0].getAttribute('class')).not.toContain('u-col-sm--8');

            expect(columns[0].querySelector('dp-map')).not.toBeNull();
        });

        it('shows a large straatbeeld (2/3) in the right column', function () {
            expect(columns[1].getAttribute('class')).toContain('u-col-sm--8');
            expect(columns[1].getAttribute('class')).not.toContain('u-col-sm--4');

            //It is not scrollable
            expect(columns[1].getAttribute('class')).not.toContain('c-dashboard__content--scrollable');

            expect(columns[1].querySelector('dp-straatbeeld')).not.toBeNull();
            expect(columns[1].querySelector('atlas-detail')).toBeNull();
            expect(columns[1].querySelector('atlas-search-results')).toBeNull();
            expect(columns[1].querySelector('atlas-page')).toBeNull();
        });
    });

    describe('when using layer selection', function () {
        var component,
            columns;

        beforeEach(function () {
            var mockedState = angular.copy(defaultState);

            mockedState.map.showLayerSelection = true;
            mockedState.detail = {
                uri: 'blah/blah/123',
                isLoading: false
            };

            spyOn(store, 'getState').and.returnValue(mockedState);

            component = getComponent();
            columns = component[0].querySelectorAll('.c-dashboard__content [class^="u-col-sm--"]');
        });

        it('shows layer selection in a large (2/3) left column', function () {
            expect(columns[0].querySelector('atlas-layer-selection')).not.toBeNull();
            expect(columns[0].getAttribute('class')).toContain('u-col-sm--8');
            expect(columns[0].getAttribute('class')).not.toContain('u-col-sm--4');

            //It has a 100% height
            expect(columns[0].getAttribute('class')).toContain('u-height-100');
        });

        it('shows a small map (1/3) in the middle column', function () {
            expect(columns[1].getAttribute('class')).toContain('u-col-sm--4');
            expect(columns[1].getAttribute('class')).not.toContain('u-col-sm--8');

            expect(columns[1].querySelector('dp-map')).not.toBeNull();
        });

        it('shows no right column', function () {
            expect(columns.length).toBe(2);
        });
    });

    describe('when using a fullscreen map', function () {
        var component,
            columns;

        beforeEach(function () {
            var mockedState = angular.copy(defaultState);

            mockedState.map.isFullscreen = true;

            spyOn(store, 'getState').and.returnValue(mockedState);

            component = getComponent();
            columns = component[0].querySelectorAll('.c-dashboard__content [class^="u-col-sm--"]');
        });

        it('only shows one full-width column (3/3) with the map', function () {
            expect(columns.length).toBe(1);
            expect(columns[0].getAttribute('class')).toContain('u-col-sm--12');
            expect(columns[0].querySelector('dp-map')).not.toBeNull();

            //It is not scrollable
            expect(columns[0].getAttribute('class')).not.toContain('c-dashboard__content--scrollable');
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

    describe('the print mode has no u-height-100 helper classes', function () {
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

            expect(component.find('.u-grid').hasClass('u-height-100')).toBe(true);
            expect(component.find('.u-row').hasClass('u-height-100')).toBe(true);

            //Middle column
            expect(component.find('.u-col-sm--4').hasClass('u-height-100')).toBe(true);

            //Right column
            expect(component.find('.u-col-sm--8').hasClass('u-height-100')).toBe(true);

            //Open the left column
            mockedState.map.showLayerSelection = true;
            component = getComponent();

            //Check the left column
            expect(component.find('.u-col-sm--8').hasClass('u-height-100')).toBe(true);
        });

        it('uses the default (auto) height in print mode', function () {
            mockedState.isPrintMode = true;
            spyOn(store, 'getState').and.returnValue(mockedState);

            //Default 'screen' mode
            component = getComponent();

            expect(component.find('.u-grid').hasClass('u-height-100')).toBe(false);
            expect(component.find('.u-row').hasClass('u-height-100')).toBe(false);

            //Middle column
            expect(component.find('.u-col-sm--4').hasClass('u-height-100')).toBe(false);

            //Right column
            expect(component.find('.u-col-sm--8').hasClass('u-height-100')).toBe(false);

            //Open the left column
            mockedState.map.showLayerSelection = true;
            component = getComponent();

            //Check the left column
            expect(component.find('.u-col-sm--8').hasClass('u-height-100')).toBe(false);
        });
    });
});