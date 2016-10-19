describe('The dpStraatbeeldDocumentTitle factory', function () {
    var documentTitle;

    beforeEach(function () {
        angular.mock.module(
            'dpStraatbeeld',
            function ($provide) {
                $provide.value('coordinatesFilter', function (location) {
                    return location.join(', ') + ' (X, Y)';
                });
            }
        );

        angular.mock.inject(function (dpStraatbeeldDocumentTitle) {
            documentTitle = dpStraatbeeldDocumentTitle;
        });
    });

    it('returns the text \'Panorama\' and the coordinates in both WGS84 and RD', function () {
        var mockedStraatbeeldState;

        mockedStraatbeeldState = {
            location: [52.123, 4.789]
        };
        expect(documentTitle.getTitle(mockedStraatbeeldState)).toBe('Panorama 52.123, 4.789 (X, Y)');

        mockedStraatbeeldState.location = [52.987, 4.321];
        expect(documentTitle.getTitle(mockedStraatbeeldState)).toBe('Panorama 52.987, 4.321 (X, Y)');
    });
});
