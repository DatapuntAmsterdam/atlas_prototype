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

    it('doesn\'t call stateToUrl.update for URL_CHANGE, FETCH_DETAIL, FETCH_STRAATBEELD, SHOW_LAYER_SELECTION and ' +
        'HIDE_LAYER_SELECTION', function () {

        var actionWithoutUrlUpdate = [
            ACTIONS.URL_CHANGE,
            ACTIONS.FETCH_DETAIL,
            ACTIONS.FETCH_STRAATBEELD
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
            ACTIONS.SHOW_SEARCH_RESULTS_BY_QUERY,
            ACTIONS.SHOW_SEARCH_RESULTS_BY_CLICK,
            ACTIONS.SHOW_SEARCH_RESULTS_CATEGORY,
            ACTIONS.SHOW_DETAIL,
            ACTIONS.SHOW_STRAATBEELD_INITIAL,
            ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
            ACTIONS.SHOW_LAYER_SELECTION,
            ACTIONS.HIDE_LAYER_SELECTION,
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
                ACTIONS.MAP_SET_BASELAYER,
                ACTIONS.MAP_ADD_OVERLAY,
                ACTIONS.MAP_REMOVE_OVERLAY,
                ACTIONS.MAP_PAN,
                ACTIONS.MAP_ZOOM,
                ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
                ACTIONS.STRAATBEELD_SET_ORIENTATION
            ],
            shouldNotUseReplace = [
                ACTIONS.SHOW_SEARCH_RESULTS_BY_QUERY,
                ACTIONS.SHOW_SEARCH_RESULTS_BY_CLICK,
                ACTIONS.SHOW_SEARCH_RESULTS_CATEGORY,
                ACTIONS.SHOW_DETAIL,
                ACTIONS.SHOW_STRAATBEELD_INITIAL,
                ACTIONS.SHOW_LAYER_SELECTION,
                ACTIONS.HIDE_LAYER_SELECTION,
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
});
