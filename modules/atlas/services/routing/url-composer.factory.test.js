describe('The URL Composer factory', function () {
    let urlComposer;

    describe('Implements query string creation', function () {
        beforeEach(function () {
            angular.mock.module('atlas', function ($provide) {
                $provide.constant('URL_COMPRESSION', []);
            });

            angular.mock.inject(function (_urlComposer_) {
                urlComposer = _urlComposer_;
            });
        });

        it('can provide the query string for an object', function () {
            expect(urlComposer.getQueryString({})).toBe('#');
            expect(urlComposer.getQueryString({id: 'aap'})).toBe('#?id=aap');
            expect(urlComposer.getQueryString({id: 'aap', x: 15})).toBe('#?id=aap&x=15');
            expect(urlComposer.getQueryString({id: 'aap', x: 15, y: true})).toBe('#?id=aap&x=15&y=true');
        });

        it('provide the query string only for the first dimension of an object', function () {
            expect(urlComposer.getQueryString({})).toBe('#');
            expect(urlComposer.getQueryString({x: {id: 'aap'}})).toBe('#?x=[object Object]');
        });
    });

    describe('Implements base 62 compression', function () {
        beforeEach(function () {
            angular.mock.module('atlas', function ($provide) {
                $provide.constant('URL_COMPRESSION', ['62']);
            });

            angular.mock.inject(function (_urlComposer_) {
                urlComposer = _urlComposer_;
            });
        });

        it('encodes lat and lon with 7 decimals', function () {
            expect(urlComposer
                .compressParams({
                    lat: '52.12345678',
                    lon: '4.123456789'
                }))
                .toEqual({
                    lat: 'ZH2vA',
                    lon: '2n0zg',
                    V: '62'
                });
        });

        it('decodes lat and lon with 7 decimals', function () {
            expect(urlComposer
                .decompressParams({
                    lat: 'ZH2vA',
                    lon: '2n0zg',
                    V: '62'
                }))
                .toEqual({
                    lat: 52.1234568,
                    lon: 4.1234568
                });
        });

        it('encodes straatbeeld', function () {
            expect(urlComposer
                .compressParams({
                    straatbeeld: '52.12345678,4.123456789'
                }))
                .toEqual({
                    straatbeeld: 'ZH2vA,2n0zg',
                    V: '62'
                });
        });

        it('decodes straatbeeld', function () {
            expect(urlComposer
                .decompressParams({
                    straatbeeld: 'ZH2vA,2n0zg',
                    V: '62'
                }))
                .toEqual({
                    straatbeeld: '52.1234568,4.1234568'
                });
        });
    });

    describe('Implements abbreviations', function () {
        beforeEach(function () {
            angular.mock.module('atlas', function ($provide) {
                $provide.constant('URL_COMPRESSION', ['AB']);
                $provide.constant('ABBREVIATIONS', {
                    a: 'aap'
                });
            });

            angular.mock.inject(function (_urlComposer_) {
                urlComposer = _urlComposer_;
            });
        });

        it('abbreviates string values', function () {
            expect(urlComposer
                .compressParams({
                    x: 'This is an aap'
                }))
                .toEqual({
                    x: 'This is an _A_',
                    V: 'AB'
                });
        });

        it('deabbreviates string values', function () {
            expect(urlComposer
                .decompressParams({
                    x: 'This is an _A_',
                    V: 'AB'
                }))
                .toEqual({
                    x: 'This is an aap'
                });
        });
    });

    describe('Implements compression', function () {
        beforeEach(function () {
            angular.mock.module('atlas', function ($provide) {
                $provide.constant('URL_COMPRESSION', ['LZ']);
            });

            angular.mock.inject(function (_urlComposer_) {
                urlComposer = _urlComposer_;
            });
        });

        it('abbreviates string values, deletes null values', function () {
            expect(urlComposer
                .compressParams({
                    y: 'aap',
                    z: null
                }))
                .toEqual({
                    C: 'N4IgniBcIIYwDiAvkA',
                    V: 'LZ'
                });
        });

        it('deabbreviates string values', function () {
            expect(urlComposer
                .decompressParams({
                    C: 'N4IgniBcIIYwDiAvkA',
                    V: 'LZ'
                }))
                .toEqual({
                    y: 'aap'
                });
        });
    });

    describe('Implements combinations of compressions', function () {
        beforeEach(function () {
            angular.mock.module('atlas', function ($provide) {
                $provide.constant('URL_COMPRESSION', ['AB', '62', 'LZ']);
                $provide.constant('ABBREVIATIONS', {
                    a: 'aap'
                });
            });

            angular.mock.inject(function (_urlComposer_) {
                urlComposer = _urlComposer_;
            });
        });

        it('abbreviates string values', function () {
            expect(urlComposer
                .compressParams({
                    lat: '52.123456789012',
                    y: 'aap noot'
                }))
                .toEqual({
                    C: 'N4IgNghgLiBcIC0ASAmAbgQRAGhATzhAH0MiACAOwHsqYBfIA',
                    V: 'AB,62,LZ'
                });
        });

        it('deabbreviates string values', function () {
            expect(urlComposer
                .decompressParams({
                    C: 'N4IgNghgLiBcIC0ASAmAbgQRAGhATzhAH0MiACAOwHsqYBfIA',
                    V: 'AB,62,LZ'
                }))
                .toEqual({
                    lat: 52.1234568,
                    y: 'aap noot'
                });
        });
    });

    describe('Does not compress when no URL_COMPRESSSION', function () {
        beforeEach(function () {
            angular.mock.module('atlas', function ($provide) {
                $provide.constant('URL_COMPRESSION', []);
                $provide.constant('ABBREVIATIONS', {
                    a: 'aap'
                });
            });

            angular.mock.inject(function (_urlComposer_) {
                urlComposer = _urlComposer_;
            });
        });

        it('compresses identity', function () {
            expect(urlComposer
                .compressParams({
                    lat: '52.123456789012',
                    y: 'aap noot'
                }))
                .toEqual({
                    lat: '52.123456789012',
                    y: 'aap noot'
                });
        });

        it('decompresses identity', function () {
            expect(urlComposer
                .decompressParams({
                    lat: '52.123456789012',
                    y: 'aap noot'
                }))
                .toEqual({
                    lat: '52.123456789012',
                    y: 'aap noot'
                });
        });
    });

    describe('Does not compress on unknown URL_COMPRESSSION', function () {
        beforeEach(function () {
            angular.mock.module('atlas', function ($provide) {
                $provide.constant('URL_COMPRESSION', ['AX']);
                $provide.constant('ABBREVIATIONS', {
                    a: 'aap'
                });
            });

            angular.mock.inject(function (_urlComposer_) {
                urlComposer = _urlComposer_;
            });
        });

        it('compresses identity', function () {
            expect(urlComposer
                .compressParams({
                    lat: '52.123456789012',
                    y: 'aap noot'
                }))
                .toEqual({
                    lat: '52.123456789012',
                    y: 'aap noot'
                });
        });

        it('decompresses identity', function () {
            expect(urlComposer
                .decompressParams({
                    lat: '52.123456789012',
                    y: 'aap noot',
                    V: 'AX'
                }))
                .toEqual({
                    lat: '52.123456789012',
                    y: 'aap noot'
                });
        });
    });
});
