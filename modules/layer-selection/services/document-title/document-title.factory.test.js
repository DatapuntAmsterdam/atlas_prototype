describe('The dpLayerSelectionDocumentTitle factory', function () {
    var documentTitle;

    beforeEach(function () {
        angular.mock.module('dpLayerSelection');

        angular.mock.inject(function (dpLayerSelectionDocumentTitle) {
            documentTitle = dpLayerSelectionDocumentTitle;
        });
    });

    it('returns a static text', function () {
        expect(documentTitle.getTitle({someNumber: 4, ignoredParameter: false})).toBe('Selecteer kaartlagen');
    });
});
