import { routing } from '../../../app/routes';
import { FETCH_DETAIL, initialState, SET_VIEW, SHOW_DETAIL, REDUCER_KEY } from './constants';
import paramsRegistry from '../../../store/params-registry';
import PAGES from '../../../app/pages';
import { shouldResetState } from '../../../store/redux-first-router/actions';

export { REDUCER_KEY as DETAIL };

export default function detailReducer(state = initialState, action) {
  if (shouldResetState(action, [PAGES.DATA_DETAIL])) {
    return initialState;
  }

  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action)
  };
  switch (action.type) {
    case routing.dataDetail.type: {
      const { id: idString, type, subtype } = action.payload;

      // Package `redux-first-router` doesn't support parameters starting with numbers
      // So prefix `id` is added to numerical IDs and is filtered out here
      const id = idString.startsWith('id') ? idString.substr(2) : idString;

      return {
        ...enrichedState,
        id,
        type,
        subtype
      };
    }

    case FETCH_DETAIL:
      return {
        ...enrichedState,
        display: undefined,
        geometry: undefined,
        isLoading: true
      };

    case SHOW_DETAIL:
      return {
        ...enrichedState,
        display: action.payload.display,
        geometry: action.payload.geometry,
        isLoading: false
      };

    case SET_VIEW:
      return {
        ...enrichedState,
        view: action.payload
      };

    default:
      return enrichedState;
  }
}
