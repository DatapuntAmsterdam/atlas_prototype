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

    it('adds a class to the <html> element when atlas-print-state becomes true', function () {
        var directive = getDirective(false),
            htmlElement = angular.element(document.querySelector('html')),
            scope = directive.isolateScope();

        expect(htmlElement.hasClass('is-print-mode')).toBe(false);

        //Trigger the watch
        scope.isPrintMode = true;
        scope.$apply();

        expect(htmlElement.hasClass('is-print-mode')).toBe(true);
    });

    it('removes a class from the <html> element when atlas-print-state becomes false', function () {
        var directive = getDirective(true),
            htmlElement = angular.element(document.querySelector('html')),
            scope = directive.isolateScope();

        expect(htmlElement.hasClass('is-print-mode')).toBe(true);

        //Trigger the watch
        scope.isPrintMode = false;
        scope.$apply();

        expect(htmlElement.hasClass('is-print-mode')).toBe(false);
    });
});