import { mocked } from 'ts-jest/utils'
import usePromise from '@amsterdam/use-promise'
import { fireEvent, render } from '@testing-library/react'
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

    const { getByTestId } = render(withAppContext(<PublicationDetailPage />))

    expect(getByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()
  })

  it('should call the useDownload hook when user tries to download publication', () => {
    mockedUsePromise.mockReturnValue({ status: 'fulfilled', value: mockData })
    const { getByTestId } = render(withAppContext(<PublicationDetailPage />))

    expect(getByTestId('documentCover')).toBeDefined()

    fireEvent.click(getByTestId('documentCover').querySelector('button') as Element)

    expect(mockDownloadFile).toHaveBeenCalled()
  })
})
