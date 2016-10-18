describe('The dpSearchResultsDocumentTitle factory', function () {
    const searchTitle = { getTitleData: angular.noop };
    let documentTitle;

    beforeEach(() => {
        angular.mock.module('dpSearchResults', $provide => {
            $provide.value('searchTitle', searchTitle);
        });

        angular.mock.inject(dpSearchResultsDocumentTitle => {
            documentTitle = dpSearchResultsDocumentTitle;
        });
        spyOn(searchTitle, 'getTitleData');
    });

    it('does not return only a sub title', () => {
        searchTitle.getTitleData.and.returnValue({
            title: '',
            subTitle: 'subTitle'
        });
        expect(documentTitle.getTitle({})).toBe('');

        searchTitle.getTitleData.and.returnValue({
            title: null,
            subTitle: 'subTitle'
        });
        expect(documentTitle.getTitle({})).toBe('');
    });

    it('returns the title', () => {
        searchTitle.getTitleData.and.returnValue({
            title: 'title',
            subTitle: ''
        });
        expect(documentTitle.getTitle({})).toBe('title');

        searchTitle.getTitleData.and.returnValue({
            title: 'title',
            subTitle: null
        });
        expect(documentTitle.getTitle({})).toBe('title');
    });

    it('returns both the title and the sub title with an n-dash in between', () => {
        searchTitle.getTitleData.and.returnValue({
            title: 'title',
            subTitle: 'sub title'
        });
        expect(documentTitle.getTitle({})).toBe('title – sub title');
    });
});
