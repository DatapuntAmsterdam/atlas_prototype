describe('The zipCode filter', function () {
    var zipCodeFilter;

    beforeEach(function () {
        angular.mock.module('dpDataShared');

        angular.mock.inject(function ($filter) {
            zipCodeFilter = $filter('zipCode');
        });
    });

    it('does format a 1234AB formatted zipcode', function () {
        expect(zipCodeFilter('1234AB')).toBe('1234 AB');
    });

    it('does not format non valid dutch zipcodes', function () {
        expect(zipCodeFilter('0234AB')).toBe('0234AB');
        expect(zipCodeFilter('1234$$')).toBe('1234$$');
    });

    it('does not format a non-1234AB formatted zipcode', function () {
        expect(zipCodeFilter('X')).toBe('X');
        expect(zipCodeFilter('1234 AB')).toBe('1234 AB');
    });

    it('does show empty zipcodes as (leeg)', function () {
        expect(zipCodeFilter('')).toBe('');
        expect(zipCodeFilter(null)).toBeNull();
        expect(zipCodeFilter(undefined)).toBeUndefined();
    });
});
