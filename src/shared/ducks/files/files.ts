import { createSelector } from 'reselect'
import { typedAction } from '../../../app/utils/typedAction'
import { RootState } from '../../../reducers/root'
import paramsRegistry from '../../../store/params-registry'

export const REDUCER_KEY = 'files'

const RESET_FILE = `files/RESET_FILE`

export const resetFile = () => typedAction(RESET_FILE)

type FilesAction = ReturnType<typeof resetFile>

export interface FilesState {
  fileName: string
  fileUrl: string
  type: string
}

export const initialState: FilesState = {
  fileName: '',
  fileUrl: '',
  type: 'default',
}

export default function filesReducer(state = initialState, action: FilesAction): FilesState {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
  } as FilesState

  switch (action.type) {
    case RESET_FILE:
      return {
        ...initialState,
      }

    default:
      return enrichedState
  }
}

export const getFiles = (state: RootState) => state[REDUCER_KEY]

export const getFileName = createSelector(getFiles, (state) => state.fileName)
export const getFileUrl = createSelector(getFiles, (state) => state.fileUrl)
