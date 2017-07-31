describe('The follow link directive', () => {
    var $rootScope,
        $compile,
        $window;

    beforeEach(() => {
        angular.mock.module('dpDetail');

        angular.mock.inject((_$rootScope_, _$compile_, _$window_) => {
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

    it('opens a window when clicking the element', () => {
        var directive;

        spyOn($window, 'open');

        directive = getDirective ('http://www.linktofollow.link');

        expect(directive.attr('dp-follow-link')).toBe('http://www.linktofollow.link');
        directive.click();
        expect($window.open).toHaveBeenCalled();
    });
});
