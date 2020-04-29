import { SET_CURRENT_FILE } from './constants'

// eslint-disable-next-line import/prefer-default-export
export const setCurrentFile = (payload) => ({
  type: SET_CURRENT_FILE,
  payload,
})
