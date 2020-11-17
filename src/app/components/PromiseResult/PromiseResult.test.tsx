import { ThemeProvider } from '@amsterdam/asc-ui'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import { AuthError } from '../../../shared/services/api/errors'
import usePromise, { PromiseFulfilledResult, PromiseStatus } from '../../utils/usePromise'
import AuthAlert from '../Alerts/AuthAlert'
import PromiseResult from './PromiseResult'

jest.mock('../Alerts/AuthAlert')
jest.mock('../../utils/usePromise')

const mockedAuthAlert = mocked(AuthAlert)
const mockedUsePromise = mocked(usePromise)

describe('PromiseResult', () => {
  beforeEach(() => {
    mockedAuthAlert.mockClear()
    mockedUsePromise.mockClear()
  })

  it('passes the arguments to usePromise including the retry count', () => {
    mockedUsePromise.mockReturnValue({
      status: PromiseStatus.Pending,
    })

    const factory = () => Promise.resolve(null)
    const deps = ['foo', 'bar']

    render(
      <PromiseResult factory={factory} deps={deps}>
        {() => null}
      </PromiseResult>,
    )

    expect(mockedUsePromise).toBeCalledWith(factory, [...deps, 0])
  })

  it('renders children when the result is resolved', () => {
    const value: PromiseFulfilledResult<string> = {
      status: PromiseStatus.Fulfilled,
      value: 'Test',
    }

    mockedUsePromise.mockReturnValue(value)

    const factory = () => Promise.resolve(null)
    const mockedChildren = jest.fn().mockReturnValue(null)

    render(<PromiseResult factory={factory}>{mockedChildren}</PromiseResult>)

    expect(mockedChildren).toBeCalledWith(value)
  })

  it('renders a loading spinner when the result is pending', () => {
    mockedUsePromise.mockReturnValue({
      status: PromiseStatus.Pending,
    })

    const factory = () => Promise.resolve(null)
    const { getByTestId } = render(<PromiseResult factory={factory}>{() => null}</PromiseResult>)

    expect(getByTestId('loading-spinner')).toBeDefined()
  })

  it('renders an error message when the result is rejected', () => {
    mockedUsePromise.mockReturnValue({
      status: PromiseStatus.Rejected,
      error: new Error('Whoopsie'),
    })

    const factory = () => Promise.resolve(null)
    const { getByTestId } = render(
      <ThemeProvider>
        <PromiseResult factory={factory}>{() => null}</PromiseResult>
      </ThemeProvider>,
    )

    expect(getByTestId('error-message')).toBeDefined()
  })

  it('triggers a retry when the user clicks the button in the error message', () => {
    mockedUsePromise.mockReturnValue({
      status: PromiseStatus.Rejected,
      error: new Error('Whoopsie'),
    })

    const factory = () => Promise.resolve(null)
    const { getByText } = render(
      <ThemeProvider>
        <PromiseResult factory={factory}>{() => null}</PromiseResult>
      </ThemeProvider>,
    )

    fireEvent.click(getByText('Probeer opnieuw'))

    expect(mockedUsePromise).toBeCalledWith(factory, [1])
  })

  it('renders an alert when the result is rejected with an unauthorized error', () => {
    mockedUsePromise.mockReturnValue({
      status: PromiseStatus.Rejected,
      error: new AuthError(401, 'Whoopsie'),
    })

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockedAuthAlert.mockImplementation(({ 'data-testid': testId }) => <div data-testid={testId} />)

    const factory = () => Promise.resolve(null)
    const { getByTestId } = render(<PromiseResult factory={factory}>{() => null}</PromiseResult>)

    expect(getByTestId('auth-alert')).toBeDefined()
  })
})
