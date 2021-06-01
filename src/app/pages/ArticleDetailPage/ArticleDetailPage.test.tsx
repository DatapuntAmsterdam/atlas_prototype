import usePromise from '@amsterdam/use-promise'
import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import withAppContext from '../../utils/withAppContext'
import ArticleDetailPage from './ArticleDetailPage'

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

    render(withAppContext(<ArticleDetailPage />))

    expect(screen.getByTestId('loadingSpinner')).toBeInTheDocument()
  })

  it('should render an error alert', () => {
    mockedUsePromise.mockReturnValue({
      status: 'rejected',
      reason: new Error('Whoopsie'),
    })

    render(withAppContext(<ArticleDetailPage />))

    expect(screen.getByTestId('errorMessage')).toBeInTheDocument()
  })
})
