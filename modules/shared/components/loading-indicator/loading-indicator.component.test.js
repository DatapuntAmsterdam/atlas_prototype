describe('The dp-loading-indicator', function () {
    var $compile,
        $rootScope,
        $timeout;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_$compile_, _$rootScope_, _$timeout_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
        });
    });

    function getComponent (isLoading, useDelay, showInline) {
        var component,
            element,
            scope;

        element = document.createElement('dp-loading-indicator');
        element.setAttribute('is-loading', 'isLoading');
        element.setAttribute('use-delay', 'useDelay');
        element.setAttribute('show-inline', 'showInline');

        scope = $rootScope.$new();
        scope.isLoading = isLoading;
        scope.useDelay = useDelay;
        scope.showInline = showInline;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('shows a spinner when it\'s loading', function () {
        var component,
            isLoading;

        isLoading = true;
        component = getComponent(isLoading, false, true);
        $timeout.flush(0);

        expect(component.find('.c-loading-indicator').length).toBe(1);
        expect(component.find('.c-loading-indicator img').attr('src')).toBe('assets/icons/icon-spinner.gif');
        expect(component.find('.c-loading-indicator img').attr('alt')).toBe('');
        expect(component.find('.c-loading-indicator').text()).toContain('Bezig met laden');
    });

    it('has an option to delay the showing of the spinner (prevent unnecessary screen flickering)', function () {
        var component,
            isLoading;

        isLoading = true;
        component = getComponent(isLoading, true, true);

        //Not enough time has passed
        $timeout.flush(399);
        expect(component.find('.c-loading-indicator').length).toBe(0);

        //Enough time has passed
        $timeout.flush(1);
        expect(component.find('.c-loading-indicator').length).toBe(1);
    });

    it('the delayed showing of the spinner will be cancelled when the loading is finished', function () {
        var component,
            scope;

        component = getComponent(true, true, true);
        scope = component.isolateScope();

        //Not enough time has passed
        $timeout.flush(200);
        expect(component.find('.c-loading-indicator').length).toBe(0);

        //The loading finishes
        scope.vm.isLoading = false;
        $rootScope.$apply();

        //More time passes, but the loading indicator will never be shown
        $timeout.flush(5000);
        expect(component.find('.c-loading-indicator').length).toBe(0);
    });

    describe('it has two display variants:', function () {
        var component,
            isLoading;

        beforeEach(function () {
            isLoading = true;
        });

        it('as a box in the top left corner', function () {
            component = getComponent(isLoading, false, true);
            $timeout.flush(0);

            expect(component.find('.c-loading-indicator').attr('class')).not.toContain('c-loading-indicator--box');
        });

        it('inline', function () {
            component = getComponent(isLoading, false, false);
            $timeout.flush(0);

            expect(component.find('.c-loading-indicator').attr('class')).toContain('c-loading-indicator--box');
        });
    });
});