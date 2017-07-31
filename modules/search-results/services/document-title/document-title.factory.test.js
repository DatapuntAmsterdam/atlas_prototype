describe('The dpSearchResultsDocumentTitle factory', () => {
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

    describe('For searches on text', () => {
        it('returns "Resultaten met \'<searchText>\'" as a title', () => {
            expect(documentTitle.getTitle({query: 'a query', numberOfResults: 10}))
                .toBe('Data met \'a query\'');
        });

        it('returns "Geen resultaten met \'<searchText>\'" if no results as a title', () => {
            expect(documentTitle.getTitle({query: 'a query', numberOfResults: 0}))
                .toBe('Data met \'a query\'');
        });
    });

    describe('For searches on a location', () => {
        let searchOnLocation;

        beforeEach(() => {
            searchOnLocation = {
                location: [52, 4]
            };
        });

        it('does not return only a sub title', () => {
            searchTitle.getTitleData.and.returnValue({
                title: '',
                subTitle: 'subTitle'
            });
            expect(documentTitle.getTitle(searchOnLocation)).toBe('');

            searchTitle.getTitleData.and.returnValue({
                title: null,
                subTitle: 'subTitle'
            });
            expect(documentTitle.getTitle(searchOnLocation)).toBe('');
        });

        it('returns the title', () => {
            searchTitle.getTitleData.and.returnValue({
                title: 'title',
                subTitle: ''
            });
            expect(documentTitle.getTitle(searchOnLocation)).toBe('title');

            searchTitle.getTitleData.and.returnValue({
                title: 'title',
                subTitle: null
            });
            expect(documentTitle.getTitle(searchOnLocation)).toBe('title');
        });

        it('returns both the title and the sub title with a space in between', () => {
            searchTitle.getTitleData.and.returnValue({
                title: 'title',
                subTitle: 'sub title'
            });
            expect(documentTitle.getTitle(searchOnLocation)).toBe('title sub title');
        });
    });

    it('returns an empty title when no searchState is known', () => {
        expect(documentTitle.getTitle()).toBe('');
    });
});
