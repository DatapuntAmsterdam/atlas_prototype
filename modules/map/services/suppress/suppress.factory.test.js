describe('The suppress factory', () => {
    let suppress,
        $interval;

    beforeEach(() => {
        angular.mock.module('dpMap');

        angular.mock.inject((_$interval_, _suppress_) => {
            $interval = _$interval_;
            suppress = _suppress_;
        });
    });

    it('busy should be false by default', () => {
        expect(suppress.isBusy()).toEqual(false);
    });

    it('after start suppressing it should be busy, after the timeout ends it should not be busy anymore', () => {
        suppress.start();
        expect(suppress.isBusy()).toEqual(true);

        $interval.flush(99);
        expect(suppress.isBusy()).toEqual(true);

        $interval.flush(1);
        expect(suppress.isBusy()).toEqual(false);
    });
});
