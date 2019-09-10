import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'

import MapDetailResultWrapper from './MapDetailResultWrapper'

const store = configureMockStore()({
  ui: {
    isEmbed: false,
  },
})

describe('MapDetailResultWrapper', () => {
  it('should render everything', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper
        panoUrl="panoUrl"
        title="title"
        subTitle="subTitle"
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        store={store}
      >
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
      .dive()
      .dive()
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render empty panoUrl', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper
        panoUrl=""
        title="title"
        subTitle="subTitle"
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        store={store}
      >
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
      { context: { store } },
    )
      .dive()
      .dive()
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render empty sub title', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper
        panoUrl=""
        title="title"
        subTitle=""
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        store={store}
      >
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
      .dive()
      .dive()
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render missing sub title', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper
        panoUrl=""
        title="title"
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        store={store}
      >
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </MapDetailResultWrapper>,
    )
      .dive()
      .dive()
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render missing children', () => {
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapDetailResultWrapper
        store={store}
        panoUrl=""
        title="title"
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
      />,
    )
      .dive()
      .dive()
    expect(wrapper).toMatchSnapshot()
  })
})
