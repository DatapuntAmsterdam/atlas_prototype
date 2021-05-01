import { mocked } from 'ts-jest/utils'
import usePromise from '@amsterdam/use-promise'
import { fireEvent, render, screen, within } from '@testing-library/react'
import useDownload from '../../utils/useDownload'
import PublicationDetailPage from './PublicationDetailPage'
import withAppContext from '../../utils/withAppContext'
import { LOADING_SPINNER_TEST_ID } from '../../components/LoadingSpinner/LoadingSpinner'

jest.mock('../../utils/useDownload')

const mockedUseDownload = mocked(useDownload, true)

jest.mock('@amsterdam/use-promise', () => {
  const originalModule = jest.requireActual('@amsterdam/use-promise')

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
  }
})

const mockedUsePromise = mocked(usePromise)

describe('PublicationDetailPage', () => {
  const mockDownloadFile = jest.fn()
  const mockData = {
    fetchData: jest.fn(),
    results: {
      drupal_internal__nid: 100,
      title: 'This is a title',
      created: '2015-05-05',
      body: '<p>body text</p>',
      field_file_size: 'file size',
      field_file_type: 'pdf',
      field_publication_source: 'source',
      field_publication_intro: 'intro',
      included: [
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
      ],
    },
  }

  beforeEach(() => {
    mockedUseDownload.mockImplementation(() => [false, mockDownloadFile])
  })

  it('should render the spinner when the request is loading', () => {
    mockedUsePromise.mockReturnValue({ status: 'pending' })

    render(withAppContext(<PublicationDetailPage />))

    expect(screen.getByTestId(LOADING_SPINNER_TEST_ID)).toBeInTheDocument()
  })

  it('should call the useDownload hook when user tries to download publication', () => {
    mockedUsePromise.mockReturnValue({ status: 'fulfilled', value: mockData })
    render(withAppContext(<PublicationDetailPage />))

    expect(screen.getByTestId('documentCover')).toBeInTheDocument()

    fireEvent.click(within(screen.getByTestId('documentCover')).getByRole('button'))

    expect(mockDownloadFile).toHaveBeenCalled()
  })
})
