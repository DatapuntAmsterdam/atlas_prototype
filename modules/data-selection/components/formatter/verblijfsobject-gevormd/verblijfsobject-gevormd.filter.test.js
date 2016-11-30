describe('The verblijfsobjectGevormd filter', function () {
    let verblijfsobjectGevormdFilter;

    beforeEach(function () {
        angular.mock.module('dpDataSelection');

        angular.mock.inject(function (_verblijfsobjectGevormdFilter_) {
            verblijfsobjectGevormdFilter = _verblijfsobjectGevormdFilter_;
        });
    });

    it('returns "(verblijfsobject gevormd)" when the input (status_id) is "18"', function () {
        expect(verblijfsobjectGevormdFilter('18')).toBe('(verblijfsobject gevormd)');
    });

    it('returns an empty string for all other input values', function () {
        expect(verblijfsobjectGevormdFilter('17')).toBe('');
        expect(verblijfsobjectGevormdFilter('19')).toBe('');
        expect(verblijfsobjectGevormdFilter('')).toBe('');
    });
});
