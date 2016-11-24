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

    it('copies the string if no dictionary is present', function () {
        let abbreviated = abbreviate('');
        expect(deabbreviate(abbreviated)).toBe('');

        abbreviated = abbreviate('aap');
        expect(deabbreviate(abbreviated)).toBe('aap');
    });

    // it('abbreviates part of the string if a dictionary is present', function () {
    //     let map = new Map();
    //     map.set('long string', 'ls');
    //
    //     let abbreviated = abbreviate('This is ls a long string in a string.', map);
    //     expect(deabbreviate(abbreviated)).toBe('');
    //
    // });
});
