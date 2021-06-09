import { render, screen } from '@testing-library/react'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useHistory } from 'react-router-dom'
import { mocked } from 'ts-jest/utils'
import type { History } from 'history'
import type { PropsWithChildren } from 'react'
import environment from '../../../environment'
import useDocumentTitle from '../../utils/useDocumentTitle'
import EditorialPage from './EditorialPage'

jest.mock('react-helmet', () => ({ Helmet: ({ children }: PropsWithChildren<any>) => children }))
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
    useMatomoMock.mockReturnValue({ trackPageView: mockTrackPageView } as unknown as ReturnType<
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

  it('displays the loading indicator', () => {
    render(<EditorialPage loading error={false} />)
    expect(screen.getByTestId('loadingSpinner')).toBeInTheDocument()
  })

  it('sets the canonical url', () => {
    render(<EditorialPage loading={false} error={false} link={{ pathname: '/this.is.alink' }} />)

    expect(screen.getByTestId('canonicalUrl')).toHaveAttribute(
      'href',
      `${environment.ROOT}this.is.alink`,
    )
  })

  it('sets the document title and send to analytics', () => {
    const { rerender } = render(<EditorialPage loading={false} error={false} documentTitle="" />)

    expect(mockSetDocumentTitle).not.toHaveBeenCalled()
    expect(mockTrackPageView).not.toHaveBeenCalled()

    rerender(<EditorialPage loading={false} error={false} documentTitle="foo" />)

    expect(mockSetDocumentTitle).toHaveBeenCalledWith('foo')
    expect(mockTrackPageView).toHaveBeenCalledWith({ documentTitle: 'foo' })
  })
})
