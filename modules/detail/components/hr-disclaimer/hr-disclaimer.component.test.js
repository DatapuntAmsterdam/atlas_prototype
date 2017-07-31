describe('The hr-disclaimer component', () => {
    var $compile,
        $rootScope;

    beforeEach(() => {
        angular.mock.module('dpDetail');

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('dp-hr-disclaimer');

        scope = $rootScope.$new();

        component = $compile(element)(scope);

        scope.$apply();

        return component;
    }

    it('is shown in a warning panel that can be closed', () => {
        const component = getComponent();

        expect(component.find('dp-panel').attr('type')).toBe('warning');
        expect(component.find('dp-panel').attr('can-close')).toBe('true');
    });

    it('has a Disclaimer header', () => {
        const component = getComponent();

        expect(component.find('dp-panel h3').text()).toBe('Disclaimer');
    });

    it('contains paragraphs that hold the contents of the disclaimer', () => {
        const component = getComponent();

        expect(component.find('dp-panel p').length > 0).toBe(true);
    });

    it('contains a link to the KvK zoek page', () => {
        const component = getComponent();

        expect(component.find('dp-panel a').attr('href')).toBe('https://www.kvk.nl/zoeken/');
    });
});
