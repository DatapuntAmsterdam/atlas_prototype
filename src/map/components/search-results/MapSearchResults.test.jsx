import React from 'react'
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
      expect(wrapper).toMatchSnapshot()
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
      expect(wrapper).toMatchSnapshot()
    })

    it('should filter external monumenten on pand results', () => {
      const count = 3
      const location = {
        latitude: 15.999,
        longitude: 329.123,
      }
      const clickHandler = jest.fn()
      const results = [
        {
          label: 'label',
          categoryLabel: 'category',
          uri: 'result-uri-1',
          type: 'bag/pand',
          results: [],
          subCategories: [],
        },
        {
          label: 'label',
          categoryLabel: 'category',
          uri: 'result-uri-2',
          type: 'foo',
          results: [],
          subCategories: [],
        },
        {
          label: 'label',
          categoryLabel: 'category',
          uri: 'result-uri-3',
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
          onMaximize={clickHandler}
          results={results}
        />,
      )
      expect(wrapper).toMatchSnapshot()
    })

    it('should update results', () => {
      const count = 2
      const location = {
        latitude: 15.999,
        longitude: 329.123,
      }
      const clickHandler = jest.fn()
      const results = [
        {
          label: 'label',
          categoryLabel: 'category',
          uri: 'result-uri-1',
          type: 'bag/pand',
          results: [],
          subCategories: [],
        },
        {
          label: 'label',
          categoryLabel: 'category',
          uri: 'result-uri-2',
          type: 'bag/pand',
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
          onMaximize={clickHandler}
          results={results}
        />,
      )
      expect(wrapper).toMatchSnapshot()

      wrapper.setProps({
        count: 3,
        location: {
          latitude: 1,
          longitude: 0,
        },
        panoUrl: 'other-pano-url',
        missingLayers: 'Layer 3',
        results: [
          {
            label: 'label',
            categoryLabel: 'category',
            uri: 'result-uri-1',
            type: 'bag/pand',
            results: [],
            subCategories: [],
          },
          {
            label: 'label',
            categoryLabel: 'category',
            uri: 'result-uri-2',
            type: 'bag/pand',
            results: [],
            subCategories: [],
          },
          {
            label: 'label',
            categoryLabel: 'category',
            uri: 'result-uri-3',
            type: 'bag/pand',
            results: [],
            subCategories: [],
          },
        ],
      })
      expect(wrapper).toMatchSnapshot()
    })
  })
})
