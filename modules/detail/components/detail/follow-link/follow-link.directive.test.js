describe('The follow link directive', function () {
    var $rootScope,
        $compile,
        $window;

    beforeEach(function () {
        const $windowMock = {
            _paq: {
                push: angular.noop
            },
            open: angular.noop
        };

        angular.mock.module('dpDetail',
            function ($provide) {
                $provide.value('$window', $windowMock);
            }
        );
        angular.mock.module('dpDetail');

        angular.mock.inject(function (_$rootScope_, _$compile_, _$window_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $window = _$window_;
        });
    });

    function getDirective (url) {
        var directive,
            element,
            scope;

        element = document.createElement('div');
        element.setAttribute('dp-follow-link', url);
        scope = $rootScope.$new();

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('opens a window when clicking the element', function () {
        var directive;

        spyOn($window, 'open');

        directive = getDirective ('http://www.linktofollow.link');

        expect(directive.attr('dp-follow-link')).toBe('http://www.linktofollow.link');
        directive.click();
        expect($window.open).toHaveBeenCalled();
    });

    it('opens a window when pressing key', function () {
        var directive;

        spyOn($window, 'open');

        directive = getDirective ('http://www.linktofollow.link');
        expect(directive.attr('dp-follow-link')).toBe('http://www.linktofollow.link');

        var e = $.Event('keypress');
        e.key = 'Enter';

        directive.triggerHandler(e);
        expect($window.open).toHaveBeenCalled();

        e.key = 'Shift';
        directive.triggerHandler(e);
        expect($window.open).toHaveBeenCalledTimes(1);
    });
});
