import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import ErrorMessageContainer from './ErrorMessageContainer'
import ErrorMessage from './ErrorMessage'
import { getMessage } from '../../../../shared/ducks/error/error-message'

jest.mock('../../../../shared/ducks/error/error-message')

describe('ErrorMessage', () => {
  it('should render everything', () => {
    const component = shallow(<ErrorMessage errorMessage="This is an error message" />)
    expect(component).toMatchSnapshot()
  })

  it('should render the container', () => {
    const store = configureMockStore()({})
    getMessage.mockImplementation(() => 'Tanjkns')
    const component = shallow(<ErrorMessageContainer store={store} />)
      .dive()
      .dive()
    expect(component).toMatchSnapshot()
  })
})
