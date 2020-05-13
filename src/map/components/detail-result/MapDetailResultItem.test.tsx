import { shallow } from 'enzyme'
import React from 'react'
import { DetailResultItem, DetailResultItemType } from '../../types/details'
import MapDetailResultItem from './MapDetailResultItem'

describe('MapDetailResultItem', () => {
  let component
  let item: DetailResultItem

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should display the item', () => {
    item = {
      type: DetailResultItemType.Default,
      label: 'label',
      value: 'value',
    }

    component = shallow(<MapDetailResultItem item={item} />)

    expect(component.find('li').exists()).toBeTruthy()
  })

  it('should not display the item without value', () => {
    item = {
      type: DetailResultItemType.Default,
      label: 'label',
    }

    component = shallow(<MapDetailResultItem item={item} />)

    expect(component.find('li').exists()).toBeFalsy()
  })

  it('should display the item with a multiline', () => {
    item = {
      type: DetailResultItemType.Default,
      label: 'label',
      value: 'value',
      multiLine: true,
    }

    component = shallow(<MapDetailResultItem item={item} />)

    expect(component.find('.map-detail-result__item-value--multiline').exists()).toBeTruthy()
  })

  it('should display the item with a status', () => {
    item = {
      type: DetailResultItemType.Default,
      label: 'label',
      value: 'value',
      status: 'foo',
    }

    component = shallow(<MapDetailResultItem item={item} />)

    expect(component.find(`.map-detail-result__item-value--${item.status}`).exists()).toBeTruthy()
  })

  it('should make the item clickable', () => {
    item = {
      type: DetailResultItemType.Default,
      label: 'label',
      value: 'value',
      link: 'foo',
    }

    component = shallow(<MapDetailResultItem item={item} />)

    expect(component.find('a').exists()).toBeTruthy()
    expect(component.find('a').props().children).toBe(item.value)
    expect(component.find('a').props().href).toBe(item.link)
  })
})
