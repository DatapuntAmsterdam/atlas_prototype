describe('The api-error component', function () {
    let $compile,
        $rootScope,
        currentStatus,
        httpStatus = {
            SERVER_ERROR: 'SERVER_ERROR',
            NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
            getStatus: () => currentStatus
        };

    beforeEach(function () {
        angular.mock.module('dpShared', {
            httpStatus,
            dpPanelDirective: {}
        });

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
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

    it('is shown based on the httpStatus.hasErrors flag', function () {
        currentStatus = {};
        let component = getComponent();
        expect(component.find('.qa-api-error').attr('is-panel-visible')).toBe('vm.httpStatus.hasErrors');
    });

    it('shows a server error message when SERVER_ERROR is set', function () {
        currentStatus = {
            hasErrors: true,
            SERVER_ERROR: true,
            NOT_FOUND_ERROR: false
        };

        let component = getComponent();
        expect(component.find('.qa-api-server-error').length).toBe(1);
        expect(component.find('.qa-api-not-found-error').length).toBe(0);
    });

    it('shows a not-found error message when NOT_FOUND_ERROR is set', function () {
        currentStatus = {
            hasErrors: true,
            NOT_FOUND_ERROR: true
        };

        let component = getComponent();
        expect(component.find('.qa-api-server-error').length).toBe(0);
        expect(component.find('.qa-api-not-found-error').length).toBe(1);
    });

    it('defaults to a server error message without any error flags set', function () {
        currentStatus = {
            hasErrors: true
        };

        let component = getComponent();
        expect(component.find('.qa-api-server-error').length).toBe(1);
        expect(component.find('.qa-api-not-found-error').length).toBe(0);
    });

    it('defaults to a server error message with an erroneous error flag set', function () {
        currentStatus = {
            hasErrors: true,
            FAULTY_ERROR_TYPE: true
        };

        let component = getComponent();
        expect(component.find('.qa-api-server-error').length).toBe(1);
        expect(component.find('.qa-api-not-found-error').length).toBe(0);
    });
});
