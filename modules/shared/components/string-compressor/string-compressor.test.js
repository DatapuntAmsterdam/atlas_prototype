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

    it('compresses and decompresses strings', function () {
        let compressed = compress('');
        expect(decompress(compressed)).toBe('');

        compressed = compress('a String');
        expect(decompress(compressed)).toBe('a String');

        compressed = compress('a String'.repeat(50));
        expect(decompress(compressed)).toBe('a String'.repeat(50));
    });

    it('compresses and decompresses objects', function () {
        let compressed = compressFromObject({});
        expect(decompressToObject(compressed)).toEqual({});

        compressed = compressFromObject({id: 'a String'});
        expect(decompressToObject(compressed)).toEqual({id: 'a String'});

        compressed = compressFromObject({id: 'a String'.repeat(50), x: 50});
        expect(decompressToObject(compressed)).toEqual({id: 'a String'.repeat(50), x: 50});
    });

    it('object compression and decompression returns an empty string when called with no object', function () {
        [5, true, 'string'].forEach(e => {
            let compressed = compressFromObject(e);
            expect(compress('')).toEqual(compressed);
            expect(decompressToObject(compressed)).toEqual({});
        });
    });

    it('compresses and decompresses only strings', function () {
        let compressed = compress(525);
        expect(decompress(compressed)).toBe('');

        compressed = compress(true);
        expect(decompress(compressed)).toBe('');

        compressed = compress(null);
        expect(decompress(compressed)).toBe(null);

        compressed = compress();
        expect(decompress(compressed)).toBe(null);
    });
});
