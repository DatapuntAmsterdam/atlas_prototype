describe('The nevenadres filter', function () {
    let nevenadresFilter;

    beforeEach(function () {
        angular.mock.module('dpDataShared');

        angular.mock.inject(function (_nevenadresFilter_) {
            nevenadresFilter = _nevenadresFilter_;
        });
    });

    it('returns the String "(nevenadres)" when the input (hoofdadres) is "false"', function () {
        expect(nevenadresFilter('False')).toBe('(nevenadres)');
        expect(nevenadresFilter('false')).toBe('(nevenadres)');

        // Return an empty String for all other values
        expect(nevenadresFilter('True')).toBe('');
        expect(nevenadresFilter('')).toBe('');
    });
});
