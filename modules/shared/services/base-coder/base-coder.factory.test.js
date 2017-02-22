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

    function encode (e, base, ndecimals) {
        let code = baseCoder.getCoderForBase(base);
        return code.encode(e, ndecimals);
    }

    function stringEncode (e, base, ndecimals) {
        let code = baseCoder.getCoderForBase(base);
        return code.encodeFromString(e, ndecimals);
    }

    function decode (e, base, ndecimals) {
        let code = baseCoder.getCoderForBase(base);
        return code.decode(e, ndecimals);
    }

    it('encodes and decodes a number in any base between 2 and 62', function () {
        for (let base = 2; base <= 62; base++) {
            expect(encode(0, base)).toBe('0');
            expect(decode('0', base)).toBe(0);

            expect(encode(-0, base)).toBe('0');
            expect(decode('-0', base)).toBe(0);

            expect(encode(1, base)).toBe('1');
            expect(decode('1', base)).toBe(1);

            expect(encode(base, base)).toBe('10');
            expect(decode('10', base)).toBe(base);

            expect(encode(base + 1, base)).toBe('11');
            expect(decode('11', base)).toBe(base + 1);

            for (let n = -100; n < 100; n += 1) {
                let enc = encode(n, base);
                expect(decode(enc, base)).toBe(n);
            }

            [999, 12345, 9999, 123456, 99999, 1234567890]
                .map(n => [n, -n])
                .reduce((r, n) => r.concat(n), [])
                .forEach(n => {
                    let enc = encode(n, base);
                    expect(decode(enc, base)).toBe(n);
                });
        }
    });

    it('encodes a number by mapping it on 0-9A-Za-z', function () {
        expect(encode(9, 10)).toBe('9');
        expect(encode(-9, 10)).toBe('-9');
        expect(encode(15, 16)).toBe('F');
        expect(encode(-15, 16)).toBe('-F');
        expect(encode(35, 36)).toBe('Z');
        expect(encode(-35, 36)).toBe('-Z');
        expect(encode(61, 62)).toBe('z');
        expect(encode(-61, 62)).toBe('-z');
    });

    it('can encode an array of numbers', function () {
        expect(encode([9, -9], 10)).toEqual(['9', '-9']);
        expect(decode(['9', '-9'], 10)).toEqual([9, -9]);
        expect(encode([15, -15], 16)).toEqual(['F', '-F']);
        expect(decode(['F', '-F'], 16)).toEqual([15, -15]);
        expect(encode([35, -35], 36)).toEqual(['Z', '-Z']);
        expect(decode(['Z', '-Z'], 36)).toEqual([35, -35]);
        expect(encode([61, -61], 62)).toEqual(['z', '-z']);
        expect(decode(['z', '-z'], 62)).toEqual([61, -61]);
    });

    it('can encode from strings', function () {
        expect(stringEncode('9', 10)).toBe('9');
        expect(stringEncode('-9', 10)).toBe('-9');
        expect(stringEncode('15', 16)).toBe('F');
        expect(stringEncode('-15', 16)).toBe('-F');
        expect(stringEncode('35', 36)).toBe('Z');
        expect(stringEncode('-35', 36)).toBe('-Z');
        expect(stringEncode('61', 62)).toBe('z');
        expect(stringEncode('-61', 62)).toBe('-z');
    });

    it('can encode floating point numbers', function () {
        expect(encode(9.1, 10, 1)).toBe('91');

        expect(encode(1.005, 10, 2)).toBe('101');
        expect(decode('101', 10, 2)).toBe(1.01);

        expect(encode(9.123456789, 10, 7)).toBe('91234568');
        expect(decode('91234568', 10, 7)).toBe(9.1234568);

        expect(encode(9.1, 10, 7)).toBe('91000000');
        expect(decode('91000000', 10, 7)).toBe(9.1);

        expect(decode('91', 10, 1)).toBe(9.1);
        expect(encode([9.1, 9.2], 10, 1)).toEqual(['91', '92']);
        expect(decode(['91', '92'], 10, 1)).toEqual([9.1, 9.2]);
    });

    it('can encode floating point numbers, but decimals should be equal for encode and decode', function () {
        expect(encode(9.123456789, 10, 1)).toBe('91');
        expect(decode('91', 10, 1)).toBe(9.1);
        expect(decode('91', 10, 7)).not.toBe(9.1);
        expect(decode('91', 10, 7)).toBe(0.0000091);
    });

    it('can not encode floating point numbers when precision is specified', function () {
        expect(encode(9.1, 10)).toBeUndefined();
        expect(encode([9.1, 9.2], 10)).toEqual([undefined, undefined]);
    });

    it('can encode an array of an array of numbers', function () {
        expect(encode([[61, -61], [62, -62], [63, -63]], 62)).toEqual([['z', '-z'], ['10', '-10'], ['11', '-11']]);
        expect(decode([['z', '-z'], ['10', '-10'], ['11', '-11']], 62)).toEqual([[61, -61], [62, -62], [63, -63]]);
    });

    describe('the dpBaseDecode filter', function () {
        it('works only for strings and arrays of strings', function () {
            expect(decode(525, 10)).toBeUndefined();
            expect(decode([525, 0], 10)).toEqual([undefined, undefined]);
            expect(decode([525, '9'], 10)).toEqual([undefined, 9]);
        });

        it('works only for integer base', function () {
            [[525, 'aap'], [525, 10.1]].forEach(a => {
                let f = () => decode(...a);
                expect(f).toThrowError(RangeError);
            });
        });

        it('works only for valid strings', function () {
            let f = () => decode('G', 16);
            expect(f).toThrowError(TypeError);
        });

        it('works only for valid precisions', function () {
            [['F', 16, -1], ['F', 16, 1.5], ['F', 16, 'aap'], ['F', 16, true]].forEach(a => {
                let f = () => decode(...a);
                expect(f).toThrowError(RangeError);
            });
        });

        it('returns NaN when precision is too big', function () {
            expect(encode(100, 16, 1000)).toBeNaN();
        });
    });

    describe('the dpBaseEncode filter', function () {
        it('works only for numbers and arrays of numbers', function () {
            expect(encode('aap', 10)).toBeUndefined();
            expect(encode(['aap', 'noot'], 10)).toEqual([undefined, undefined]);
            expect(encode(['aap', 9], 10)).toEqual([undefined, '9']);
        });

        it('works only for integer base', function () {
            [[525, 'aap'], [525, 10.1]].forEach(a => {
                let f = () => encode(...a);
                expect(f).toThrowError(RangeError);
            });
        });

        it('works only for valid precisions', function () {
            [[525, 10, -25], [525, 10, 5.7], [525, 10, 'noot'], [525, 10, false]].forEach(a => {
                let f = () => encode(...a);
                expect(f).toThrowError(RangeError);
            });
        });

        it('returns undefined when precision is too big', function () {
            expect(decode('F', 16, 1000)).toBeNaN();
        });
    });

    describe('The toPrecision method', function () {
        it('rounds a number to the specified precision', function () {
            expect(baseCoder.toPrecision(1, 5)).toBe(1);
            expect(baseCoder.toPrecision(1.12345, 5)).toBe(1.12345);
            expect(baseCoder.toPrecision(1.123454, 5)).toBe(1.12345);
            expect(baseCoder.toPrecision(1.123455, 5)).toBe(1.12346);
            expect(baseCoder.toPrecision(1.123456, 5)).toBe(1.12346);
        });

        it('rounds an array of numbers to the specified precision', function () {
            expect(baseCoder.toPrecision([1, 1], 5)).toEqual([1, 1]);
            expect(baseCoder.toPrecision([1.12345, 1.12345], 5)).toEqual([1.12345, 1.12345]);
            expect(baseCoder.toPrecision([1.123454, 1.123454], 5)).toEqual([1.12345, 1.12345]);
            expect(baseCoder.toPrecision([1.123455, 1.123455], 5)).toEqual([1.12346, 1.12346]);
            expect(baseCoder.toPrecision([1.123456, 1.123456], 5)).toEqual([1.12346, 1.12346]);
        });
    });
});
