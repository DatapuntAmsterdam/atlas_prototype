import React from 'react'
import { shallow } from 'enzyme'
import Tab from './Tab'

describe('Tab', () => {
  let onClick

  beforeEach(() => {
    onClick = jest.fn()
  })

  describe('the current tab', () => {
    it('should render', () => {
      const tab = shallow(<Tab isSelected label="myTab" onClick={onClick} page="page" />)
      expect(tab).toMatchSnapshot()
    })

    it('should set the count', () => {
      const tab = shallow(<Tab isSelected count={42} label="myTab" onClick={onClick} page="page" />)
      expect(tab.text()).toContain(42)
    })
  })

  describe('not the current tab', () => {
    it('should render', () => {
      const tab = shallow(<Tab label="myTab" onClick={onClick} page="page" />)
      expect(tab).toMatchSnapshot()
    })

    it('should handle clicks', () => {
      const tab = shallow(<Tab label="myTab" onClick={onClick} page="page" />)
      tab.find('button').simulate('click')
      expect(onClick.mock.calls.length).toBe(1)
    })

    it('should use the count', () => {
      const tab = shallow(<Tab label="myTab" isSelected count={42} onClick={onClick} page="page" />)
      expect(tab.text()).toContain(42)
    })
  })
})
