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

    it('leaves the object unchanged if no dictionary is present', function () {
        let abbreviated = abbreviate({});
        expect(deabbreviate(abbreviated)).toEqual({});

        abbreviated = abbreviate({id: 'aap'});
        expect(deabbreviate(abbreviated)).toEqual({id: 'aap'});
    });

    it('abbreviates values in the object if a dictionary is present', function () {
        let map = new Map();
        map.set('ls', 'long string');

        let abbreviated,
            deabbreviated;

        abbreviated = abbreviate({id: 'This is a long string'}, map);
        expect(abbreviated).toEqual({id: 'This is a _LS_'});
        deabbreviated = deabbreviate(abbreviated, map);
        expect(deabbreviated).toEqual({id: 'This is a long string'});

        map.set('th', 'This is a');
        abbreviated = abbreviate({id: 'This is a long string'}, map);
        expect(abbreviated).toEqual({id: '_TH_ _LS_'});
        deabbreviated = deabbreviate(abbreviated, map);
        expect(deabbreviated).toEqual({id: 'This is a long string'});

        map.set('a', 'b');
        abbreviated = abbreviate({id: 'b', x: 'b'}, map);
        expect(abbreviated).toEqual({id: '_A_', x: '_A_'});
        deabbreviated = deabbreviate(abbreviated, map);
        expect(deabbreviated).toEqual({id: 'b', x: 'b'});
    });

    it('only abbreviates strings', function () {
        let map = new Map();
        map.set(1, 100);

        let abbreviated = abbreviate({id: 100, x: '100'});
        expect(deabbreviate(abbreviated)).toEqual({id: 100, x: '100'});

        map.set(2, true);
        abbreviated = abbreviate({id: 'aap', x: true});
        expect(deabbreviate(abbreviated)).toEqual({id: 'aap', x: true});
    });

    it('handles overlaps in strings', function () {
        let map = new Map();
        map.set('ls', 'ls');
        map.set('lsl', 'lsl');
        map.set('l', 'l');
        map.set('s', 's');

        let abbreviated = abbreviate({id: 'lslslsslslslsllslslsls'}, map);
        expect(deabbreviate(abbreviated)).toEqual({id: '_LS__LS__LS__S__LS__LS__LS__L__LS__LS__LS__LS_'});
        let deabbreviated = deabbreviate(abbreviated, map);
        expect(deabbreviated).toEqual({id: 'lslslsslslslsllslslsls'});

        map = new Map();
        map.set('s', 's');
        map.set('ls', 'ls');
        map.set('lsl', 'lsl');
        map.set('l', 'l');

        abbreviated = abbreviate({id: 'lslslsslslslsllslslsls'}, map);
        expect(deabbreviate(abbreviated)).toEqual(
            {id: '_L__S__L__S__L__S__S__L__S__L__S__L__S__L__L__S__L__S__L__S__L__S_'});
        deabbreviated = deabbreviate(abbreviated, map);
        expect(deabbreviated).toEqual({id: 'lslslsslslslsllslslsls'});
    });
});
