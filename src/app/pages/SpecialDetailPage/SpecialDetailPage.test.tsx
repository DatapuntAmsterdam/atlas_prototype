import { screen, render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import usePromise from '@amsterdam/use-promise'
import SpecialDetailPage from './SpecialDetailPage'
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

describe('SpecialDetailPage', () => {
  beforeEach(() => {
    mockedUsePromise.mockClear()
  })

  it('should show a loading spinner', () => {
    mockedUsePromise.mockReturnValue({ status: 'pending' })

    render(withAppContext(<SpecialDetailPage />))

    expect(screen.getByTestId(LOADING_SPINNER_TEST_ID)).toBeInTheDocument()
  })

  it('should render an error alert', () => {
    mockedUsePromise.mockReturnValue({
      status: 'rejected',
      reason: new Error('Whoopsie'),
    })

    render(withAppContext(<SpecialDetailPage />))

    expect(screen.getByTestId(ERROR_MESSAGE_TEST_ID)).toBeInTheDocument()
  })
})
