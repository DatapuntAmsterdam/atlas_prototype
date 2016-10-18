describe('The longNameShortener filter', function () {
    var longNameShortener;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            function ($provide) {
                $provide.constant('LONG_NAME_CONFIG', [
                    {
                        input: [
                            'Vereniging van Eigenaren',
                            'Vereniging van Ijgenaren'
                        ],
                        output: 'VvE'
                    }, {
                        input: [
                            'Pieter Cornelisz Hooftstraat'
                        ],
                        output: 'PCH straat'
                    }
                ]);
            }
        );

        angular.mock.inject(function (_longNameShortenerFilter_) {
            longNameShortener = _longNameShortenerFilter_;
        });
    });

    it('replaces long names with abbreviations', function () {
        expect(longNameShortener('Vereniging van Eigenaren blok 35')).toBe('VvE blok 35');
        expect(longNameShortener('Vereniging van Ijgenaren blok 35')).toBe('VvE blok 35');

        expect(longNameShortener('Pieter Cornelisz Hooftstraat 2b')).toBe('PCH straat 2b');
    });
});
