describe('The printReducers factory', function () {
    var printReducers,
        ACTIONS,
        defaultState;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_printReducers_, _ACTIONS_, _DEFAULT_STATE_) {
            printReducers = _printReducers_;
            ACTIONS = _ACTIONS_;
            defaultState = _DEFAULT_STATE_;
        });
    });

    describe('SHOW_PRINT', function () {
        it('sets the isPrintMode variable to true', function () {
            var output = printReducers[ACTIONS.SHOW_PRINT.id](defaultState);

            expect(output.isPrintMode).toBe(true);
        });
    });

    describe('HIDE_PRINT', function () {
        it('sets the isPrintMode variable to false', function () {
            var inputState,
                output;

            inputState = angular.copy(defaultState);
            inputState.isPrintMode = true;

            output = printReducers[ACTIONS.HIDE_PRINT.id](inputState);

            expect(output.isPrintMode).toBe(false);
        });
    });
});
