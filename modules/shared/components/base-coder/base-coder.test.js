describe('The dpBaseCoder', function () {
    let baseCoder;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {}
        );

        angular.mock.inject(function (_dpBaseCoder_) {
            baseCoder = _dpBaseCoder_;
        });
    });

    function encoder (e, base, ndecimals) {
        let coder = baseCoder.getCoderForBase(base);
        return coder.encode(e, ndecimals);
    }

    function decoder (e, base, ndecimals) {
        let coder = baseCoder.getCoderForBase(base);
        return coder.decode(e, ndecimals);
    }

    it('encodes and decodes a number in any base between 2 and 62', function () {
        for (let base = 2; base <= 62; base++) {
            expect(encoder(0, base)).toBe('0');
            expect(decoder('0', base)).toBe(0);

            expect(encoder(-0, base)).toBe('0');
            expect(decoder('-0', base)).toBe(0);

            expect(encoder(1, base)).toBe('1');
            expect(decoder('1', base)).toBe(1);

            expect(encoder(base, base)).toBe('10');
            expect(decoder('10', base)).toBe(base);

            expect(encoder(base + 1, base)).toBe('11');
            expect(decoder('11', base)).toBe(base + 1);

            for (let n = -100; n < 100; n += 1) {
                let enc = encoder(n, base);
                expect(decoder(enc, base)).toBe(n);
            }

            [999, 12345, 9999, 123456, 99999, 1234567890]
                .map(n => [n, -n])
                .reduce((r, n) => r.concat(n), [])
                .forEach(n => {
                    let enc = encoder(n, base);
                    expect(decoder(enc, base)).toBe(n);
                });
        }
    });

    it('encodes a number by mapping it on 0-9A-Za-z', function () {
        expect(encoder(9, 10)).toBe('9');
        expect(encoder(-9, 10)).toBe('-9');
        expect(encoder(15, 16)).toBe('F');
        expect(encoder(-15, 16)).toBe('-F');
        expect(encoder(35, 36)).toBe('Z');
        expect(encoder(-35, 36)).toBe('-Z');
        expect(encoder(61, 62)).toBe('z');
        expect(encoder(-61, 62)).toBe('-z');
    });

    it('can encode an array of numbers', function () {
        expect(encoder([9, -9], 10)).toEqual(['9', '-9']);
        expect(decoder(['9', '-9'], 10)).toEqual([9, -9]);
        expect(encoder([15, -15], 16)).toEqual(['F', '-F']);
        expect(decoder(['F', '-F'], 16)).toEqual([15, -15]);
        expect(encoder([35, -35], 36)).toEqual(['Z', '-Z']);
        expect(decoder(['Z', '-Z'], 36)).toEqual([35, -35]);
        expect(encoder([61, -61], 62)).toEqual(['z', '-z']);
        expect(decoder(['z', '-z'], 62)).toEqual([61, -61]);
    });

    it('can encode floating point numbers', function () {
        expect(encoder(9.1, 10, 1)).toBe('91');

        expect(encoder(9.123456789, 10, 7)).toBe('91234568');
        expect(decoder('91234568', 10, 7)).toBe(9.1234568);

        expect(encoder(9.1, 10, 7)).toBe('91000000');
        expect(decoder('91000000', 10, 7)).toBe(9.1);

        expect(decoder('91', 10, 1)).toBe(9.1);
        expect(encoder([9.1, 9.2], 10, 1)).toEqual(['91', '92']);
        expect(decoder(['91', '92'], 10, 1)).toEqual([9.1, 9.2]);
    });

    it('can encode floating point numbers, decimals should be equal', function () {
        expect(encoder(9.123456789, 10, 1)).toBe('91');
        expect(decoder('91', 10, 1)).toBe(9.1);
        expect(decoder('91', 10, 7)).not.toBe(9.1);
        expect(decoder('91', 10, 7)).toBe(0.0000091);
    });

    it('can encode floating point numbers when precision is specified', function () {
        expect(encoder(9.1, 10)).toBeUndefined();
        expect(encoder([9.1, 9.2], 10)).toEqual([undefined, undefined]);
    });

    it('can encode an array of an array of numbers', function () {
        expect(encoder([[61, -61], [62, -62], [63, -63]], 62)).toEqual([['z', '-z'], ['10', '-10'], ['11', '-11']]);
        expect(decoder([['z', '-z'], ['10', '-10'], ['11', '-11']], 62)).toEqual([[61, -61], [62, -62], [63, -63]]);
    });

    describe('the dpBaseDecode filter', function () {
        it('works only for strings and arrays of strings', function () {
            expect(decoder(525, 10)).toBeUndefined();
            expect(decoder([525, 0], 10)).toEqual([undefined, undefined]);
            expect(decoder([525, '9'], 10)).toEqual([undefined, 9]);
        });

        it('works only for integer base', function () {
            [[525, 'aap'], [525, 10.1]].forEach(a => {
                let f = () => decoder(...a);
                expect(f).toThrow();
            });
        });

        it('works only for valid strings', function () {
            let f = () => decoder('G', 16);
            expect(f).toThrow();
        });

        it('works only for valid precisions', function () {
            [['F', 16, 1000], ['F', 16, -1], ['F', 16, 1.5], ['F', 16, 'aap'], ['F', 16, true]].forEach(a => {
                let f = () => decoder(...a);
                expect(f).toThrow();
            });
        });
    });

    describe('the dpBaseEncode filter', function () {
        it('works only for numbers and arrays of numbers', function () {
            expect(encoder('aap', 10)).toBeUndefined();
            expect(encoder(['aap', 'noot'], 10)).toEqual([undefined, undefined]);
            expect(encoder(['aap', 9], 10)).toEqual([undefined, '9']);
        });

        it('works only for integer base', function () {
            [[525, 'aap'], [525, 10.1]].forEach(a => {
                let f = () => encoder(...a);
                expect(f).toThrow();
            });
        });

        it('works only for valid precisions', function () {
            [[525, 10, 1000], [525, 10, -25], [525, 10, 5.7], [525, 10, 'noot'], [525, 10, false]].forEach(a => {
                let f = () => encoder(...a);
                expect(f).toThrow();
            });
        });
    });
});
