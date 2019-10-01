import React from 'react'
import { shallow } from 'enzyme'
import { FooterLinkListItem } from '@datapunt/asc-ui'
import ColofonLinks from './ColofonLinks'

describe('ColofonLinks', () => {
  let component
  beforeEach(() => {
    component = shallow(<ColofonLinks />)
  })

  it('should render all links', () => {
    expect(component.find(FooterLinkListItem).length).toEqual(4)
  })
})
