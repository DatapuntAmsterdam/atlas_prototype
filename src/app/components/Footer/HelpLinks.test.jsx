import React from 'react'
import { shallow } from 'enzyme'
import { FooterLinkListItem } from '@datapunt/asc-ui'
import HelpLinks, { FeedbackLink } from './HelpLinks'
import { openFeedbackForm } from '../Modal/FeedbackModal'

jest.mock('../Modal/FeedbackModal')

describe('HelpLinks', () => {
  let component
  beforeEach(() => {
    component = shallow(<HelpLinks />)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render all links', () => {
    expect(component.find(FooterLinkListItem).length).toEqual(4)
  })

  it('should open the feedback form', () => {
    component.find(FeedbackLink).simulate('click')
    expect(openFeedbackForm.mock.calls.length).toBe(1)
  })
})
