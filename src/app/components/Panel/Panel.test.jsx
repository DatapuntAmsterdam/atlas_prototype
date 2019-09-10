import React from 'react'
import { shallow } from 'enzyme'

import Panel from './Panel'

describe('Panel', () => {
  let component
  const mockCloseAction = jest.fn()

  beforeEach(() => {
    component = shallow(
      <Panel isPanelVisible closeAction={mockCloseAction}>
        <div />
      </Panel>,
    )
  })

  it('should render the panel', () => {
    expect(component.find('section').props().children).toEqual(<div />)
  })

  it('should handle the onclose event', () => {
    const button = component.find('button')

    expect(button.exists()).toBeTruthy()

    button.simulate('click')

    expect(mockCloseAction).toHaveBeenCalled()
  })
})
