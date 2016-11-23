describe('The dp-print-state directive', function () {
    var $compile,
        $rootScope,
        mockedState;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            {
                store: {
                    subscribe: function (callbackFn) {
                        callbackFn();
                    },
                    getState: function () {
                        return mockedState;
                    }
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getDirective () {
        var directive,
            element,
            scope;

        element = document.createElement('div');
        element.setAttribute('dp-print-state', '');

        scope = $rootScope.$new();

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('adds a printmode class to the element when isPrintMode is true', function () {
        var directive;

        mockedState = {isPrintMode: true};

        directive = getDirective();

        expect(directive.hasClass('is-print-mode')).toBe(true);
    });

    it('does not add a class to the element when isPrintMode is false', function () {
        var directive;

        mockedState = {isPrintMode: false};

        directive = getDirective();

        expect(directive.hasClass('is-print-mode')).toBe(false);
    });

    it('adds a print-landscape class to the element when map or panorama or fullscreen map is visible', function () {
        var directive;

        mockedState = { isPrintMode: true, map: { isFullscreen: true } };

        directive = getDirective();

        expect(directive.hasClass('print-landscape')).toBe(true);
    });

    it('Do not add a print-landscape class when we are on a page, detail or results view', function () {
        var directive;

        mockedState = { isPrintMode: true, straatbeeld: null, map: { isFullscreen: false } };

        directive = getDirective();

        expect(directive.hasClass('print-landscape')).toBe(false);
    });
});
