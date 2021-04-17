import { useMatomo } from '@datapunt/matomo-tracker-react'
import { mount, shallow } from 'enzyme'
import { History } from 'history'
// eslint-disable-next-line import/no-extraneous-dependencies
import { useHistory } from 'react-router'
import { mocked } from 'ts-jest/utils'
import environment from '../../../environment'
import useDocumentTitle from '../../utils/useDocumentTitle'
import EditorialPage from './EditorialPage'

jest.mock('@datapunt/matomo-tracker-react')
jest.mock('react-router')
jest.mock('../../utils/useDocumentTitle')

const useMatomoMock = mocked(useMatomo)
const useHistoryMock = mocked(useHistory)
const useDocumentTitleMock = mocked(useDocumentTitle)

describe('EditorialPage', () => {
  const mockSetDocumentTitle = jest.fn()
  const mockTrackPageView = jest.fn()

  beforeEach(() => {
    useMatomoMock.mockReturnValue(({ trackPageView: mockTrackPageView } as unknown) as ReturnType<
      typeof useMatomo
    >)

    useHistoryMock.mockReturnValue({
      createHref: ({ pathname }) => pathname,
    } as History)

    useDocumentTitleMock.mockReturnValue({
      documentTitle: '',
      setDocumentTitle: mockSetDocumentTitle,
    })
  })

  afterEach(() => {
    useMatomoMock.mockReset()
    useHistoryMock.mockReset()
    useDocumentTitleMock.mockReset()
  })

  it('should display the loading indicator', () => {
    const component = shallow(<EditorialPage loading error={false} />).dive()
    expect(component.find('LoadingIndicator')).toBeTruthy()
  })

  it('should set the canonical url', () => {
    const component = shallow(
      <EditorialPage loading={false} error={false} link={{ pathname: '/this.is.alink' }} />,
    ).dive()

    expect(component.find('link').props().href).toBe(`${environment.ROOT}this.is.alink`)
  })

  it('should set the document title and send to analytics', () => {
    const component = mount(<EditorialPage loading={false} error={false} documentTitle="" />)

    expect(mockSetDocumentTitle).not.toHaveBeenCalled()
    expect(mockTrackPageView).not.toHaveBeenCalled()

    component.setProps({ documentTitle: 'foo' })

    expect(mockSetDocumentTitle).toHaveBeenCalledWith('foo')
    expect(mockTrackPageView).toHaveBeenCalledWith({ documentTitle: 'foo' })
  })
})
