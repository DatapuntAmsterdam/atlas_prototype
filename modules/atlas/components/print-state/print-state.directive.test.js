describe('The atlas-print-state directive', function () {
    var $compile,
        $rootScope,
        $window;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_$compile_, _$rootScope_, _$window_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
        });

        spyOn($window, 'print');
    });

    function getDirective (isPrintMode) {
        var directive,
            element,
            scope;

        element = document.createElement('div');
        element.setAttribute('atlas-print-state', '');
        element.setAttribute('is-print-mode', 'isPrintMode');

        scope = $rootScope.$new();
        scope.isPrintMode = isPrintMode;

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('adds a class when atlas-print-state becomes true', function () {
        var directive = getDirective(false),
            scope = directive.isolateScope();

        expect(directive.hasClass('is-print-mode')).toBe(false);

        //Trigger the watch
        scope.isPrintMode = true;
        scope.$apply();

        expect(directive.hasClass('is-print-mode')).toBe(true);
    });

    it('removes a class when atlas-print-state becomes false', function () {
        var directive = getDirective(true),
            scope = directive.isolateScope();

        expect(directive.hasClass('is-print-mode')).toBe(true);

        //Trigger the watch
        scope.isPrintMode = false;
        scope.$apply();

        expect(directive.hasClass('is-print-mode')).toBe(false);
    });

    it('triggers a call to window.print() when the print mode is enabled', function () {
        getDirective(true);

        //Not directly
        expect($window.print).not.toHaveBeenCalled();

        //But after the next digest cycle to make sure the state class has been added first
        $rootScope.$apply();
        expect($window.print).toHaveBeenCalled();
    });
});