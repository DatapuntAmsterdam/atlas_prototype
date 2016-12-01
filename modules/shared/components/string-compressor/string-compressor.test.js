describe('The dpStringCompressor', function () {
    let compress,
        compressFromObject,
        decompress,
        decompressToObject;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {}
        );

        angular.mock.inject(function (_dpStringCompressor_) {
            let compressor = _dpStringCompressor_;
            compress = compressor.compress;
            decompress = compressor.decompress;
            compressFromObject = compressor.compressFromObject;
            decompressToObject = compressor.decompressToObject;
        });
    });

    function testCompress (value, result = value) {
        let compressed = compress(value);
        expect(decompress(compressed)).toBe(result);
    }

    function testCompressObject (value, result = value) {
        let compressed = compressFromObject(value);
        expect(decompressToObject(compressed)).toEqual(result);
    }

    it('compresses and decompresses strings', function () {
        ['', 'a String', 'a String'.repeat(50)].forEach(s => testCompress(s));
    });

    it('compresses and decompresses objects', function () {
        [{}, {id: 'a String'}, {id: 'a String'.repeat(50), x: 50}].forEach(o => testCompressObject(o));
    });

    it('object compression and decompression returns an empty string when called with no object', function () {
        [5, true, 'string'].forEach(e => {
            let compressed = compressFromObject(e);
            expect(compress('')).toEqual(compressed);
            expect(decompressToObject(compressed)).toEqual({});
        });
    });

    it('compresses and decompresses only strings', function () {
        [525, true].forEach(e => testCompress(e, ''));
        [null, undefined].forEach(e => testCompress(e, null));
    });
});
