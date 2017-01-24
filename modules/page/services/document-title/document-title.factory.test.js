describe('The dpPageDocumentTitle factory', function () {
    var documentTitle,
        mocks = {
            pageName: angular.noop
        };

    beforeEach(function () {
        spyOn(mocks, 'pageName');

        angular.mock.module('dpPage', mocks);

        angular.mock.inject(function (dpPageDocumentTitle) {
            documentTitle = dpPageDocumentTitle;
        });
    });

    it('uses the pageName service', function () {
        documentTitle.getTitle({ name: 'pageA' });
        documentTitle.getTitle({ name: 'page-b' });

        expect(mocks.pageName).toHaveBeenCalledWith('pageA');
        expect(mocks.pageName).toHaveBeenCalledWith('page-b');
    });
});
