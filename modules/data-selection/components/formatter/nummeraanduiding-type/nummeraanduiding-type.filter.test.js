describe('The nummeraanduidingType filter', function () {
    let nummeraanduidingTypeFilter;

    beforeEach(function () {
        angular.mock.module('dpDataSelection');

        angular.mock.inject(function (_nummeraanduidingTypeFilter_) {
            nummeraanduidingTypeFilter = _nummeraanduidingTypeFilter_;
        });
    });

    it('returns "(ligplaats)" when there is a ligplaats_id', function () {
        const input = {
            ligplaats_id: '12345',
            standplaats_id: ''
        };
        expect(nummeraanduidingTypeFilter(input)).toBe('(ligplaats)');
    });

    it('returns "(standplaats)" when there is a standplaats_id', function () {
        const input = {
            ligplaats_id: '',
            standplaats_id: '12345'
        };
        expect(nummeraanduidingTypeFilter(input)).toBe('(standplaats)');
    });

    it('returns an empty string when there is no ligplaats_id and no standplaats_id', function () {
        const input = {
            ligplaats_id: '',
            standplaats_id: ''
        };
        expect(nummeraanduidingTypeFilter(input)).toBe('');
    });
});
