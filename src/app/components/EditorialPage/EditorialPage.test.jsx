import { useMatomo } from '@datapunt/matomo-tracker-react'
import { mount, shallow } from 'enzyme'
import environment from '../../../environment'
import useDocumentTitle from '../../utils/useDocumentTitle'
import EditorialPage from './EditorialPage'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({ createHref: ({ pathname }) => pathname }),
}))

jest.mock('../../utils/useDocumentTitle')
jest.mock('@datapunt/matomo-tracker-react')

describe('EditorialPage', () => {
  let component
  const mockSetDocumentTitle = jest.fn()
  const mockTrackPageView = jest.fn()

  beforeEach(() => {
    useDocumentTitle.mockImplementation(() => ({
      setDocumentTitle: mockSetDocumentTitle,
    }))

    useMatomo.mockImplementation(() => ({ trackPageView: mockTrackPageView }))

    component = shallow(<EditorialPage link={{ pathname: '/this.is.alink' }} />).dive()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should display the loading indicator', () => {
    component.setProps({ loading: true })

    expect(component.find('LoadingIndicator')).toBeTruthy()
  })

  it('should set the canonical url', () => {
    const link = component.find('link')
    expect(link).toBeTruthy()
    expect(link.props().href).toBe(`${environment.ROOT}this.is.alink`)
  })

  it('should set the document title and send to analytics', () => {
    component = mount(<EditorialPage documentTitle="" />)

    expect(mockSetDocumentTitle).not.toHaveBeenCalled()
    expect(mockTrackPageView).not.toHaveBeenCalled()

    component.setProps({ documentTitle: 'foo' })

    expect(mockSetDocumentTitle).toHaveBeenCalledWith('foo')
    expect(mockTrackPageView).toHaveBeenCalledWith({ documentTitle: 'foo' })
  })
})
