import React from 'react'
import { shallow } from 'enzyme'
import Header from './Header'

// Mock the HeaderSearchContainer component as its not relevant for this test
jest.mock('../../../header/containers/header-search/HeaderSearchContainer', () => () => <div />)

describe('Header', () => {
  const props = {
    embedPreviewMode: false,
    hasEmbedButton: true,
    hasMaxWidth: true,
    hasPrintButton: true,
    homePage: false,
    printMode: false,
    printOrEmbedMode: false,
    user: {},
  }

  it('should render the main header', () => {
    const component = shallow(<Header {...props} />)
    expect(component).toMatchSnapshot()
  })

  it('should render the print header', () => {
    const component = shallow(
      <Header
        {...{
          ...props,
          printOrEmbedMode: true,
          printMode: true,
        }}
      />,
    )
    expect(component).toMatchSnapshot()
  })

  it('should render the embed header', () => {
    const component = shallow(
      <Header
        {...{
          ...props,
          printOrEmbedMode: true,
          embedPreviewMode: true,
        }}
      />,
    )
    expect(component).toMatchSnapshot()
  })
})
