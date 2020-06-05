import React from 'react'
import { shallow } from 'enzyme'
import Gallery from './Gallery'
import getState from '../../../shared/services/redux/get-state'

jest.mock('../../../shared/services/redux/get-state')
jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')

describe('Gallery', () => {
  let component

  const MOCK_FILES = Array(10).fill({ filename: 'test123', url: 'img.jpg' })

  const setState = jest.fn()
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState])

  beforeEach(() => {
    getState.mockImplementation(() => ({
      user: {
        scopes: [],
      },
    }))

    component = shallow(
      <Gallery id="foo1234" allFiles={MOCK_FILES} onClick={jest.fn} title="Title!" />,
    )
  })

  it('should show max 6 results initially', () => {
    expect(component.find('IIIFThumbnail')).toHaveLength(6)
  })

  it('should be able toggle between showing 6 or all results', () => {
    component.find('ActionButton').simulate('click')
    expect(setState).toHaveBeenCalledWith(MOCK_FILES)
  })
})
