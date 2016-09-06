describe('The dashboard component', function () {
    var $compile,
        $rootScope,
        store,
        dashboardColumns,
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
            $provide.factory('dpDataSelectionDirective', function(){
                return {};
            });
        });

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _dashboardColumns_, _DEFAULT_STATE_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            dashboardColumns = _dashboardColumns_;
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

    ['page', 'detail', 'searchResults', 'dataSelection'].forEach(function (panel) {
        describe('use scrollable content for ' + panel, function () {
            var component,
                mockedVisibility = {};

            beforeEach(function () {
                mockedVisibility[panel] = true;

                spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);

                component = getComponent();
            });

            it('removes padding from the c-dashboard__content container', function () {
                expect(component.find('.c-dashboard__content').attr('class')).not.toContain('u-padding__right--1');
            });

            it('adds extra padding to the right panel and makes it scrollable', function () {
                expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                    .not.toContain('u-padding__right--1');

                expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                    .toContain('u-padding__right--2');
                expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                    .toContain('c-dashboard__content--scrollable');
            });
        });
    });

    describe('do not use scrollable content for straatbeeld', function () {
        var component,
            mockedVisibility = {};

        beforeEach(function () {
            mockedVisibility['straatbeeld'] = true;

            spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);

            component = getComponent();
        });

        it('does not touch padding on the c-dashboard__content container', function () {
            expect(component.find('.c-dashboard__content').attr('class')).toContain('u-padding__right--1');
        });

        it('does not touch the classes on the right panel', function () {
            expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                .toContain('u-padding__right--1');

            expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                .not.toContain('u-padding__right--2');
            expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                .not.toContain('c-dashboard__content--scrollable');
        });
    });

    ['page', 'detail', 'searchResults'].forEach(function (panel) {
        describe('don\'t add scrolling when viewing the fullscreen map (on top of ' + panel + ')', function () {
            var component,
                mockedState,
                mockedVisibility = {};

            beforeEach(function () {
                mockedState = angular.copy(defaultState);
                mockedState.map.isFullscreen = true;
                spyOn(store, 'getState').and.returnValue(mockedState);

                mockedVisibility[panel] = true;
                spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);

                component = getComponent();
            });

            it('does not remove whitespace from .c-dashboard__content' + panel, function () {
                expect(component.find('.c-dashboard__content').attr('class')).toContain('u-padding__right--1');
            });
        });
    });

    ['page', 'detail', 'searchResults', 'dataSelection'].forEach(function (panel) {
        describe('when printing ' + panel, function () {
            var component,
                mockedState,
                mockedVisibility = {};

            beforeEach(function () {
                mockedState = angular.copy(defaultState);
                mockedState.isPrintMode = true;
                spyOn(store, 'getState').and.returnValue(mockedState);

                mockedVisibility[panel] = true;
                spyOn(dashboardColumns, 'determineVisibility').and.returnValue(mockedVisibility);

                component = getComponent();
            });

            it('doesn\'t add any padding on c-dashboard__content', function () {
                expect(component.find('.c-dashboard__content').attr('class')).not.toContain('u-padding__right--1');
                expect(component.find('.c-dashboard__content').attr('class')).not.toContain('u-padding__right--2');
                expect(component.find('.c-dashboard__content').attr('class')).not.toContain('u-padding__left--1');
            });

            it('does not touch the classes on the right panel', function () {
                //No padding on the right
                expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                    .not.toContain('u-padding__right--1');
                expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                    .not.toContain('u-padding__right--2');

                //No padding on the left
                expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                    .not.toContain('u-padding__left--1');

                //Not scrollable
                expect(component.find('.qa-dashboard__content__column--right').attr('class'))
                    .not.toContain('c-dashboard__content--scrollable');
            });
        });
    });
});