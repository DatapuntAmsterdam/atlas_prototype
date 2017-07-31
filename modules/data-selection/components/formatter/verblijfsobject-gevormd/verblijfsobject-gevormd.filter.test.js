describe('The verblijfsobjectGevormd filter', () => {
    let verblijfsobjectGevormdFilter;

    beforeEach(() => {
        angular.mock.module('dpDataSelection');

        angular.mock.inject(_verblijfsobjectGevormdFilter_ => {
            verblijfsobjectGevormdFilter = _verblijfsobjectGevormdFilter_;
        });
    });

    it('returns "(verblijfsobject gevormd)" when the input (status_id) is "18"', () => {
        expect(verblijfsobjectGevormdFilter('18')).toBe('(verblijfsobject gevormd)');
    });

    it('returns an empty string for all other input values', () => {
        expect(verblijfsobjectGevormdFilter('17')).toBe('');
        expect(verblijfsobjectGevormdFilter('19')).toBe('');
        expect(verblijfsobjectGevormdFilter('')).toBe('');
    });
});
