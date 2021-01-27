import configureMockStore from 'redux-mock-store'
import { shallow } from 'enzyme'
import MapContainer, { overrideLeafletGetBounds } from './MapContainer'
import { isEmbedded, isEmbedPreview, isMapActive } from '../../../shared/ducks/ui/ui'
import { previewDataAvailable } from '../../../shared/ducks/selection/selection'
import { getDrawingMode } from '../../ducks/map/selectors'

jest.mock('../../../store/redux-first-router/selectors')
jest.mock('../../../shared/ducks/selection/selection')
jest.mock('../../../shared/ducks/ui/ui')
jest.mock('../../ducks/map/selectors')

describe('overrideLeafletGetBounds', () => {
  it('should overide the getBounds', () => {
    const bl = { x: 482988, y: -551411 }
    const tr = { x: 484747, y: -552666 }
    const pixelBounds = {
      max: { x: 484747, y: -551411 },
      min: { x: 482988, y: -552666 },
      getBottomLeft: () => bl,
      getTopRight: () => tr,
    }

    const sw = { lat: 52.35884827870951, lng: 4.877935872162896 }
    const ne = { lat: 52.36841402615222, lng: 4.8995211251421305 }

    const resultBounds = {
      _northEast: {
        lat: 52.36860534110108,
        lng: 4.899952830201715,
      },

      _southWest: {
        lat: 52.35865696376065,
        lng: 4.877504167103311,
      },
    }
    const map = {
      getPixelBounds: jest.fn(() => pixelBounds),
      unproject: jest.fn((p) => {
        if (p.x === 482988) return sw
        return ne
      }),
    }

    overrideLeafletGetBounds(map)
    expect(map.getBounds).toBeDefined()
    const bounds = map.getBounds()
    expect(bounds).toEqual(resultBounds)
  })
})

describe('MapContainer', () => {
  let initialState
  beforeEach(() => {
    initialState = {}

    isMapActive.mockReturnValue(true)
    getDrawingMode.mockReturnValue('none')
    isEmbedded.mockReturnValue(false)
    isEmbedPreview.mockReturnValue(false)
    previewDataAvailable.mockReturnValue(false)
  })

  it('should set the leaflet instance state', () => {
    const store = configureMockStore()({ ...initialState })
    const wrapper = shallow(
      <MapContainer isFullscreen={false} toggleFullscreen={() => {}} store={store} />,
    )
      .dive()
      .dive()
    wrapper.instance().setLeafletInstance({})
    expect(wrapper.instance().state.leafletInstance).toBeTruthy()
    expect(wrapper.instance().state.leafletInstance.getBounds).toBeDefined()
  })
})
