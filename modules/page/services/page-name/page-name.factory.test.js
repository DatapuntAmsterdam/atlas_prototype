describe('The pageName factory', () => {
    var pageName;

    beforeEach(() => {
        angular.mock.module('dpPage', ($provide) => {
            $provide.constant('PAGE_NAMES', {
                pageA: 'Pagina A',
                'page-b': 'Pagina B'
            });
        });

        angular.mock.inject(_pageName_ => {
            pageName = _pageName_;
        });
    });

    it('returns the name of the page', () => {
        expect(pageName('pageA')).toBe('Pagina A');
        expect(pageName('page-b')).toBe('Pagina B');
        expect(pageName('page-c')).toBeUndefined();
    });
});
