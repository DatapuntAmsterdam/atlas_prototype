(function () {
    //
    // ACTIONS are identified by their id
    // Optionally an action can specify:
    // - ignore: true
    //   The action will not change the url
    // - replace: true
    //   The action will replace the url (not adding a new entry in the browser history)
    // - isButton: true
    //   The action will be triggered by a button instead of a link
    //
    angular
        .module('dpShared')
        .constant('ACTIONS', {
            URL_CHANGE: {
                id: 'URL_CHANGE',
                ignore: true
            },

            FETCH_SEARCH_RESULTS_BY_QUERY: {
                id: 'FETCH_SEARCH_RESULTS_BY_QUERY',
                ignore: true
            },
            FETCH_SEARCH_RESULTS_BY_LOCATION: {
                id: 'FETCH_SEARCH_RESULTS_BY_LOCATION',
                ignore: true
            },
            FETCH_SEARCH_RESULTS_CATEGORY: {
                id: 'FETCH_SEARCH_RESULTS_CATEGORY',
                ignore: true
            },
            SHOW_SEARCH_RESULTS: {
                id: 'SHOW_SEARCH_RESULTS'
            },

            MAP_SET_BASELAYER: {
                id: 'MAP_SET_BASELAYER',
                replace: true
            },
            MAP_ADD_OVERLAY: {
                id: 'MAP_ADD_OVERLAY',
                replace: true
            },
            MAP_REMOVE_OVERLAY: {
                id: 'MAP_REMOVE_OVERLAY',
                replace: true
            },
            MAP_TOGGLE_VISIBILITY_OVERLAY: {
                id: 'MAP_TOGGLE_VISIBILITY_OVERLAY',
                replace: true,
                isButton: true
            },
            MAP_CLICK: {
                id: 'MAP_CLICK',
                ignore: true
            },
            MAP_PAN: {
                id: 'MAP_PAN',
                replace: true
            },
            MAP_ZOOM: {
                id: 'MAP_ZOOM',
                replace: true
            },
            MAP_FULLSCREEN: {
                id: 'MAP_FULLSCREEN',
                isButton: true
            },
            MAP_SET_POINTS: {
                id: 'MAP_SET_POINTS',
                ignore: true
            },
            MAP_SET_DRAWING_MODE: {
                id: 'MAP_SET_DRAWING_MODE',
                ignore: true,
                isButton: true
            },
            SHOW_MAP_ACTIVE_OVERLAYS: {
                id: 'SHOW_MAP_ACTIVE_OVERLAYS',
                replace: true,
                isButton: true

            },
            HIDE_MAP_ACTIVE_OVERLAYS: {
                id: 'HIDE_MAP_ACTIVE_OVERLAYS',
                replace: true,
                isButton: true
            },

            FETCH_DETAIL: {
                id: 'FETCH_DETAIL',
                ignore: true,
                isButton: false
            },
            SHOW_DETAIL: {
                id: 'SHOW_DETAIL'
            },

            FETCH_STRAATBEELD: {
                id: 'FETCH_STRAATBEELD',
                ignore: true
            },
            FETCH_STRAATBEELD_BY_LOCATION: {
                id: 'FETCH_STRAATBEELD_BY_LOCATION',
                ignore: true
            },
            SHOW_STRAATBEELD_INITIAL: {
                id: 'SHOW_STRAATBEELD_INITIAL'
            },
            SHOW_STRAATBEELD_SUBSEQUENT: {
                id: 'SHOW_STRAATBEELD_SUBSEQUENT',
                replace: true
            },
            STRAATBEELD_FULLSCREEN: {
                id: 'STRAATBEELD_FULLSCREEN',
                isButton: true
            },
            HIDE_STRAATBEELD: {
                id: 'HIDE_STRAATBEELD',
                ignore: true,
                isButton: true
            },
            SET_STRAATBEELD_ORIENTATION: {
                id: 'SET_STRAATBEELD_ORIENTATION',
                replace: true
            },

            FETCH_DATA_SELECTION: {
                id: 'FETCH_DATA_SELECTION',
                ignore: true
            },
            SHOW_DATA_SELECTION: {
                id: 'SHOW_DATA_SELECTION'
            },
            NAVIGATE_DATA_SELECTION: {
                id: 'NAVIGATE_DATA_SELECTION'
            },
            SET_DATA_SELECTION_VIEW: {
                id: 'SET_DATA_SELECTION_VIEW',
                isButton: true
            },

            SHOW_LAYER_SELECTION: {
                id: 'SHOW_LAYER_SELECTION',
                isButton: true
            },
            HIDE_LAYER_SELECTION: {
                id: 'HIDE_LAYER_SELECTION',
                isButton: true
            },

            SHOW_HOME: {
                id: 'SHOW_HOME'
            },
            SHOW_PAGE: {
                id: 'SHOW_PAGE'
            },

            SHOW_PRINT: {
                id: 'SHOW_PRINT'
            },
            HIDE_PRINT: {
                id: 'HIDE_PRINT',
                isButton: true
            }
        });
})();
