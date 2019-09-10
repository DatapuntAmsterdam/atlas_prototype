import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import LoginLinkContainer, { LoginLink, mapDispatchToProps } from './LoginLinkContainer'

describe('LoginLinkContainer', () => {
  let store
  beforeEach(() => {
    store = configureMockStore()({})
  })

  it('should render everything', () => {
    const component = shallow(<LoginLinkContainer store={store} />).dive()

    const StyledLink = component.find('Styled(Link)').at(0)
    expect(StyledLink.exists()).toBeTruthy()
    expect(StyledLink.props().linkType).toEqual('with-chevron')
  })
})

describe('LoginLink', () => {
  it('should call the login when clicked', () => {
    const login = jest.fn()
    const component = shallow(<LoginLink login={login} />).dive()
    const StyledLink = component.find('Styled(Link)').at(0)

    StyledLink.simulate('click')
    expect(login).toHaveBeenCalledTimes(1)
  })
})

describe('mapDispatchToProps', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should handle the login request', () => {
    const event = { preventDefault: jest.fn() }
    window.auth = { login: jest.fn() }

    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.login(event)
    expect(dispatch).toHaveBeenCalled()
    expect(window.auth.login).toHaveBeenCalledTimes(1)
  })
})
