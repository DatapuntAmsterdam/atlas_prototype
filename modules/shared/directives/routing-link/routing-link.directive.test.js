describe('The routing link directive', function () {
    var $rootScope,
        $compile,
        $window;

    beforeEach(function () {
        const $windowMock = {
            location: 'module/'
        };

        angular.mock.module('dpDetail',
            function ($provide) {
                $provide.value('$window', $windowMock);
            }
        );

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
        element.setAttribute('dp-routing-link', url);
        scope = $rootScope.$new();

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('redirects to the route clicking the element', function () {
        var directive;
        var testRoute = 'module/action/id';
        directive = getDirective(testRoute);

        expect(directive.attr('dp-routing-link')).toBe(testRoute);
        directive.click();
        expect($window.location).toBe(testRoute);
    });
});
