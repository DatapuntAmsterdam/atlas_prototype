describe('The layerSelectionReducers factory', function () {
    var layerSelectionReducers,
        DEFAULT_STATE,
        ACTIONS;

    DEFAULT_STATE = {
        map: {
            baseLayer: 'topografie',
            overlays: [],
            viewCenter: [52.3719, 4.9012],
            zoom: 9,
            showActiveOverlays: false,
            isFullscreen: false,
            isLoading: false
        },
        layerSelection: {
            isEnabled: false
        },
        search: null,
        page: {
            name: 'home'
        },
        detail: null,
        straatbeeld: null,
        dataSelection: null,
        atlas: {
            isPrintMode: false
        }
    };

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_layerSelectionReducers_, _ACTIONS_) {
            layerSelectionReducers = _layerSelectionReducers_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('SHOW_LAYER_SELECTION', function () {
        it('sets the variable to true', function () {
            var output = layerSelectionReducers[ACTIONS.SHOW_LAYER_SELECTION.id](DEFAULT_STATE);

            expect(output.layerSelection.isEnabled).toBe(true);
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
            inputState.layerSelection.isEnabled = true;

            output = layerSelectionReducers[ACTIONS.HIDE_LAYER_SELECTION.id](inputState);

            expect(output.layerSelection.isEnabled).toBe(false);
        });
    });
});
