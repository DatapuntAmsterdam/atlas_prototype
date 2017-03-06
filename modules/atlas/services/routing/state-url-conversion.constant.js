(function () {
    //
    // This constant holds the configuration of all state variables that are stored in the url
    // - The url parameter name can be found in stateVariables.<parameterName>
    //   The association between the state variable and the url parameter is described by the name (eg 'map.zoom')
    //   The type of the parameter is described by the type parameter
    // - Any default value can be found in initialValues.<parameterName>
    // - The default state is described in onCreate.DEFAULT
    // - Any other default processing for a state object is described in onCreate.<stateObject>
    // - The state variables that are copied from a previous state are described in post.<stateObject>
    //
    // To include a state variable (stateObject.stateVariable) in the url:
    // - Define a unique short name for the variable
    // - Define the type of the variable
    // - Add <shortName>: { name: 'stateObject.stateVariable', type: <typeName> } to stateVariables
    //
    // Note: The depth of the stateVariable in the stateObject is free
    //       eg 'map.x.y.z' is perfectly valid and corresponds to map: { x: { y: { z: <anyValue> } } }
    //
    // Valid types for state variables are:
    // - string
    // - boolean
    // - number (precision van be specified in the precison property of the stateVariable)
    // - base62 (encode any number in base 62, 0-9A-Za-z, precision van be specified in the precison property)
    // and the complex types:
    // - []
    //   eg number[] for a coordinate like [52, 4] which will store as '52:4' in the url
    // - keyvalues
    //   for { key: stringValue, key: stringValue, ... } objects
    //   like { aap: 'noot', mies: 'wim' } which will store as 'aap::noot:mies::wim' in the url
    // - object(key:typeName,key:typeName,...)
    //   for { key: valueOfType, key: valueOfType, ... } objects
    //   like object(aap:string,mies:number) for { aap: 'noot', mies: 5 } which will store as 'noot:5' in the url
    //
    angular
        .module('atlas')
        .constant('STATE_URL_CONVERSION', {
            onCreate: {
                // Initialisation methods for the url2state conversion
                // These methods are executed after a state object has been initialized with the initialValues
                DEFAULT: (oldState, newState, params, initialValues) => {
                    ['atlas', 'page', 'layerSelection'].forEach(s => newState[s] = angular.copy(initialValues[s]));
                    if (angular.equals(params, {})) {
                        // When no params, go to home page and show initial map
                        newState.page.name = 'home';
                        newState.map = angular.copy(initialValues.map);
                    }
                    return newState;
                }
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
                    return newState;
                },
                detail: (oldState, newState) => {
                    if (angular.isObject(oldState) && oldState.endpoint === newState.endpoint) {
                        newState.display = oldState.display;
                        newState.geometry = oldState.geometry;
                        newState.isLoading = oldState.isLoading;
                        newState.isFullscreen = oldState.isFullscreen;
                    }
                    return newState;
                },
                map: (oldState, newState) => {
                    if (angular.isObject(oldState)) {
                        newState.drawingMode = oldState.drawingMode;
                        newState.isLoading = oldState.isLoading;
                    }
                    return newState;
                },
                search: (oldState, newState) => {
                    const hasOldState = angular.isObject(oldState);
                    const hasInputChanged = hasOldState && (
                            oldState.query !== newState.query ||
                            !angular.equals(oldState.location, newState.location) ||
                            oldState.category !== newState.category
                        );

                    if (hasInputChanged) {
                        newState.numberOfResults = null;
                        newState.isLoading = true;
                    } else if (hasOldState) {
                        newState.numberOfResults = oldState.numberOfResults;
                        newState.isLoading = oldState.isLoading;
                    }

                    return newState;
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
                    return newState;
                }
            },
            initialValues: {
                // When creating a state object it will be initialized with these values
                atlas: {
                    isPrintMode: false
                },
                dataSelection: {
                    markers: [],    // eg: [[52.1, 4.1], [52.2, 4.0]],
                    filters: {},    // eg: {buurtcombinatie: 'Geuzenbuurt', buurt: 'Trompbuurt'}
                    geometryFilter: {
                        markers: []
                    },
                    isLoading: true
                    // view: 'TABLE',
                    // dataset: 'bag',
                    // query: 'searchText',
                    // page: 1,
                    // isFullscreen: true,
                },
                detail: {
                    isFullscreen: false,
                    isLoading: true
                    // endpoint: 'http://api.example.com/bag/verblijfsobject/123/',
                    // display: 'This is the _display variable as available in each endpoint',
                    // geometry: null,
                },
                layerSelection: {
                    isEnabled: false
                },
                map: {
                    viewCenter: [52.3731081, 4.8932945],
                    baseLayer: 'topografie',
                    zoom: 11,
                    overlays: [],
                    isFullscreen: false,
                    isLoading: false,
                    showActiveOverlays: false,
                    drawingMode: false
                },
                page: {
                    name: null  // eg: 'home'
                },
                search: {
                    query: null,    // eg: 'linnaeus'
                    location: null, // eg: [52.123, 4.789]
                    category: null,
                    isLoading: true
                    // numberOfResults: null
                },
                straatbeeld: {
                    location: null, // eg: [52.8, 4.9]
                    pitch: 0,       // eg: -10
                    heading: 0,     // eg: 270
                    fov: 0,         // eg: 65
                    image: null,    // eg: {
                                    //     pattern: 'http://www.example.com/path/some-id/{this}/{that}/{thingie}.jpg',
                                    //     preview: 'http://www.example.com/path/some-id/preview.jpg'
                                    // }
                    hotspots: [],   // eg: [{id: 'ABC124', heading: 90, distance: 18}],
                    date: null,     // eg: new Date()
                    isFullscreen: false,
                    isInitial: true,
                    isLoading: true
                    // id: 'ABC123',
                }
            },
            stateVariables: {
                // Property names are keys so that the compiler guarantees the uniqness
                // The type is stored with the name, every state variable has to have a type specification
                // atlas (at)
                atp: {
                    name: 'atlas.isPrintMode',
                    type: 'boolean'
                },
                // dataSelection (ds)
                dsd: {
                    name: 'dataSelection.dataset',
                    type: 'string'
                },
                dsf: {
                    name: 'dataSelection.filters',
                    type: 'keyvalues'
                },
                dsgf: {
                    name: 'dataSelection.geometryFilter.markers',
                    type: 'base62[][]',
                    precision: 7
                },
                dsgd: {
                    name: 'dataSelection.geometryFilter.description',
                    type: 'string'
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
                // detail (dt)
                dte: {
                    name: 'detail.endpoint',
                    type: 'string'
                },
                dtfs: {
                    name: 'detail.isFullscreen',
                    type: 'boolean'
                },
                // header (hd, not used)
                // layerSelection (ls)
                lse: {
                    name: 'layerSelection.isEnabled',
                    type: 'boolean'
                },
                // map (mp)
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
                mpg: {
                    name: 'map.geometry',
                    type: 'base62[][]',
                    precision: 7
                },
                mpo: {
                    name: 'map.overlays',
                    type: 'object(id:string,isVisible:boolean)[]'
                },
                mps: {
                    name: 'map.showActiveOverlays',
                    type: 'boolean'
                },
                mpv: {
                    name: 'map.viewCenter',
                    type: 'number[]',
                    precision: 7
                },
                // page (pg)
                pgn: {
                    name: 'page.name',
                    type: 'string'
                },
                // search (sr)
                src: {
                    name: 'search.category',
                    type: 'string'
                },
                sre: {
                    name: 'search.isEnabled',
                    type: 'boolean'
                },
                srl: {
                    name: 'search.location',
                    type: 'base62[]',
                    precision: 7
                },
                srq: {
                    name: 'search.query',
                    type: 'string'
                },
                // straatbeeld (sb)
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
                }
            }
        });
})();
