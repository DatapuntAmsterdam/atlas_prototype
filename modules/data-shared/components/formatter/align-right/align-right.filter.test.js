describe('The alignRight filter', function () {
    let alignRightFilter;

    beforeEach(function () {
        angular.mock.module('dpDataShared');

        angular.mock.inject(function ($filter) {
            alignRightFilter = $filter('alignRight');
        });
    });

    it('wraps a div with class u-align-right around the input (String)', function () {
        const output = angular.element(alignRightFilter('some text'));

        expect(output[0].tagName).toBe('DIV');
        expect(output.attr('class')).toBe('u-align--right');
        expect(output.text()).toBe('some text');
    });
});
