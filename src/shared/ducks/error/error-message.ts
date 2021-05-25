import { createSelector } from 'reselect'
import { typedAction } from '../../../app/utils/typedAction'
import type { RootState } from '../root'

export const REDUCER_KEY = 'error'

const RESET_GLOBAL_ERROR = 'error/RESET_GLOBAL_ERROR'
const SET_GLOBAL_ERROR = 'error/SET_GLOBAL_ERROR'

export enum ErrorType {
  General = 'GENERAL_ERROR',
  // TODO: It looks like the 'not found' error is no longer used anywhere.
  // We should get rid of it and refactor this code to simplify things.
  // A context should be a lot better than all this Redux state.
  NotFound = 'NOT_FOUND_ERROR',
}

export const resetGlobalError = () => typedAction(RESET_GLOBAL_ERROR)
export const setGlobalError = (errorType: ErrorType) => typedAction(SET_GLOBAL_ERROR, errorType)

type ErrorMessageAction = ReturnType<typeof resetGlobalError | typeof setGlobalError>

export interface ErrorMessageState {
  hasErrors: boolean
  types: { [key in ErrorType]?: boolean }
}

const initialState: ErrorMessageState = {
  hasErrors: false,
  types: {},
}

export default function errorMessageReducer(
  state = initialState,
  action: ErrorMessageAction,
): ErrorMessageState {
  switch (action.type) {
    case RESET_GLOBAL_ERROR:
      return initialState

    case SET_GLOBAL_ERROR:
      return {
        ...state,
        hasErrors: true,
        types: {
          ...state.types,
          [action.payload]: true,
        },
      }
    default:
      return state
  }
}

const getErrorState = (state: RootState) => state[REDUCER_KEY]

export const ERROR_MESSAGES = {
  [ErrorType.General]:
    'Momenteel wordt niet alle informatie getoond. Aan deze technische storing wordt gewerkt. Probeer het zodadelijk nog eens…',
  [ErrorType.NotFound]: 'Deze informatie is niet beschikbaar. Dit is reeds teruggemeld.',
}

export const getMessage = createSelector(getErrorState, (state) => {
  const errorType = Object.entries(state.types).find(([, active]) => active)?.[0]
  const defaultMessage = ERROR_MESSAGES[ErrorType.General]

  if (!errorType) {
    return defaultMessage
  }

  return ERROR_MESSAGES[errorType as ErrorType] ?? defaultMessage
})

export const hasGlobalError = createSelector(getErrorState, (error) => error.hasErrors)
