describe('The dp-alt directive', () => {
    var $compile,
        $rootScope;

    beforeEach(() => {
        angular.mock.module('dpShared');

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent () {
        const scope = $rootScope.$new(),
            component = $compile('<img src="srcUrl" dp-alt="altText">')(scope);

        return component;
    }

    it('sets the alt text when the src is loaded', () => {
        const component = getComponent();
        expect(component.attr('alt')).toBeUndefined();
        component.trigger('load');
        expect(component.attr('alt')).toBe('altText');
    });

    it('sets the alt text when the src fails to load', () => {
        const component = getComponent();
        expect(component.attr('alt')).toBeUndefined();
        component.trigger('error');
        expect(component.attr('alt')).toBe('altText');
    });
});
