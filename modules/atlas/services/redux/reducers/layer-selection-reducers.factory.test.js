describe('The layerSelectionReducers factory', function () {
    var layerSelectionReducers,
        DEFAULT_STATE,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_layerSelectionReducers_, _DEFAULT_STATE_, _ACTIONS_) {
            layerSelectionReducers = _layerSelectionReducers_;
            DEFAULT_STATE = _DEFAULT_STATE_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('SHOW_LAYER_SELECTION', function () {
        it('sets the variable to true', function () {
            var output = layerSelectionReducers[ACTIONS.SHOW_LAYER_SELECTION.id](DEFAULT_STATE);

            expect(output.layerSelection).toBe(true);
        });

        it('leaves the fullscreen mode as is', function () {
            var output,
                inputState = angular.copy(DEFAULT_STATE);

            inputState.map.isFullscreen = true;
            output = layerSelectionReducers[ACTIONS.SHOW_LAYER_SELECTION.id](inputState);

            expect(output.map.isFullscreen).toBe(true);
        });
    });

    describe('HIDE_LAYER_SELECTION', function () {
        it('sets the variable to true', function () {
            var inputState,
                output;

            inputState = angular.copy(DEFAULT_STATE);
            inputState.layerSelection = true;

            output = layerSelectionReducers[ACTIONS.HIDE_LAYER_SELECTION.id](inputState);

            expect(output.layerSelection).toBe(false);
        });
    });
});
