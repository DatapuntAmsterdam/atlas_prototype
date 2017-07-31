describe('The api-error component', () => {
    let $compile,
        $rootScope,
        currentStatus;
    const httpStatus = {
        SERVER_ERROR: 'SERVER_ERROR',
        NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
        getStatus: () => currentStatus
    };

    beforeEach(() => {
        angular.mock.module('dpShared', {
            httpStatus,
            dpPanelDirective: {}
        });

        angular.mock.inject((_$compile_, _$rootScope_) => {
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

    it('is shown based on the httpStatus.hasErrors flag', () => {
        currentStatus = {};
        const component = getComponent();
        expect(component.find('.qa-api-error').attr('is-panel-visible')).toBe('vm.httpStatus.hasErrors');
    });

    it('shows a server error message when SERVER_ERROR is set', () => {
        currentStatus = {
            hasErrors: true,
            SERVER_ERROR: true,
            NOT_FOUND_ERROR: false
        };

        const component = getComponent();
        expect(component.find('.qa-api-server-error').length).toBe(1);
        expect(component.find('.qa-api-not-found-error').length).toBe(0);
    });

    it('shows a not-found error message when NOT_FOUND_ERROR is set', () => {
        currentStatus = {
            hasErrors: true,
            NOT_FOUND_ERROR: true
        };

        const component = getComponent();
        expect(component.find('.qa-api-server-error').length).toBe(0);
        expect(component.find('.qa-api-not-found-error').length).toBe(1);
    });

    it('defaults to a server error message without any error flags set', () => {
        currentStatus = {
            hasErrors: true
        };

        const component = getComponent();
        expect(component.find('.qa-api-server-error').length).toBe(1);
        expect(component.find('.qa-api-not-found-error').length).toBe(0);
    });

    it('defaults to a server error message with an erroneous error flag set', () => {
        currentStatus = {
            hasErrors: true,
            FAULTY_ERROR_TYPE: true
        };

        const component = getComponent();
        expect(component.find('.qa-api-server-error').length).toBe(1);
        expect(component.find('.qa-api-not-found-error').length).toBe(0);
    });
});
