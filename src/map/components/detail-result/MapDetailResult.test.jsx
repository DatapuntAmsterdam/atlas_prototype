import React from 'react'
import { shallow } from 'enzyme'
import MapDetailResult from './MapDetailResult'

describe('MapDetailResult', () => {
  let component
  let result

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should display the notifications', () => {
    result = {
      notifications: [{ level: 'alert', value: 'notification' }],
      items: [],
    }

    component = shallow(
      <MapDetailResult
        result={result}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('Notification').exists()).toBeTruthy()
  })

  it('should not display the notifications without value', () => {
    result = {
      notifications: [{ level: 'alert', value: false }],
      items: [],
    }

    component = shallow(
      <MapDetailResult
        result={result}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('Notification').exists()).toBeFalsy()
  })

  it('should display the items', () => {
    result = {
      notifications: [],
      items: [
        {
          label: 'label',
          value: 'value',
        },
      ],
    }

    component = shallow(
      <MapDetailResult
        result={result}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('MapDetailResultItem').exists()).toBeTruthy()
  })

  it('should display the items without value', () => {
    result = {
      notifications: [],
      items: [
        {
          label: 'label',
          value: false,
        },
      ],
    }

    component = shallow(
      <MapDetailResult
        result={result}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('MapDetailResultItem').exists()).toBeFalsy()
  })

  it('should display the items with a label when nested', () => {
    result = {
      notifications: [],
      items: [
        {
          label: 'label',
          value: [
            {
              label: 'sublabel',
              value: 'value',
            },
          ],
        },
      ],
    }

    component = shallow(
      <MapDetailResult
        result={result}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('MapDetailResultItem').exists()).toBeTruthy()
    expect(component.find('h4').exists()).toBeTruthy()
    expect(component.find('h4').props().children).toBe('label')
  })
})
