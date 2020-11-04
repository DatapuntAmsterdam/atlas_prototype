import { shallow } from 'enzyme'
import React from 'react'
import AuthAlert from './AuthAlert'

describe('AuthAlert', () => {
  it('should render with an additional message', () => {
    const excludedResults = 'Lorem ipsum'
    const component = shallow(<AuthAlert excludedResults={excludedResults} />)

    expect(component.find('Paragraph').at(0).props().children).toContain('over: Lorem ipsum.')
  })
})
