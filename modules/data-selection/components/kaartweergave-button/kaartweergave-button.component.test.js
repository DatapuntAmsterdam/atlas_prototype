describe('The dp-data-selection-kaartweergave-button component', function () {
    var $rootScope,
        $compile;

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-selection-kaartweergave-button');
        scope = $rootScope.$new();
        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('can be created', function () {
        angular.mock.inject(function (_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
        });

        expect(getComponent()).toBeDefined();
    });
});
