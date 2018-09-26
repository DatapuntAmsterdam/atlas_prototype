import createHistory from 'history/createBrowserHistory';

import queryStringParser from './shared/services/query-string-parser/query-string-parser';
import ACTIONS from './shared/actions';


export const locationHandler = (store) => (location) => {
  const hash = location.hash; // '#?foo=bar&abc=xyz'
  let params;
  if (hash.length > 0 && hash[0] === '#') {
    const search = hash.slice(1); // '?foo=bar&abc=xyz'
    params = queryStringParser(search);
  } else {
    params = {};
  }

  store.dispatch({
    type: ACTIONS.URL_CHANGE,
    payload: params
  });
};

class History {
  constructor() {
    this.history = createHistory({
      hashType: 'noslash'
    });
  }

  initialize(store) {
    const storeLocationHandler = locationHandler(store);

    this.history.listen(storeLocationHandler);

    // Handle first page load URL
    storeLocationHandler(window.location);
  }
}

const historyInstance = new History();
export default historyInstance;
export const { history } = historyInstance;
