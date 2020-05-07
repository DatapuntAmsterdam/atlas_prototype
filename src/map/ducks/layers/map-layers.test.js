import reducer, {
  fetchMapLayers,
  FETCH_MAP_LAYERS_FAILURE,
  FETCH_MAP_LAYERS_REQUEST,
  FETCH_MAP_LAYERS_SUCCESS,
  getAccessToken,
  getLayers,
  getMapLayers,
} from './map-layers'

const initialState = {
  items: [],
  isLoading: false,
  error: null,
}
describe('post reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle FETCH_MAP_LAYERS_REQUEST', () => {
    const startAction = {
      type: FETCH_MAP_LAYERS_REQUEST,
    }
    expect(reducer({}, startAction)).toEqual({
      error: null,
      isLoading: true,
    })
  })

  it('should handle FETCH_MAP_LAYERS_SUCCESS', () => {
    const successAction = {
      type: FETCH_MAP_LAYERS_SUCCESS,
      mapLayers: [{ id: 1 }],
    }
    expect(reducer({}, successAction)).toEqual({
      isLoading: false,
      items: [...successAction.mapLayers],
    })
  })

  it('should handle FETCH_MAP_LAYERS_FAILURE', () => {
    const updateAction = {
      type: FETCH_MAP_LAYERS_FAILURE,
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
  const overlays = [
    {
      id: 'biz',
      isVisible: true,
    },
    {
      id: 'hvo',
      isVisible: true,
    },
  ]
  const mapLayers = [
    {
      id: 'biz',
      url: '/maps/biz',
      layers: ['biz_polygons'],
      detailUrl: 'geosearch/biz/',
      detailParams: {
        item: 'biz',
      },
      detailIsShape: true,
    },
    {
      id: 'hvo',
      authScope: 'HR/R',
      url: '/maps/handelsregister',
      layers: ['handel_vervoer_opslag', 'handel_vervoer_opslag_label'],
      detailUrl: 'handelsregister/geosearch/',
      detailParams: {
        item: 'handel_vervoer_opslag',
      },
    },
  ]
  const token = 'abc123'

  const state = {
    mapLayers: {
      layers: {
        items: mapLayers,
      },
    },
    user: {
      accessToken: token,
    },
  }

  describe('getLayers', () => {
    it('should return an empty array if there are no overlays active', () => {
      const selected = getLayers.resultFunc([], token, mapLayers)
      expect(selected).toEqual([])
    })

    it('should return an empty array if there are mathing active overlays and mapLayers', () => {
      const notMatchingOverlays = [{ id: 'test', isVisible: true }]
      const selected = getLayers.resultFunc(notMatchingOverlays, token, mapLayers)
      expect(selected).toEqual([])
    })

    it('should return an array with layers with an undefined authScope if there is no token', () => {
      const selected = getLayers.resultFunc(overlays, '', mapLayers)
      expect(selected).toEqual([
        {
          authScope: undefined,
          bounds: undefined,
          id: 'biz',
          isVisible: true,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['biz_polygons'],
            transparent: true,
          },
          url: 'https://acc.map.data.amsterdam.nl/maps/biz',
          params: undefined,
          type: undefined,
        },
      ])
    })

    it('should return an array with all layers if there is a token', () => {
      const selected = getLayers.resultFunc(overlays, token, mapLayers)
      expect(selected).toEqual([
        {
          id: 'biz',
          isVisible: true,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['biz_polygons'],
            transparent: true,
          },
          url: 'https://acc.map.data.amsterdam.nl/maps/biz',
        },
        {
          id: 'hvo',
          isVisible: true,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['handel_vervoer_opslag', 'handel_vervoer_opslag_label'],
            transparent: true,
          },
          url: 'https://acc.map.data.amsterdam.nl/maps/handelsregister?access_token=abc123',
        },
      ])
    })
  })

  it('should return map layers', () => {
    expect(getMapLayers(state)).toEqual(mapLayers)
  })

  it('should return the user access token', () => {
    expect(getAccessToken(state)).toEqual(token)
  })
})

// ACTION CREATORS
describe('actions', () => {
  describe('fetchMapLayers', () => {
    it('should create an action to request the map layers', () => {
      const expectedAction = {
        type: FETCH_MAP_LAYERS_REQUEST,
      }
      expect(fetchMapLayers()).toEqual(expectedAction)
    })
  })
})
