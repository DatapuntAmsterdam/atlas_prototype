import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import usePromise from '@amsterdam/use-promise'
import ArticleDetailPage from './ArticleDetailPage'
import { LOADING_SPINNER_TEST_ID } from '../../components/LoadingSpinner/LoadingSpinner'
import withAppContext from '../../utils/withAppContext'
import { ERROR_MESSAGE_TEST_ID } from '../../components/ErrorMessage/ErrorMessage'

jest.mock('@amsterdam/use-promise', () => {
  const originalModule = jest.requireActual('@amsterdam/use-promise')

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
  }
})

const mockedUsePromise = mocked(usePromise)

describe('ArticleDetailPage', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the spinner when the request is loading', () => {
    mockedUsePromise.mockReturnValue({ status: 'pending' })

    const { getByTestId } = render(withAppContext(<ArticleDetailPage />))

    expect(getByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()
  })

  it('should render an error alert', () => {
    mockedUsePromise.mockReturnValue({
      status: 'rejected',
      reason: new Error('Whoopsie'),
    })

    const { getByTestId } = render(withAppContext(<ArticleDetailPage />))

    expect(getByTestId(ERROR_MESSAGE_TEST_ID)).toBeDefined()
  })
})
