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

    //scrollable?
});