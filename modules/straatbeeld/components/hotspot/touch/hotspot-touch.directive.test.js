describe('The dp-hotspot-touch directive', function () {
    var $compile,
        $rootScope,
        mockedFunctions,
        scope;

    beforeEach(function () {
        angular.mock.module('dpStraatbeeld');

        mockedFunctions = {
            callClick: function () { }
        };
        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        spyOn(mockedFunctions, 'callClick');
    });

    function getComponent () {
        var component,
            element;

        element = document.createElement('button');
        element.setAttribute('dp-hotspot-touch', 'callClick');

        scope = $rootScope.$new();
        scope.callClick = mockedFunctions.callClick;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('checks for response on element on click and touch events', function () {
        var directive;

        directive = getComponent();

        directive.click();
        scope.$apply();
        expect(scope.callClick).toHaveBeenCalled();

        directive.triggerHandler('touchstart');
        scope.$apply();
        expect(scope.callClick).toHaveBeenCalledTimes(2);
    });
});
