describe('The nevenadres filter', () => {
    let nevenadresFilter;

    beforeEach(() => {
        angular.mock.module('dpDataSelection');

        angular.mock.inject(_nevenadresFilter_ => {
            nevenadresFilter = _nevenadresFilter_;
        });
    });

    it('returns the String "(nevenadres)" when the input (hoofdadres) is "false"', () => {
        expect(nevenadresFilter('False')).toBe('(nevenadres)');
        expect(nevenadresFilter('false')).toBe('(nevenadres)');

        // Return an empty String for all other values
        expect(nevenadresFilter('True')).toBe('');
        expect(nevenadresFilter('')).toBe('');
    });
});
