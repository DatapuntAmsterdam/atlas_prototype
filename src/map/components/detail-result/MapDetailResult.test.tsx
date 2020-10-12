import { shallow } from 'enzyme'
import React from 'react'
import { DetailResultItemType } from '../../types/details'
import MapDetailResult from './MapDetailResult'
import NotificationLevel from '../../../app/models/notification'
import { MapDetails } from '../../services/map'

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'foo' }),
}))

jest.mock('../../../app/pages/DataDetailPage/useDataDetail')

describe('MapDetailResult', () => {
  let component
  let result

  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should display the notifications', () => {
    result = {
      data: {
        notifications: [{ level: NotificationLevel.Attention, value: 'notification' }],
        items: [],
      },
    }

    component = shallow(
      <MapDetailResult
        result={(result as unknown) as MapDetails}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('Alert').exists()).toBeTruthy()
  })

  it('should not display the notifications without value', () => {
    result = {
      data: {
        notifications: [{ level: 'alert', value: false }],
        items: [],
      },
    }

    component = shallow(
      <MapDetailResult
        result={(result as unknown) as MapDetails}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('Alert').exists()).toBeFalsy()
  })

  it('should display the items', () => {
    result = {
      data: {
        notifications: [],
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            label: 'label',
            entries: [
              {
                term: 'foo',
                description: 'bar',
              },
            ],
          },
        ],
      },
    }

    component = shallow(
      <MapDetailResult
        result={(result as unknown) as MapDetails}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('MapDetailResultItem').exists()).toBeTruthy()
  })

  it('should display the items without value', () => {
    result = {
      data: {
        notifications: [],
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            label: 'label',
            entries: [
              {
                term: 'foo',
                description: 'bar',
              },
            ],
          },
        ],
      },
    }

    component = shallow(
      <MapDetailResult
        result={(result as unknown) as MapDetails}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('MapDetailResultItem').exists()).toBeFalsy()
  })

  it('should display the items with a label when nested', () => {
    result = {
      data: {
        notifications: [],
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            title: 'label',
            entries: [
              {
                term: 'foo',
                description: 'bar',
              },
            ],
          },
        ],
      },
    }

    component = shallow(
      <MapDetailResult
        result={(result as unknown) as MapDetails}
        panoUrl="panoUrl"
        onMaximize={jest.fn()}
        onPanoPreviewClick={jest.fn()}
      />,
    )

    expect(component.find('h4').exists()).toBeTruthy()
    expect(component.find('h4').props().children).toBe('label')
  })
})
