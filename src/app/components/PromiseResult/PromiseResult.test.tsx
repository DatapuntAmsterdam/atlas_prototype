import { ThemeProvider } from '@amsterdam/asc-ui'
import { fireEvent, render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import usePromise, { PromiseFulfilledResult, PromiseStatus } from '@amsterdam/use-promise'
import { AuthError } from '../../../shared/services/api/customError'
import AuthAlert from '../Alerts/AuthAlert'
import PromiseResult from './PromiseResult'
import { LOADING_SPINNER_TEST_ID } from '../LoadingSpinner/LoadingSpinner'
import { ERROR_MESSAGE_TEST_ID } from '../ErrorMessage/ErrorMessage'

jest.mock('@amsterdam/use-promise')
jest.mock('../Alerts/AuthAlert')

const mockedUsePromise = mocked(usePromise)
const mockedAuthAlert = mocked(AuthAlert)

describe('PromiseResult', () => {
  beforeEach(() => {
    mockedUsePromise.mockClear()
    mockedAuthAlert.mockClear()
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

    expect(getByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()
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

    expect(getByTestId(ERROR_MESSAGE_TEST_ID)).toBeDefined()
  })

  it('increases the retry count when the user clicks the retry button', () => {
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

  // Todo: find workaround or wait for bug to be fixed: https://github.com/facebook/jest/issues/2549
  it.skip('renders an alert when the result is rejected with an unauthorized error', () => {
    const authError = new AuthError(401, 'Whoopsie')
    mockedUsePromise.mockReturnValue({
      status: PromiseStatus.Rejected,
      error: authError,
    })

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockedAuthAlert.mockImplementation(({ 'data-testid': testId }) => <div data-testid={testId} />)

    const factory = () => Promise.resolve(null)
    const { getByTestId } = render(
      <ThemeProvider>
        <PromiseResult factory={factory}>{() => null}</PromiseResult>
      </ThemeProvider>,
    )

    expect(getByTestId('auth-alert')).toBeDefined()
  })
})
