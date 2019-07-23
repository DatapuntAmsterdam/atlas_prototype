import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { actionsCreator } from '../react-reducers';

export const AppStateContext = createContext();
export const AppStateProvider = ({ reducer, initialState, children }) => (
  <AppStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </AppStateContext.Provider>
);

AppStateProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialState: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired
};

export const useAppReducer = (reducerKey, context) => {
  const [state, dispatch] = context || useContext(AppStateContext);

  return reducerKey ? [state[reducerKey], actionsCreator(dispatch, reducerKey)] : [state, dispatch];
};
