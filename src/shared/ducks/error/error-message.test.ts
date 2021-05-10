import { RootState } from '../../../reducers/root'
import errorMessageReducer, {
  ErrorType,
  getMessage,
  hasGlobalError,
  resetGlobalError,
  setGlobalError,
  ERROR_MESSAGES,
} from './error-message'

describe('errorMessageReducer', () => {
  it('sets the error globally', () => {
    expect(errorMessageReducer(undefined, setGlobalError(ErrorType.General))).toEqual({
      hasErrors: true,
      types: {
        [ErrorType.General]: true,
      },
    })
  })

  it('resets the errors', () => {
    let state = errorMessageReducer(undefined, setGlobalError(ErrorType.General))
    state = errorMessageReducer(state, resetGlobalError())

    expect(state).toEqual({
      hasErrors: false,
      types: {},
    })
  })
})

describe('getMessage', () => {
  it('gets the error message', () => {
    expect(getMessage({ error: { types: { [ErrorType.NotFound]: true } } } as RootState)).toEqual(
      ERROR_MESSAGES[ErrorType.NotFound],
    )
  })

  it('gets the general message if no type is active', () => {
    expect(getMessage({ error: { types: {} } } as RootState)).toEqual(
      ERROR_MESSAGES[ErrorType.General],
    )

    expect(getMessage({ error: { types: { [ErrorType.NotFound]: false } } } as RootState)).toEqual(
      ERROR_MESSAGES[ErrorType.General],
    )
  })

  it('gets the general message if an unknown type is present', () => {
    expect(getMessage({ error: { types: { foo: false } } } as unknown as RootState)).toEqual(
      ERROR_MESSAGES[ErrorType.General],
    )
  })
})

describe('hasGlobalError', () => {
  it('returns if the global state has errors', () => {
    expect(hasGlobalError({ error: { hasErrors: true } } as RootState)).toEqual(true)
    expect(hasGlobalError({ error: { hasErrors: false } } as RootState)).toEqual(false)
  })
})
