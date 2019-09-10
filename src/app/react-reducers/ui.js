/* eslint-disable no-case-declarations */
export const REDUCER_KEY = 'ui'
export const SET_BACKDROP = `${REDUCER_KEY}/SET_BACKDROP`

export const initialState = {
  backdropKeys: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    // Increase or decrease the number of times the backdrop is triggered.
    // We do this so other triggers of show / hide backdrops won't overrule others while the
    // backdrop is active
    case SET_BACKDROP:
      const { key, open } = action.payload
      return {
        ...state,
        backdropKeys: state.backdropKeys.includes(key)
          ? state.backdropKeys.filter(backdropKey => (!open ? backdropKey !== key : backdropKey))
          : [...state.backdropKeys, ...(open ? [key] : [])],
      }
    default:
      return state
  }
}

export const actions = {
  setBackDrop: SET_BACKDROP,
}
