import React from 'react'
import { mount, shallow } from 'enzyme'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import EditorialPage from './EditorialPage'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import useDocumentTitle from '../../utils/useDocumentTitle'
import environment from '../../../environment'

jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('../../utils/useDocumentTitle')
jest.mock('@datapunt/matomo-tracker-react')

describe('EditorialPage', () => {
  let component
  const mockSetDocumentTitle = jest.fn()
  const mockTrackPageView = jest.fn()

  beforeEach(() => {
    linkAttributesFromAction.mockImplementation(() => ({
      href: '/this.is.alink',
    }))
    useDocumentTitle.mockImplementation(() => ({
      setDocumentTitle: mockSetDocumentTitle,
    }))
    useMatomo.mockImplementation(() => ({ trackPageView: mockTrackPageView }))

    component = shallow(<EditorialPage linkAction={{}} />).dive()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should display the loading indicator', () => {
    component.setProps({ loading: true })

    expect(component.find('LoadingIndicator')).toBeTruthy()
  })

  it('should set the canonical title', () => {
    const link = component.find('link')
    expect(link).toBeTruthy()
    expect(link.props().href).toBe(`${environment.ROOT}this.is.alink`)
  })

  it('should set the document title and send to analytics', () => {
    component = mount(<EditorialPage linkAction={{}} documentTitle="" />)

    expect(mockSetDocumentTitle).not.toHaveBeenCalled()
    expect(mockTrackPageView).not.toHaveBeenCalled()

    component.setProps({ documentTitle: 'foo' })

    expect(mockSetDocumentTitle).toHaveBeenCalledWith('foo')
    expect(mockTrackPageView).toHaveBeenCalledWith({ documentTitle: 'foo' })
  })
})
