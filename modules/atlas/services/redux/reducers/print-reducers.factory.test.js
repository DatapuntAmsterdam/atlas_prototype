describe('The printReducers factory', () => {
    var printReducers,
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
            isPrintMode: false
        }
    };

    beforeEach(() => {
        angular.mock.module('atlas');

        angular.mock.inject((_printReducers_, _ACTIONS_) => {
            printReducers = _printReducers_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('SHOW_PRINT', () => {
        it('sets the isPrintMode variable to true', () => {
            var output = printReducers[ACTIONS.SHOW_PRINT.id](defaultState);

            expect(output.atlas.isPrintMode).toBe(true);
        });
    });

    describe('HIDE_PRINT', () => {
        it('sets the isPrintMode variable to false', () => {
            var inputState,
                output;

            inputState = angular.copy(defaultState);
            inputState.atlas.isPrintMode = true;

            output = printReducers[ACTIONS.HIDE_PRINT.id](inputState);

            expect(output.atlas.isPrintMode).toBe(false);
        });
    });
});
