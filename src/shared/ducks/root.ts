import { combineReducers } from 'redux'
import UserReducer, { REDUCER_KEY as USER } from './user/user'

const rootReducer =
  () =>
  (oldState: any = {}, action: any) => {
    // Use combine reducer for new reducers
    const newRootReducer = combineReducers({
      [USER]: UserReducer,
    })

    // Combine legacy and new reducer states
    return newRootReducer(oldState, action)
  }

export default rootReducer

export type RootState = ReturnType<ReturnType<typeof rootReducer>>
