import usePromise from '@amsterdam/use-promise'
import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import withAppContext from '../../utils/withAppContext'
import SpecialDetailPage from './SpecialDetailPage'

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

    expect(screen.getByTestId('loadingSpinner')).toBeInTheDocument()
  })

  it('should render an error alert', () => {
    mockedUsePromise.mockReturnValue({
      status: 'rejected',
      reason: new Error('Whoopsie'),
    })

    render(withAppContext(<SpecialDetailPage />))

    expect(screen.getByTestId('errorMessage')).toBeInTheDocument()
  })
})
