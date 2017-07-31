describe('The yesNo filter', () => {
    var yesNo;

    beforeEach(() => {
        angular.mock.module('dpDetail');

        angular.mock.inject($filter => {
            yesNo = $filter('yesNo');
        });
    });

    it('converts boolean true to \'Ja\'', () => {
        expect(yesNo(true)).toBe('Ja');
    });

    it('converts boolean false to \'Nee\'', () => {
        expect(yesNo(false)).toBe('Nee');
    });

    it('converts none boolean values to an empty string', () => {
        expect(yesNo('0')).toBe('');
        expect(yesNo(0)).toBe('');
        expect(yesNo(1)).toBe('');
        expect(yesNo(null)).toBe('');
        expect(yesNo(undefined)).toBe('');
    });
});
