describe('The geosearch factory', function () {
    var uriStripper;

    beforeEach(function () {
        angular.mock.module('dpSearchResults',
            function ($provide) {
                $provide.factory('sharedConfig', () => {
                    return {
                        API_ROOT: 'https://api.data.amsterdam.nl/'
                    };
                });
            }
        );

        angular.mock.inject(function (_uriStripper_) {
            uriStripper = _uriStripper_;
        });
    });

    it('strips the api root from the uri', () => {
        expect(uriStripper.stripUri(
            'https://api.data.amsterdam.nl/foo'
            )).toBe('foo');
        expect(uriStripper.stripUri(
            'https://api.data.amsterdam.nl/meetbouten/meetbout/1234/'
            )).toBe('meetbouten/meetbout/1234/');
        expect(uriStripper.stripUri(
            'https://api.data.amsterdam.nl/panorama/thumbnail/TMX1234-000030_pano_0001_000010/?width=140&heading=26'
            )).toBe('panorama/thumbnail/TMX1234-000030_pano_0001_000010/?width=140&heading=26');
    });
});
