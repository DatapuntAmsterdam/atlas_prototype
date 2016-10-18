describe('The dpPageDocumentTitle factory', function () {
    var documentTitle;

    beforeEach(function () {
        angular.mock.module('dpPage');

        angular.mock.inject(function (dpPageDocumentTitle) {
            documentTitle = dpPageDocumentTitle;
        });
    });

    it('replaces dashes and makes the first letter of each word uppercase', function () {
        expect(documentTitle.getTitle('naamloos')).toBe('Naamloos');
        expect(documentTitle.getTitle('snel-wegwijs')).toBe('Snel Wegwijs');
        expect(documentTitle.getTitle('versie-historie')).toBe('Versie Historie');
    });

    it('returns null when the active page is \'home\'', function () {
        expect(documentTitle.getTitle('home')).toBeNull();
    });
});
