describe('The stateToUrlMiddleware factory', function () {
    var stateToUrlMiddleware,
        mockedStore = {
            getState: function () {
                return 'FAKE_STATE';
            }
        },
        mockedNext = function (action) {
            return action;
        },
        mockedAction = {
            type: 'FAKE_ACTION',
            payload: {}
        },
        stateToUrl,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_stateToUrlMiddleware_, _stateToUrl_, _ACTIONS_) {
            stateToUrlMiddleware = _stateToUrlMiddleware_;
            stateToUrl = _stateToUrl_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(stateToUrl, 'update');
    });

    it('calls the next action', function () {
        var returnValue;

        returnValue = stateToUrlMiddleware(mockedStore)(mockedNext)(mockedAction);

        expect(returnValue).toEqual({
            type: 'FAKE_ACTION',
            payload: {}
        });
    });

    it('and call the stateToUrl service', function () {
        stateToUrlMiddleware(mockedStore)(mockedNext)(mockedAction);

        expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', jasmine.anything());
    });

    it('doesn\'t call stateToUrl.update for these actions', function () {
        var actionWithoutUrlUpdate = [
            ACTIONS.URL_CHANGE,
            ACTIONS.FETCH_DETAIL,
            ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT,
            ACTIONS.SHOW_STRAATBEELD_INITIAL,
            ACTIONS.MAP_CLICK,
            ACTIONS.HIDE_STRAATBEELD,
            ACTIONS.FETCH_SEARCH_RESULTS_BY_LOCATION,
            ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY,
            ACTIONS.MAP_ADD_PANO_OVERLAY,
            ACTIONS.MAP_REMOVE_PANO_OVERLAY,
            ACTIONS.MAP_CLICK,
            ACTIONS.MAP_HIGHLIGHT,
            ACTIONS.MAP_START_DRAWING,
            ACTIONS.FETCH_DETAIL,
            ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT,
            ACTIONS.SHOW_STRAATBEELD_INITIAL,
            ACTIONS.HIDE_STRAATBEELD,
            ACTIONS.FETCH_DATA_SELECTION,
            ACTIONS.RESET_DATA_SELECTION,
            ACTIONS.APPLY_FILTERS,
            ACTIONS.EMPTY_FILTERS
        ];

        actionWithoutUrlUpdate.forEach(function (action) {
            stateToUrlMiddleware(mockedStore)(mockedNext)({
                type: action,
                payload: {}
            });

            expect(stateToUrl.update).not.toHaveBeenCalledWith('FAKE_STATE', jasmine.anything());
        });
    });

    it('does call stateToUrl.update for all other actions', function () {
        var actionsWithUrlUpdate = [
            ACTIONS.SHOW_SEARCH_RESULTS,
            ACTIONS.SHOW_MAP,
            ACTIONS.MAP_PAN,
            ACTIONS.MAP_ZOOM,
            ACTIONS.MAP_END_DRAWING,
            ACTIONS.SHOW_DETAIL,
            ACTIONS.DETAIL_FULLSCREEN,
            ACTIONS.FETCH_STRAATBEELD_BY_ID,
            ACTIONS.FETCH_STRAATBEELD_BY_LOCATION,
            ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
            ACTIONS.STRAATBEELD_FULLSCREEN,
            ACTIONS.SET_STRAATBEELD_ORIENTATION,
            ACTIONS.SET_STRAATBEELD_HISTORY,
            ACTIONS.SHOW_DATA_SELECTION,
            ACTIONS.NAVIGATE_DATA_SELECTION,
            ACTIONS.SET_DATA_SELECTION_VIEW,
            ACTIONS.SHOW_HOME,
            ACTIONS.SHOW_PAGE
        ];

        actionsWithUrlUpdate.forEach(function (action) {
            stateToUrlMiddleware(mockedStore)(mockedNext)({
                type: action,
                payload: {}
            });

            expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', jasmine.anything());
        });
    });

    it('replaces the URL for some actions', function () {
        var shouldUseReplace = [
                ACTIONS.MAP_PAN,
                ACTIONS.MAP_ZOOM,
                ACTIONS.DETAIL_FULLSCREEN,
                ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
                ACTIONS.SET_STRAATBEELD_ORIENTATION
            ],
            shouldNotUseReplace = [
                ACTIONS.SHOW_SEARCH_RESULTS,
                ACTIONS.SHOW_MAP,
                ACTIONS.MAP_END_DRAWING,
                ACTIONS.SHOW_DETAIL,
                ACTIONS.FETCH_STRAATBEELD_BY_ID,
                ACTIONS.FETCH_STRAATBEELD_BY_LOCATION,
                ACTIONS.STRAATBEELD_FULLSCREEN,
                ACTIONS.SET_STRAATBEELD_HISTORY,
                ACTIONS.SHOW_DATA_SELECTION,
                ACTIONS.NAVIGATE_DATA_SELECTION,
                ACTIONS.SET_DATA_SELECTION_VIEW,
                ACTIONS.SHOW_HOME,
                ACTIONS.SHOW_PAGE
            ];

        shouldUseReplace.forEach(function (action) {
            stateToUrlMiddleware(mockedStore)(mockedNext)({
                type: action,
                payload: {}
            });

            expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', true);
        });

        shouldNotUseReplace.forEach(function (action) {
            stateToUrlMiddleware(mockedStore)(mockedNext)({
                type: action,
                payload: {}
            });

            expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', false);
        });
    });

    it('vanilla reducers should trigger new url', function () {
        stateToUrlMiddleware(mockedStore)(mockedNext)({
            type: 'STRING_TYPE',
            payload: {}
        });

        expect(stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', false);
    });

    it('AUTHENTICATE_USER should not trigger new url', function () {
        stateToUrlMiddleware(mockedStore)(mockedNext)({
            type: 'AUTHENTICATE_USER',
            payload: {}
        });

        expect(stateToUrl.update).not.toHaveBeenCalledWith('FAKE_STATE', false);
    });
});
