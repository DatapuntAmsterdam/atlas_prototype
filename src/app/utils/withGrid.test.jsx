import React from 'react'
import { shallow } from 'enzyme'
import withGrid from './withGrid'

describe('withGrid', () => {
  const ChildComponent = () => <div>Component!</div>

  it('returns the grid', () => {
    const MockComponent = () => withGrid(<ChildComponent />)
    const component = shallow(<MockComponent />)
      .dive()
      .dive()

    expect(component.at(0).exists()).toBeTruthy()
    expect(component.at(0).find('ChildComponent')).toBeTruthy()
  })

  it('returns the grid with default props', () => {
    const MockComponent = () => withGrid(<ChildComponent />)
    const component = shallow(<MockComponent />)

    expect(component.at(0).props().direction).toBe('column')
    expect(component.at(0).props().gutterX).toBe(20)
    expect(component.at(0).props().gutterY).toBe(20)
  })

  it('returns the grid with custom props', () => {
    const MockComponent = () => withGrid(<ChildComponent />, 30, 'row')
    const component = shallow(<MockComponent />)

    expect(component.at(0).props().direction).toBe('row')
    expect(component.at(0).props().gutterX).toBe(30)
    expect(component.at(0).props().gutterY).toBe(30)
  })
})
