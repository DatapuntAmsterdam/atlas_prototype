describe('The dpStringCompress filter', function () {
    let compress,
        decompress;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {}
        );

        angular.mock.inject(function (_dpStringCompressFilter_, _dpStringDecompressFilter_) {
            compress = _dpStringCompressFilter_;
            decompress = _dpStringDecompressFilter_;
        });
    });

    it('compresses and decompresses a string', function () {
        let compressed = compress('');
        expect(decompress(compressed)).toBe('');

        compressed = compress('a String');
        expect(decompress(compressed)).toBe('a String');

        compressed = compress('a String'.repeat(50));
        expect(decompress(compressed)).toBe('a String'.repeat(50));
        compressed = compress();
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
