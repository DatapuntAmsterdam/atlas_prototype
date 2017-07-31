describe('The dpMapDocumentTitle factory', () => {
    var documentTitle;

    beforeEach(() => {
        angular.mock.module('dpMap');

        angular.mock.inject(dpMapDocumentTitle => {
            documentTitle = dpMapDocumentTitle;
        });
    });

    it('returns a static text', () => {
        expect(documentTitle.getTitle({whatever: 7})).toBe('Grote kaart');
    });
});
