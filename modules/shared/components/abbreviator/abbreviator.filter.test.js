describe('The dpAbbreviator filter', function () {
    let abbreviate,
        deabbreviate;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {}
        );

        angular.mock.inject(function (_dpAbbreviatorFilter_, _dpDeabbreviatorFilter_) {
            abbreviate = _dpAbbreviatorFilter_;
            deabbreviate = _dpDeabbreviatorFilter_;
        });
    });

    it('abbreviates and deabbreviates a string', function () {
        let abbreviated = abbreviate('');
        expect(deabbreviate(abbreviated)).toBe('');

        abbreviated = abbreviate('aap noot');
        expect(deabbreviate(abbreviated)).toBe('aap noot');
    });
});
