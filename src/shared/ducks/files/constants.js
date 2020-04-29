export const REDUCER_KEY = 'files'

export const SET_CURRENT_FILE = `${REDUCER_KEY}/SET_CURRENT_FILE`
export const SET_CURRENT_TYPE = `${REDUCER_KEY}/SET_CURRENT_TYPE`

export const initialState = {
  fileName: '',
  type: 'default',
}
