import { shallow } from 'enzyme'
import React from 'react'
import { DetailResult, DetailResultItemType } from '../../types/details'
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
        result={(result as unknown) as DetailResult}
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
        result={(result as unknown) as DetailResult}
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
          type: DetailResultItemType.Default,
          label: 'label',
          value: 'value',
        },
      ],
    }

    component = shallow(
      <MapDetailResult
        result={(result as unknown) as DetailResult}
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
          type: DetailResultItemType.Default,
          label: 'label',
          value: false,
        },
      ],
    }

    component = shallow(
      <MapDetailResult
        result={(result as unknown) as DetailResult}
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
          type: DetailResultItemType.Default,
          label: 'label',
          value: [
            {
              type: DetailResultItemType.Default,
              label: 'sublabel',
              value: 'value',
            },
          ],
        },
      ],
    }

    component = shallow(
      <MapDetailResult
        result={(result as unknown) as DetailResult}
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
