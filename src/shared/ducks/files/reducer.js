import paramsRegistry from '../../../store/params-registry'
import { initialState, REDUCER_KEY, SET_CURRENT_FILE, SET_CURRENT_TYPE } from './constants'

export { REDUCER_KEY as FILES_REDUCER }

const reducer = (state = initialState, action) => {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
  }
  switch (action.type) {
    case SET_CURRENT_FILE:
      return {
        ...enrichedState,
        fileName: action.payload,
      }

    case SET_CURRENT_TYPE: {
      return {
        ...enrichedState,
        type: action.payload,
      }
    }

    default:
      return enrichedState
  }
}

export default reducer
