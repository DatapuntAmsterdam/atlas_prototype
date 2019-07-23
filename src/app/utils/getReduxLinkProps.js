import { selectLocationState } from 'redux-first-router';
import toUrl from 'redux-first-router-link/dist/toUrl';

const preventDefault = (fn) => (e) => {
  const openInNewTab = (e.ctrlKey || e.metaKey);
  if (!openInNewTab) {
    e.preventDefault();
    fn();
  }
};

export default (actionCreatorFn) => {
  const state = window.reduxStore.getState();
  const dispatch = window.reduxStore.dispatch;
  const { routesMap } = selectLocationState(state);
  return {
    href: toUrl(actionCreatorFn, routesMap),
    onClick: preventDefault(() => dispatch(actionCreatorFn))
  };
};
