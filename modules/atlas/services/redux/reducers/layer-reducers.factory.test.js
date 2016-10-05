describe('The layerReducers factory', function () {
    var layerReducers,
        DEFAULT_STATE,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_layerReducers_, _DEFAULT_STATE_, _ACTIONS_) {
            layerReducers = _layerReducers_;
            DEFAULT_STATE = _DEFAULT_STATE_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('SHOW_LAYER_SELECTION', function () {
        it('sets the variable to true', function () {
            var output = layerReducers[ACTIONS.SHOW_LAYER_SELECTION](DEFAULT_STATE);

            expect(output.map.showLayerSelection).toBe(true);
        });

        it('leaves the fullscreen mode as is', function () {
            var output,
                inputState = angular.copy(DEFAULT_STATE);

            inputState.map.isFullscreen = true;
            output = layerReducers[ACTIONS.SHOW_LAYER_SELECTION](inputState);

            expect(output.map.isFullscreen).toBe(true);
        });
    });

    describe('HIDE_LAYER_SELECTION', function () {
        it('sets the variable to true', function () {
            var inputState,
                output;

            inputState = angular.copy(DEFAULT_STATE);
            inputState.showLayerSelection = true;

            output = layerReducers[ACTIONS.HIDE_LAYER_SELECTION](inputState);

            expect(output.map.showLayerSelection).toBe(false);
        });
    });

    describe('SHOW_ACTIVE_OVERLAYS', function () {
        it('sets the variable to true', function () {
            var output;

            output = layerReducers[ACTIONS.SHOW_ACTIVE_OVERLAYS](DEFAULT_STATE);
            expect(output.map.showActiveOverlays).toBe(true);
        });
    });

    describe('HIDE_ACTIVE_OVERLAYS', function () {
        it('sets the variable to false', function () {
            var output,
                inputState = angular.copy(DEFAULT_STATE);

            inputState.map.showActiveOverlays = true;
            output = layerReducers[ACTIONS.HIDE_ACTIVE_OVERLAYS](DEFAULT_STATE);
            expect(output.map.showActiveOverlays).toBe(false);
        });
    });
});
