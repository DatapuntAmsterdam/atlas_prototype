import { shallow } from 'enzyme'

import MapSearchResults from './MapSearchResults'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system'

jest.mock('redux-first-router-link', () => ({
  _esModule: true,
  default: jest.fn,
}))

jest.mock('../../../shared/services/coordinate-reference-system')
jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => []),
}))

jest.mock('../../../app/utils/useGetLegacyPanoramaPreview', () => () => ({
  panoramaUrl: '/foo',
  link: '/link',
  linkComponent: null,
}))

describe('MapSearchResults', () => {
  beforeEach(() => {
    wgs84ToRd.mockImplementation(() => ({ x: 1.12345, y: 654.321 }))
  })

  afterEach(() => {
    wgs84ToRd.mockReset()
  })

  it('should calculate RD coordinates', () => {
    const location = {
      latitude: 15.999,
      longitude: 329.123,
    }
    const clickHandler = jest.fn()
    shallow(
      <MapSearchResults
        isEmbed={false}
        location={location}
        onItemClick={clickHandler}
        onMaximize={clickHandler}
        results={[]}
      />,
    )
    expect(wgs84ToRd).toHaveBeenCalledWith(location)
  })

  describe('rendering', () => {
    it('should render empty results', () => {
      const clickHandler = jest.fn()
      const wrapper = shallow(
        <MapSearchResults
          isEmbed={false}
          location={{}}
          onItemClick={clickHandler}
          onMaximize={clickHandler}
          results={[]}
        />,
      )
      expect(wrapper.find('MapSearchResultsCategory').length).toBe(0)
    })

    it('should render results', () => {
      const count = 2
      const location = {
        latitude: 15.999,
        longitude: 329.123,
      }
      const clickHandler = jest.fn()
      const missingLayers = 'Layer 1, Layer 2'
      const results = [
        {
          label: 'label',
          categoryLabel: 'category',
          uri: 'result-uri-1',
          type: 'monumenten/monument',
          results: [],
          subCategories: [],
        },
        {
          label: 'label',
          categoryLabel: 'category',
          uri: 'result-uri-2',
          type: 'monumenten/monument',
          results: [],
          subCategories: [],
        },
      ]
      const wrapper = shallow(
        <MapSearchResults
          isEmbed={false}
          count={count}
          location={location}
          onItemClick={clickHandler}
          missingLayers={missingLayers}
          onMaximize={clickHandler}
          results={results}
        />,
      )
      expect(wrapper.find('MapSearchResultsCategory').length).not.toBe(0)
    })
  })
})
