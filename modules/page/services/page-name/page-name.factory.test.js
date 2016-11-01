describe('The pageName factory', function () {
    var pageName;

    beforeEach(function () {
        angular.mock.module('dpPage', ($provide) => {
            $provide.constant('PAGE_NAMES', {
                pageA: 'Pagina A',
                'page-b': 'Pagina B'
            });
        });

        angular.mock.inject(function (_pageName_) {
            pageName = _pageName_;
        });
    });

    it('returns the name of the page', function () {
        expect(pageName('pageA')).toBe('Pagina A');
        expect(pageName('page-b')).toBe('Pagina B');
        expect(pageName('page-c')).toBeUndefined();
    });
});
