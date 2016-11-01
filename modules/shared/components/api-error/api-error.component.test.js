describe('The api-error component', function () {
    let $compile,
        $rootScope,
        httpStatus;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_$compile_, _$rootScope_, _httpStatus_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            httpStatus = _httpStatus_;
        });
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('dp-api-error');
        scope = $rootScope.$new();
        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('shows an error message when there are any http errors', function () {
        httpStatus.registerError();

        let component = getComponent();
        expect(component.find('.qa-api-error').length).toBe(1);
    });

    it('shows nothing when there are no http errors', function () {
        httpStatus.getStatus().hasErrors = false;

        let component = getComponent();
        expect(component.find('.qa-api-error').length).toBe(0);
    });
});
