describe('The dpStraatbeeldDocumentTitle factory', () => {
    var documentTitle;

    beforeEach(() => {
        angular.mock.module(
            'dpStraatbeeld',
            $provide => {
                $provide.value('coordinatesFilter', location => location.join(', ') + ' (X, Y)');
            }
        );

        angular.mock.inject(dpStraatbeeldDocumentTitle => {
            documentTitle = dpStraatbeeldDocumentTitle;
        });
    });

    it('returns the text \'Panorama\' and the coordinates in both WGS84 and RD', () => {
        var mockedStraatbeeldState;

        mockedStraatbeeldState = {
            location: [52.123, 4.789]
        };
        expect(documentTitle.getTitle(mockedStraatbeeldState)).toBe('Panorama 52.123, 4.789 (X, Y)');

        mockedStraatbeeldState.location = [52.987, 4.321];
        expect(documentTitle.getTitle(mockedStraatbeeldState)).toBe('Panorama 52.987, 4.321 (X, Y)');
    });

    it('returns the text \'Panorama\' when no coordinates are (yet) available', () => {
        const mockedStraatbeeldState = {};
        expect(documentTitle.getTitle(mockedStraatbeeldState)).toBe('Panorama');
    });
});
