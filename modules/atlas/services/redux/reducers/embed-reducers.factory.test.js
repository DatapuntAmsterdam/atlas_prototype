describe('The embedReducers factory', () => {
    var embedReducers,
        ACTIONS,
        defaultState;

    defaultState = {
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
            isPrintMode: false,
            isEmbedPreview: false
        }
    };

    beforeEach(() => {
        angular.mock.module('atlas');

        angular.mock.inject((_embedReducers_, _ACTIONS_) => {
            embedReducers = _embedReducers_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('SHOW_EMBED_PREVIEW', () => {
        it('sets the isEmbedPreview variable to true', () => {
            var output = embedReducers[ACTIONS.SHOW_EMBED_PREVIEW.id](defaultState);

            expect(output.atlas.isEmbedPreview).toBe(true);
        });
    });

    describe('HIDE_EMBED_PREVIEW', () => {
        it('sets the isEmbedPreview variable to false', () => {
            var inputState,
                output;

            inputState = angular.copy(defaultState);
            inputState.atlas.isEmbedMode = true;

            output = embedReducers[ACTIONS.HIDE_EMBED_PREVIEW.id](inputState);

            expect(output.atlas.isEmbedPreview).toBe(false);
        });
    });
});
