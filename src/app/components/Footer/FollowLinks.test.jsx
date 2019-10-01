import React from 'react'
import { shallow } from 'enzyme'
import { FooterLinkListItem } from '@datapunt/asc-ui'
import FollowLinks from './FollowLinks'

describe('FollowLinks', () => {
  let component
  beforeEach(() => {
    component = shallow(<FollowLinks />)
  })

  it('should render all links', () => {
    expect(component.find(FooterLinkListItem).length).toEqual(5)
  })
})
