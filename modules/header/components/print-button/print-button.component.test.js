describe('The dp-print-button component', function () {
    var $compile,
        $rootScope,
        $window;

    beforeEach(function () {
        angular.mock.module('dpHeader');

        angular.mock.inject(function (_$compile_, _$rootScope_, _$window_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
        });
    });

    function getComponent (html) {
        var component,
            element,
            scope;

        element = document.createElement('dp-print-button');

        if (angular.isString(html)) {
            element.innerHTML = html;
        }

        scope = $rootScope.$new();
        component = $compile(element)(scope);
        scope.$digest();

        return component;
    }

    it('prints the page when clicking a button', function () {
        var component;

        spyOn($window, 'print');

        component = getComponent();
        component.find('button').click();

        expect($window.print).toHaveBeenCalled();
    });

    it('transcludes stuff', function () {
        var component,
            html;

        html = '<span class="some-class">Afdrukken</span>';
        component = getComponent(html);

        expect(component.find('button span').text()).toBe('Afdrukken');
        expect(component.find('button span').attr('class')).toContain('some-class');
    });
});
