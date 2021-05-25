import { combineReducers } from 'redux'
import SearchPageReducer, {
  REDUCER_KEY as SEARCH,
} from '../../app/pages/SearchPage/SearchPageDucks'
import errorMessageReducer, { REDUCER_KEY as ERROR } from './error/error-message'
import UserReducer, { REDUCER_KEY as USER } from './user/user'
import { LOCATION } from '../../store/redux-first-router/constants'

const rootReducer =
  (routeReducer: any) =>
  (oldState: any = {}, action: any) => {
    // Use combine reducer for new reducers
    const newRootReducer = combineReducers({
      [ERROR]: errorMessageReducer,
      [USER]: UserReducer,
      [LOCATION]: routeReducer,
      [SEARCH]: SearchPageReducer,
    })

    // Combine legacy and new reducer states
    return newRootReducer(oldState, action)
  }

export default rootReducer

export type RootState = ReturnType<ReturnType<typeof rootReducer>>
