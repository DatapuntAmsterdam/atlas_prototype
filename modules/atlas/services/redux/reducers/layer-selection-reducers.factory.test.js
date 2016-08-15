describe('The detailReducers factory', function () {
    var layerSelectionReducers,
        defaultState;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_layerSelectionReducers_, _DEFAULT_STATE_) {
            layerSelectionReducers = _layerSelectionReducers_;
            defaultState = _DEFAULT_STATE_;
        });
    });

    describe('SHOW_LAYER_SELECTION', function () {
        it('sets the variable to true', function () {
            var output = layerSelectionReducers.SHOW_LAYER_SELECTION(defaultState);

            expect(output.map.showLayerSelection).toBe(true);
        });

        it('disables the fullscreen mode', function () {
            var output,
                inputState = angular.copy(defaultState);

            inputState.map.isFullscreen = true;
            output = layerSelectionReducers.SHOW_LAYER_SELECTION(defaultState);

            expect(output.map.isFullscreen).toBe(false);
        });
    });

    describe('HIDE_LAYER_SELECTION', function () {
        it('sets the variable to true', function () {
            var inputState,
                output;

            inputState = angular.copy(defaultState);
            inputState.showLayerSelection = true;

            output = layerSelectionReducers.HIDE_LAYER_SELECTION(inputState);

            expect(output.map.showLayerSelection).toBe(false);
        });
    });
});