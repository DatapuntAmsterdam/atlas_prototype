describe('The store factory', function () {
    var applicationState;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_applicationState_) {
            applicationState = _applicationState_;
        });
    });

    it('returns the store', function () {
        spyOn(applicationState, 'getStore').and.returnValue('I_AM_THE_STORE');

        angular.mock.inject(function (store) {
            expect(store).toBe('I_AM_THE_STORE');
        });
    });
});
