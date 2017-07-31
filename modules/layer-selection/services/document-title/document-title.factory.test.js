describe('The dpLayerSelectionDocumentTitle factory', () => {
    var documentTitle;

    beforeEach(() => {
        angular.mock.module('dpLayerSelection');

        angular.mock.inject(dpLayerSelectionDocumentTitle => {
            documentTitle = dpLayerSelectionDocumentTitle;
        });
    });

    it('returns a static text', () => {
        expect(documentTitle.getTitle({someNumber: 4, ignoredParameter: false})).toBe('Selecteer kaartlagen');
    });
});
