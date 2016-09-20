describe('The stackedPanelsReducers factory', function () {
    var stackedPanelsReducers,
        DEFAULT_STATE,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_stackedPanelsReducers_, _DEFAULT_STATE_, _ACTIONS_) {
            stackedPanelsReducers = _stackedPanelsReducers_;
            DEFAULT_STATE = _DEFAULT_STATE_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('STACKED_PANELS_SHOW_FULLSCREEN_MAP', function () {
        it('adds an entry to stackedPanels', function () {
            var output = stackedPanelsReducers[ACTIONS.STACKED_PANELS_SHOW_FULLSCREEN_MAP](DEFAULT_STATE);

            expect(output.stackedPanels).toEqual(['fullscreen']);
        });
    });

    describe('STACKED_PANELS_HIDE_FULLSCREEN_MAP', function () {
        it('removes the last entry of stackedPanels', function () {
            var inputState,
                output;

            inputState = angular.copy(DEFAULT_STATE);
            inputState.stackedPanels = ['fullscreen'];

            output = stackedPanelsReducers[ACTIONS.STACKED_PANELS_HIDE_FULLSCREEN_MAP](inputState);

            expect(output.stackedPanels).toEqual([]);
        });
    });

    describe('STACKED_PANELS_SHOW_LAYER_SELECTION', function () {
        it('adds an entry to stackedPanels', function () {
            var output = stackedPanelsReducers[ACTIONS.STACKED_PANELS_SHOW_LAYER_SELECTION](DEFAULT_STATE);

            expect(output.stackedPanels).toEqual(['layer-selection']);
        });

        it('won\'t allow to add the same panel twice', function () {
            var output;

            //Add it once
            output = stackedPanelsReducers[ACTIONS.STACKED_PANELS_SHOW_LAYER_SELECTION](DEFAULT_STATE);
            expect(output.stackedPanels).toEqual(['layer-selection']);

            //Try adding it again
            output = stackedPanelsReducers[ACTIONS.STACKED_PANELS_SHOW_LAYER_SELECTION](output);
            expect(output.stackedPanels).toEqual(['layer-selection']);
        });
    });

    describe('STACKED_PANELS_HIDE_LAYER_SELECTION', function () {
        it('removes the last entry of stackedPanels', function () {
            var inputState,
                output;

            inputState = angular.copy(DEFAULT_STATE);
            inputState.stackedPanels = ['layer-selection'];

            output = stackedPanelsReducers[ACTIONS.STACKED_PANELS_HIDE_LAYER_SELECTION](inputState);

            expect(output.stackedPanels).toEqual([]);
        });
    });
});