import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { sharePage, showPrintMode } from '../../../shared/ducks/ui/ui'
import ShareBar from './ShareBar'

jest.mock('../../../shared/ducks/ui/ui')

describe('ShareBar', () => {
  const props = {
    hasPrintButton: false,
  }

  const store = configureMockStore()({})
  const component = shallow(<ShareBar {...props} store={store} />)
    .dive()
    .dive()

  sharePage.mockImplementation(() => ({ type: 'action' }))
  showPrintMode.mockImplementation(() => ({ type: 'action' }))

  beforeEach(() => {
    global.window.title = 'Page title'
    global.window.open = jest.fn()
  })

  it('should handle onClick event on buttons', () => {
    component
      .find('ShareButton')
      .at(0)
      .simulate('click')
    expect(sharePage).toHaveBeenCalledWith('facebook')

    component
      .find('ShareButton')
      .at(1)
      .simulate('click')
    expect(sharePage).toHaveBeenCalledWith('twitter')

    component
      .find('ShareButton')
      .at(2)
      .simulate('click')
    expect(sharePage).toHaveBeenCalledWith('linkedin')

    component
      .find('ShareButton')
      .at(3)
      .simulate('click')
    expect(sharePage).toHaveBeenCalledWith('email')
  })

  describe('should render all the items of the menu', () => {
    expect(component.find('ShareButton').length).toBe(4)

    it("should only render the print button on certain scenario's", () => {
      component.setProps({ hasPrintButton: true })
      expect(component.find('ShareButton').length).toBe(5)

      component
        .find('ShareButton')
        .at(4)
        .simulate('click')
      expect(showPrintMode).toHaveBeenCalled()
    })
  })
})
