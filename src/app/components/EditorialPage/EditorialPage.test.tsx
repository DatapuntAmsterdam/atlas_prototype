import { useMatomo } from '@datapunt/matomo-tracker-react'
import { mount, shallow } from 'enzyme'
import environment from '../../../environment'
import useDocumentTitle from '../../utils/useDocumentTitle'
import EditorialPage from './EditorialPage'

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  useHistory: () => ({ createHref: ({ pathname }) => pathname }),
}))

jest.mock('../../utils/useDocumentTitle')
jest.mock('@datapunt/matomo-tracker-react')

describe('EditorialPage', () => {
  let component: any
  const mockSetDocumentTitle = jest.fn()
  const mockTrackPageView = jest.fn()

  beforeEach(() => {
    // @ts-ignore
    useDocumentTitle.mockImplementation(() => ({
      setDocumentTitle: mockSetDocumentTitle,
    }))

    // @ts-ignore
    useMatomo.mockImplementation(() => ({ trackPageView: mockTrackPageView }))

    component = shallow(
      <EditorialPage loading={false} error={false} link={{ pathname: '/this.is.alink' }} />,
    ).dive()
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
    component = mount(<EditorialPage loading={false} error={false} documentTitle="" />)

    expect(mockSetDocumentTitle).not.toHaveBeenCalled()
    expect(mockTrackPageView).not.toHaveBeenCalled()

    component.setProps({ documentTitle: 'foo' })

    expect(mockSetDocumentTitle).toHaveBeenCalledWith('foo')
    expect(mockTrackPageView).toHaveBeenCalledWith({ documentTitle: 'foo' })
  })
})
