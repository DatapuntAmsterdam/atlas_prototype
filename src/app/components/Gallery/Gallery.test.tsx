import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import getState from '../../../shared/services/redux/get-state'
import Gallery from './Gallery'

jest.mock('../../../shared/services/redux/get-state')
jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')

const getStateMock = mocked(getState, true)

describe('Gallery', () => {
  let component: ShallowWrapper

  const MOCK_FILES = Array(10).fill({ filename: 'test123', url: 'img.jpg' })

  const setState = jest.fn()
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation(((init: any) => [init, setState]) as any)

  beforeEach(() => {
    getStateMock.mockImplementation(
      () =>
        ({
          user: {
            scopes: [],
          },
        } as any),
    )

    component = shallow(<Gallery id="foo1234" allFiles={MOCK_FILES} access="PUBLIC" />)
  })

  it('should show max 6 results initially', () => {
    expect(component.find('IIIFThumbnail')).toHaveLength(6)
  })

  it('should be able toggle between showing 6 or all results', () => {
    component.find('ActionButton').simulate('click')
    expect(setState).toHaveBeenCalledWith(MOCK_FILES)
  })
})
