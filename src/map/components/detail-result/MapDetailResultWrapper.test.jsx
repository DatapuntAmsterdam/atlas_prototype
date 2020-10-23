import React from 'react'
import { shallow } from 'enzyme'

import MapDetailResultWrapper from './MapDetailResultWrapper'

jest.mock('redux-first-router-link', () => ({
  _esModule: true,
  default: jest.fn,
}))

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => []),
}))

describe('MapDetailResultWrapper', () => {
  it('should render everything', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper title="title" subTitle="subTitle" onMaximize={clickHandler}>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
    expect(wrapper).toMatchSnapshot()
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
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render empty sub title', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper title="title" subTitle="" onMaximize={clickHandler}>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render missing sub title', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper title="title" onMaximize={clickHandler}>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render missing children', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(<MapDetailResultWrapper title="title" onMaximize={clickHandler} />)
    expect(wrapper).toMatchSnapshot()
  })
})
