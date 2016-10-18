describe('The dp-wkpb-link directive', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module(
            'dpDetail',
            {
                environment: {
                    API_ROOT: 'http://www.api-root.com/'
                }
            },
            function ($provide) {
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent (brkId) {
        var component,
            element,
            scope;

        element = document.createElement('dp-wkpb-link');
        element.setAttribute('brk-id', brkId);

        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('creates a dp-link that triggers FETCH_DETAIL to a object-wkpb endpoint', function () {
        var component = getComponent('abc789'),
            scope = component.isolateScope();

        expect(component.find('dp-link').attr('type')).toBe('FETCH_DETAIL');
        expect(component.find('dp-link').attr('payload')).toBe('vm.wkpbEndpoint');
        expect(scope.vm.wkpbEndpoint).toBe('http://www.api-root.com/brk/object-wkpb/abc789/');
    });

    it('is spelled WKPB-uittreksel', function () {
        var component = getComponent('abc789');

        expect(component.text()).toContain('WKPB-uittreksel');
        expect(component.text()).not.toContain('WKPB uittreksel');
    });
});
