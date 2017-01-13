(function () {
    angular
        .module('atlas')
        .constant('STATE_URL_CONVERSION', {
            pre: {
                // Optional initialisation methods for the url2state conversion
                // These methods are executed after a state object has been initialized with the initialValues
                MAIN_STATE: (oldState, newState, params, initialValues) => {
                    if (angular.equals(params, {})) {
                        // When no params, go to home page and show initial map
                        newState.page = 'home';
                        newState.map = angular.copy(initialValues.map);
                    }
                    return newState;
                },
                search: (oldState, newState) => angular.isObject(oldState) ? angular.copy(oldState) : newState
            },
            post: {
                // Post processing methods
                // These methods are exectuted when the url2state conversion has finished
                dataSelection: (oldState, newState) => {
                    if (angular.isObject(oldState)) {
                        newState.markers = oldState.markers;
                        newState.isLoading = oldState.isLoading;
                    }
                    newState.isFullscreen = newState.view !== 'LIST';
                },
                detail: (oldState, newState) => {
                    if (angular.isObject(oldState) && oldState.endpoint === newState.endpoint) {
                        newState.display = oldState.display;
                        newState.geometry = oldState.geometry;
                        newState.isLoading = oldState.isLoading;
                        newState.isFullscreen = oldState.isFullscreen;
                    }
                },
                straatbeeld: (oldState, newState) => {
                    if (angular.isObject(oldState) && oldState.id === newState.id) {
                        newState.image = oldState.image;
                        newState.hotspots = oldState.hotspots;
                        newState.date = oldState.date;
                        newState.location = oldState.location;
                        newState.isInitial = false;
                        newState.isLoading = oldState.isLoading;
                    }
                }
            },
            initialValues: {
                // When creating a state object it will be initialized with these values
                // MAIN_STATE is used to denote the main or global state part of the state
                MAIN_STATE: {
                    page: null,
                    layerSelection: false,
                    isPrintMode: false
                },
                dataSelection: {
                    markers: [],
                    filters: {},
                    isLoading: true
                },
                detail: {
                    isFullscreen: true,
                    isLoading: true
                },
                map: {
                    viewCenter: [52.3719, 4.9012],
                    baseLayer: 'topografie',
                    zoom: 9,
                    overlays: [],
                    isFullscreen: false,
                    isLoading: false,
                    showActiveOverlays: false
                },
                search: {
                    query: null,
                    location: null,
                    category: null,
                    isLoading: true
                },
                straatbeeld: {
                    location: null,
                    pitch: 0,
                    heading: 0,
                    fov: 0,
                    image: null,
                    hotspots: [],
                    date: null,
                    isFullscreen: false,
                    isInitial: true,
                    isLoading: true
                }
            },
            stateVariables: {
                // Property names are keys so that the compiler guarantees the uniqness
                // The type is stored with the name, every state variable has to have a type specification
                _ls: {
                    name: 'layerSelection',
                    type: 'boolean'
                },
                _pg: {
                    name: 'page',
                    type: 'string'
                },
                _pr: {
                    name: 'isPrintmode',
                    type: 'boolean'
                },
                dsd: {
                    name: 'dataSelection.dataset',
                    type: 'string'
                },
                dsf: {
                    name: 'dataSelection.filters',
                    type: 'string[][]',
                    getValue: filters => Object.keys(filters || {}).map(key => [key, filters[key]]),
                    setValue: filters => filters.reduce((result, [key, value]) => {
                        result[key] = value;
                        return result;
                    }, {})
                },
                dsp: {
                    name: 'dataSelection.page',
                    type: 'number'
                },
                dsq: {
                    name: 'dataSelection.query',
                    type: 'string'
                },
                dsv: {
                    name: 'dataSelection.view',
                    type: 'string'
                },
                dte: {
                    name: 'detail.endpoint',
                    type: 'string'
                },
                dtfs: {
                    name: 'detail.isFullscreen',
                    type: 'boolean'
                },
                mpb: {
                    name: 'map.baseLayer',
                    type: 'string'
                },
                mpz: {
                    name: 'map.zoom',
                    type: 'number'
                },
                mpfs: {
                    name: 'map.isFullscreen',
                    type: 'boolean'
                },
                mpo: {
                    name: 'map.overlays',
                    type: 'string[][]',
                    getValue: overlays => (overlays || []).map(overlay => [overlay.id, overlay.isVisible ? 'T' : 'F']),
                    setValue: overlays => overlays.map(([id, isVisible]) => {
                        return {id, isVisible: isVisible === 'T'};
                    })
                },
                mps: {
                    name: 'map.showActiveOverlays',
                    type: 'boolean'
                },
                mpv: {
                    name: 'map.viewCenter',
                    type: 'base62[]',
                    precision: 7
                },
                sbf: {
                    name: 'straatbeeld.fov',
                    type: 'base62',
                    precision: 1
                },
                sbfs: {
                    name: 'straatbeeld.isFullscreen',
                    type: 'boolean'
                },
                sbh: {
                    name: 'straatbeeld.heading',
                    type: 'base62',
                    precision: 1
                },
                sbi: {
                    name: 'straatbeeld.id',
                    type: 'string'
                },
                sbl: {
                    name: 'straatbeeld.location',
                    type: 'base62[]',
                    precision: 7
                },
                sbp: {
                    name: 'straatbeeld.pitch',
                    type: 'base62',
                    precision: 1
                },
                src: {
                    name: 'search.category',
                    type: 'string'
                },
                srl: {
                    name: 'search.location',
                    type: 'base62[]',
                    precision: 7
                },
                srq: {
                    name: 'search.query',
                    type: 'string'
                }
            }
        });
})();
