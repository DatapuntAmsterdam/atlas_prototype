describe('The layerSelectionReducers factory', () => {
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

    beforeEach(() => {
        angular.mock.module('atlas');

        angular.mock.inject((_layerSelectionReducers_, _ACTIONS_) => {
            layerSelectionReducers = _layerSelectionReducers_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('SHOW_LAYER_SELECTION', () => {
        it('sets the variable to true', () => {
            var output = layerSelectionReducers[ACTIONS.SHOW_LAYER_SELECTION.id](DEFAULT_STATE);

            expect(output.layerSelection.isEnabled).toBe(true);
        });

        it('leaves the fullscreen mode as is', () => {
            var output,
                inputState = angular.copy(DEFAULT_STATE);

            inputState.map.isFullscreen = true;
            output = layerSelectionReducers[ACTIONS.SHOW_LAYER_SELECTION.id](inputState);

            expect(output.map.isFullscreen).toBe(true);
        });
    });

    describe('HIDE_LAYER_SELECTION', () => {
        it('sets the variable to true', () => {
            var inputState,
                output;

            inputState = angular.copy(DEFAULT_STATE);
            inputState.layerSelection.isEnabled = true;

            output = layerSelectionReducers[ACTIONS.HIDE_LAYER_SELECTION.id](inputState);

            expect(output.layerSelection.isEnabled).toBe(false);
        });
    });
});
