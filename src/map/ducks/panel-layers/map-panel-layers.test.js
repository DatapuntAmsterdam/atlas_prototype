import reducer, {
  fetchPanelLayers,
  FETCH_PANEL_ITEMS_FAILURE,
  FETCH_PANEL_ITEMS_REQUEST,
  FETCH_PANEL_ITEMS_SUCCESS,
  getActiveMapLayers,
  getActiveMapLayersWithinZoom,
  getMapPanelLayers,
  selectActivePanelLayers,
  selectNotClickableVisibleMapLayers,
} from './map-panel-layers'

const initialState = {
  items: [],
  isLoading: false,
  error: null,
}

describe('post reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle FETCH_PANEL_LAYERS_REQUEST', () => {
    const startAction = {
      type: FETCH_PANEL_ITEMS_REQUEST,
    }
    expect(reducer({}, startAction)).toEqual({
      error: null,
      isLoading: true,
    })
  })

  it('should handle FETCH_PANEL_ITEMS_SUCCESS', () => {
    const successAction = {
      type: FETCH_PANEL_ITEMS_SUCCESS,
      panelLayers: [{ id: 1 }],
    }
    expect(reducer({}, successAction)).toEqual({
      isLoading: false,
      items: [...successAction.panelLayers],
    })
  })

  it('should handle FETCH_PANEL_ITEMS_FAILURE', () => {
    const updateAction = {
      type: FETCH_PANEL_ITEMS_FAILURE,
      error: 'Error',
    }
    expect(reducer({}, updateAction)).toEqual({
      error: 'Error',
      isLoading: false,
    })
  })
})

// SELECTORS
describe('selectors', () => {
  const panelLayers = [
    {
      id: 'id1',
      title: 'Foo',
      mapLayers: [
        {
          id: 'id3',
          layers: ['layer'],
          legendItems: [
            {
              title: 'Legend 1',
            },
            {
              title: 'Legend 2',
            },
          ],
          title: 'Foo Layer',
          url: '/maps/layer',
          detailUrl: 'geosearch/search/',
          detailParams: {
            item: 'foo',
          },
        },
        {
          id: 'id2',
          layers: ['layer'],
          legendItems: [
            {
              title: 'Legend 1',
            },
            {
              title: 'Legend 2',
            },
          ],
          maxZoom: 16,
          minZoom: 7,
          title: 'Foo Layer',
          url: '/maps/layer',
          noDetail: true,
        },
      ],
    },
  ]

  const mapPanelLayers = panelLayers
    .map(({ mapLayers }) => mapLayers)
    .reduce((acc, val) => acc.concat(val), []) // Alternative to .flat())

  const overlays = [
    {
      id: 'id2',
      isVisible: true,
    },
  ]

  describe('getMapPanelLayers', () => {
    it('should return an undefined if there are no panelLayers', () => {
      const selected = getMapPanelLayers.resultFunc([])
      expect(selected).toEqual([])
    })

    it('should return an array with all panelLayers stripped from the collections', () => {
      const selected = getMapPanelLayers.resultFunc(panelLayers)
      expect(selected).toEqual(mapPanelLayers)
    })
  })

  describe('selectActivePanelLayers', () => {
    it('should return an empty array if there are no panelLayers', () => {
      const selected = selectActivePanelLayers.resultFunc([], overlays)
      expect(selected).toEqual([])
    })

    it('should return an empty array if there are no active overlays', () => {
      const selected = selectActivePanelLayers.resultFunc(mapPanelLayers, [])
      expect(selected).toEqual([])
    })

    it('should return an array with all panelLayers matching the id of the active overlays', () => {
      const selected = selectActivePanelLayers.resultFunc(mapPanelLayers, overlays)
      expect(selected).toEqual([mapPanelLayers[1]])
    })

    it('should return an all active panelLayers and sort them', () => {
      const selected = selectActivePanelLayers.resultFunc(mapPanelLayers, [
        ...overlays,
        { id: 'id3' },
      ])
      expect(selected).toEqual([mapPanelLayers[0], mapPanelLayers[1]])
    })
  })

  describe('getActiveMapLayersWithinZoom', () => {
    it('should filter out mapLayers based on the zoom', () => {
      const selected = getActiveMapLayersWithinZoom.resultFunc(9, mapPanelLayers)
      expect(selected).toEqual([mapPanelLayers[1]])
    })

    it('should filter out mapLayers if the current zoom of the map is smaller then the minZoom of the layer', () => {
      const selected = getActiveMapLayersWithinZoom.resultFunc(6, mapPanelLayers)
      expect(selected).toEqual([])
    })
  })

  describe('selectNotClickableVisibleMapLayers', () => {
    it('should return an array of the notClickable layers', () => {
      const selected = selectNotClickableVisibleMapLayers.resultFunc(mapPanelLayers, overlays)
      expect(selected).toEqual([mapPanelLayers[1]])
    })
  })

  describe('getActiveMapLayers', () => {
    const state = {
      map: {
        overlays: [],
      },
    }
    it('should return an empty array if there are no overlays active', () => {
      const selected = getActiveMapLayers(state)
      expect(selected).toEqual([])
    })

    it('should return an empty array if there are no overlays visible', () => {
      state.map.overlays = [state.map.overlays, { isVisible: false }]
      const selected = getActiveMapLayers(state)
      expect(selected).toEqual([])
    })

    it('should return an empty array if there are no overlays found in the map layers', () => {
      state.map.overlays = [state.map.overlays, { id: 'id', isVisible: true }]
      state.mapLayers = { layers: { items: [] } }
      const selected = getActiveMapLayers(state)
      expect(selected).toEqual([])
    })

    it('should return an empty array if there are no overlays found in the map layers', () => {
      state.map.overlays = [state.map.overlays, { id: 'id', isVisible: true }]
      state.mapLayers = { layers: { items: [] } }
      const selected = getActiveMapLayers(state)
      expect(selected).toEqual([])
    })

    it('should return the maplayers that matches the id with the visible overlays', () => {
      state.map.overlays = [state.map.overlays, { id: 'id', isVisible: true }]
      state.mapLayers = { layers: { items: [{ id: 'id', detailUrl: 'url' }] } }
      const selected = getActiveMapLayers(state)
      expect(selected).toEqual([{ id: 'id', detailUrl: 'url' }])
    })
  })
})

// ACTION CREATORS
describe('actions', () => {
  describe('fetchPanelLayers', () => {
    it('should create an action to request the panel layers', () => {
      const expectedAction = {
        type: FETCH_PANEL_ITEMS_REQUEST,
        panelLayers: [],
      }
      expect(fetchPanelLayers(expectedAction.panelLayers)).toEqual(expectedAction)
    })
  })
})
