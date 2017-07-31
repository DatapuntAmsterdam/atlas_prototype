describe('The store factory', () => {
    var applicationState;

    beforeEach(() => {
        angular.mock.module('dpShared');

        angular.mock.inject(_applicationState_ => {
            applicationState = _applicationState_;
        });
    });

    it('returns the store', () => {
        spyOn(applicationState, 'getStore').and.returnValue('I_AM_THE_STORE');

        angular.mock.inject(store => {
            expect(store).toBe('I_AM_THE_STORE');
        });
    });
});
