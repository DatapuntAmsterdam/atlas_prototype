import { shallow } from 'enzyme'

import MapDetailResultWrapper from './MapDetailResultWrapper'

jest.mock('redux-first-router-link', () => ({
  _esModule: true,
  default: jest.fn,
}))

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => []),
}))
jest.mock('../../../app/utils/useGetLegacyPanoramaPreview', () => () => ({
  panoramaUrl: '',
  link: '/link',
  linkComponent: null,
  error: true,
}))
describe('MapDetailResultWrapper', () => {
  it('should render everything', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper title="title" subTitle="subTitle" onMaximize={clickHandler}>
        <ul id="childrenUl">
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
    expect(wrapper.find('#childrenUl').length).not.toBe(0)
  })

  it('should not render empty panoUrl', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper title="title" subTitle="subTitle" onMaximize={clickHandler}>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
    expect(wrapper.find('.map-detail-result__header').length).toBe(0)
  })

  it('should not render empty subTitle', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper title="title" subTitle="" onMaximize={clickHandler}>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
    expect(wrapper.find('.map-detail-result__header-subtitle').length).toBe(0)
  })

  it('should not render missing subTitle', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper title="title" onMaximize={clickHandler}>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
    expect(wrapper.find('.map-detail-result__header-subtitle').length).toBe(0)
  })
})
