describe('The dpPageName filter', function () {
    var dpPageNameFilter,
        mocks = {
            pageName: angular.noop
        };

    beforeEach(function () {
        spyOn(mocks, 'pageName');

        angular.mock.module('dpPage', mocks);

        angular.mock.inject(function (_dpPageNameFilter_) {
            dpPageNameFilter = _dpPageNameFilter_;
        });
    });

    it('uses the pageName service', function () {
        dpPageNameFilter('pageA');
        dpPageNameFilter('page-b');

        expect(mocks.pageName).toHaveBeenCalledWith('pageA');
        expect(mocks.pageName).toHaveBeenCalledWith('page-b');
    });
});
