describe('The dpMapDocumentTitle factory', function () {
    var documentTitle;

    beforeEach(function () {
        angular.mock.module('dpMap');

        angular.mock.inject(function (dpMapDocumentTitle) {
            documentTitle = dpMapDocumentTitle;
        });
    });

    it('returns a static text', function () {
        expect(documentTitle.getTitle({whatever: 7})).toBe('Grote kaart');
    });
});
