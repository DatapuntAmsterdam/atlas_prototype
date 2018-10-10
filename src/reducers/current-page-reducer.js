import { routing } from '../app/routes';
import PAGES from '../app/pages';


const getCurrentPage = (actionType) => {
  const key = Object.keys(routing).find((route) => routing[route].type === actionType);
  return key && routing[key].page;
};

const currentPageReducer = (state = PAGES.HOME, action = {}) => (
  getCurrentPage(action.type) ?
    getCurrentPage(action.type) :
    state
);

export default currentPageReducer;
