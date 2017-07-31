describe('The dpPageName filter', () => {
    var dpPageNameFilter,
        mocks = {
            pageName: angular.noop
        };

    beforeEach(() => {
        spyOn(mocks, 'pageName');

        angular.mock.module('dpPage', mocks);

        angular.mock.inject(_dpPageNameFilter_ => {
            dpPageNameFilter = _dpPageNameFilter_;
        });
    });

    it('uses the pageName service', () => {
        dpPageNameFilter('pageA');
        dpPageNameFilter('page-b');

        expect(mocks.pageName).toHaveBeenCalledWith('pageA');
        expect(mocks.pageName).toHaveBeenCalledWith('page-b');
    });
});
