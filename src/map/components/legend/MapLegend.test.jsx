import { shallow } from 'enzyme'
import MapLegend from './MapLegend'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

describe('MapLegend', () => {
  const props = {
    zoomLevel: 2,
    overlays: [
      {
        id: 2,
        isVisible: false,
      },
      {
        id: 3,
        isVisible: true,
      },
    ],
    user: {
      authenticated: true,
      scopes: ['authscope1'],
    },
    isPrint: false,
    activeMapLayers: [
      {
        title: 'title',
        maxZoom: 3,
        minZoom: 1,
        authScope: 'authscope1',
        url: 'url',
        layers: ['maplayer1'],
        legendItems: [
          {
            id: 1,
            title: 'legendTitle',
            layer: 'layer',
            iconUrl: 'iconUrl',
            notSelectable: true,
          },
        ],
      },
      {
        title: 'title',
        id: 1,
        maxZoom: 3,
        minZoom: 1,
        authScope: false,
        legendItems: [
          {
            id: 2,
            title: 'legendTitle',
            layer: false,
            iconUrl: false,
          },
          {
            id: 3,
            title: 'legendTitle',
            layer: false,
            iconUrl: false,
          },
        ],
      },
    ],
  }
  it('should render the component', () => {
    const component = shallow(<MapLegend {...props} />)
    expect(component).toMatchSnapshot()
  })
})
