export const SET_PAGE_NAME = 'SET_PAGE_NAME';

const initialState = {
  name: null  // eg: 'home'
};

export default function PageReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PAGE_NAME:
      return {
        ...state,
        name: action.payload && action.payload.name
      };

    default:
      return state;
  }
}

export const setPageName = (payload) => ({ type: SET_PAGE_NAME, payload });

window.reducers = window.reducers || {};
window.reducers.PageReducer = PageReducer;
