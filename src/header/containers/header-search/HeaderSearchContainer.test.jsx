import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import HeaderSearchContainer from './HeaderSearchContainer';
import { getSuggestionsAction, getTypedQuery } from '../../ducks/auto-suggest/auto-suggest';

import { clearMapDetail } from '../../../shared/ducks/detail/actions';
import { ROUTER_NAMESPACE } from '../../../app/routes';
import PAGES from '../../../app/pages';
import { emptyFilters } from '../../../shared/ducks/filters/filters';

import {
  toDataSearchQuery,
  toDatasetDetail,
  toDatasetSearch,
  toDataSuggestion
} from '../../../store/redux-first-router/actions';
import { CLEAR_MAP_DETAIL } from '../../../shared/ducks/detail/constants';
import PARAMETERS from '../../../store/parameters';
import { VIEW_MODE } from '../../../shared/ducks/ui/ui';

jest.mock('../../ducks/auto-suggest/auto-suggest');
jest.mock('../../../shared/ducks/detail/actions');

describe('HeaderSearchContainer', () => {
  beforeEach(() => {
    getSuggestionsAction.mockImplementation(() => ({ type: 'getSuggestionsAction' }));
    clearMapDetail.mockImplementation((endpoint) => ({
      type: CLEAR_MAP_DETAIL,
      payload: endpoint
    }));
  });

  afterEach(() => {
    getSuggestionsAction.mockReset();
    clearMapDetail.mockReset();
  });

  const initialState = {
    dataQuerySearch: {
      query: 'dam'
    },
    ui: {
      viewMode: VIEW_MODE.SPLIT
    },
    autoSuggest: {
      count: 6,
      suggestions: [
        {
          content: [
            {
              uri: 'bag/openbareruimte/03630000003186/',
              label: 'Dam',
              index: 0,
              category: 'Straatnamen'
            },
            {
              uri: 'bag/openbareruimte/03630000001038/',
              label: 'Damloperspad',
              index: 1,
              category: 'Straatnamen'
            },
            {
              uri: 'bag/openbareruimte/03630000003187/',
              label: 'Damrak',
              index: 2,
              category: 'Straatnamen'
            }
          ],
          label: 'Straatnamen'
        },
        {
          content: [
            {
              uri: 'monumenten/monumenten/8e8ae1dd-78a2-4a5f-841d-1870631b7e33/',
              label: 'Damrak 1',
              index: 3,
              category: 'Monumenten'
            },
            {
              uri: 'monumenten/monumenten/aa3f9081-2ac4-49ea-95d2-0aad7aecd883/',
              label: 'Dam 10',
              index: 4,
              category: 'Monumenten'
            },
            {
              uri: 'monumenten/monumenten/f93e31ba-89eb-4784-87e1-d32c33b5236d/',
              label: 'Damrak 15',
              index: 5,
              category: 'Monumenten'
            }
          ],
          label: 'Monumenten'
        }
      ],
      typedQuery: 'dam'
    }
  };

  it('does nothing on initial load', () => {
    const store = configureMockStore()({ ...initialState });
    jest.spyOn(store, 'dispatch');
    shallow(<HeaderSearchContainer />, { context: { store } }).dive();

    expect(getSuggestionsAction).not.toHaveBeenCalled();
    expect(clearMapDetail).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  describe('onSuggestionSelection', () => {
    it('opens data from the suggestions', () => {
      const store = configureMockStore()({ ...initialState });
      const shouldOpenInNewWindow = false;
      const suggestionMock = {
        uri: 'bag/openbareruimte/GgCm07EqNVIpwQ',
        label: 'Damloperspad',
        index: 1,
        category: 'Straatnamen'
      };

      jest.spyOn(store, 'dispatch');
      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onSuggestionSelection(suggestionMock, shouldOpenInNewWindow);

      expect(store.dispatch).toHaveBeenCalledWith(
        toDataSuggestion({
          endpoint: suggestionMock.uri,
          category: suggestionMock.category,
          typedQuery: ''
        }, VIEW_MODE.SPLIT)
      );
    });

    it('opens a dataset from the suggestions', () => {
      const store = configureMockStore()({ ...initialState });
      const shouldOpenInNewWindow = false;
      const selectedSuggestion = {
        uri: 'dcatd/datasets/GgCm07EqNVIpwQ',
        label: 'Damloperspad',
        index: 1,
        category: 'Straatnamen'
      };

      jest.spyOn(store, 'dispatch');
      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onSuggestionSelection(selectedSuggestion, shouldOpenInNewWindow);

      expect(store.dispatch).toHaveBeenCalledWith(
        toDatasetDetail({ id: 'GgCm07EqNVIpwQ', typedQuery: '' })
      );
    });

    it('does call to open new window if shouldOpenInNewWindow is true', () => {
      // TODO: refactor, allow opening in new window.
      const store = configureMockStore()({ ...initialState });
      const shouldOpenInNewWindow = true;
      const selectedSuggestion = {
        uri: 'bag/openbareruimte/03630000001038/',
        label: 'Damloperspad',
        index: 1,
        category: 'Straatnamen'
      };

      jest.spyOn(store, 'dispatch');

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onSuggestionSelection(selectedSuggestion, shouldOpenInNewWindow);

      expect(clearMapDetail).not.toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('onFormSubmit', () => {
    it('does no call if there is an active suggestion', () => {
      // in this case the 'onSuggestionSelection()' should be called, but this logic is in
      // the AutoSuggest component.

      const store = configureMockStore()({
        ...initialState,
        autoSuggest: {
          activeSuggestion: {
            uri: 'monumenten/monumenten/8e8ae1dd-78a2-4a5f-841d-1870631b7e33/',
            label: 'Damrak 1',
            index: 3,
            category: 'Monumenten'
          }
        },
        dataSelection: {
          view: 'NOT_CARDS'
        },
        page: {},
        ui: {
          viewMode: VIEW_MODE.SPLIT,
          isMapFullscreen: true
        }
      });

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      jest.spyOn(store, 'dispatch');
      headerSearch.instance().onFormSubmit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does data search', () => {
      const query = 'foo';
      getTypedQuery.mockImplementation(() => query);
      const store = configureMockStore()({
        ...initialState,
        autoSuggest: {
          activeSuggestion: {
            index: -1
          },
          typedQuery: query
        },
        currentPage: PAGES.HOME
      });
      jest.spyOn(store, 'dispatch');

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onFormSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(emptyFilters());
      expect(store.dispatch).toHaveBeenCalledWith(toDataSearchQuery({
        [PARAMETERS.QUERY]: query
      }, false, true));
    });

    it('does dataset search', () => {
      const query = 'foo';
      getTypedQuery.mockImplementation(() => query);
      const store = configureMockStore()({
        ...initialState,
        autoSuggest: {
          activeSuggestion: {
            index: -1
          },
          typedQuery: query
        },
        location: {
          type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS}`
        }
      });
      jest.spyOn(store, 'dispatch');

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onFormSubmit();
      expect(store.dispatch).toHaveBeenCalledWith(toDatasetSearch({
        [PARAMETERS.QUERY]: query
      }, false, true));
    });
  });

  describe('onGetSuggestions', () => {
    it('should be called on componentDidMount id prefillQuery prop is set', () => {
      const store = configureMockStore()({
        ...initialState,
        search: {
          query: 'i\'m set'
        }
      });

      shallow(
        <HeaderSearchContainer />, { context: { store } }
      ).dive();

      expect(getSuggestionsAction).toHaveBeenCalled();
    });

    it('should not be called on componentDidMount id prefillQuery prop is not set', () => {
      const store = configureMockStore()({
        ...initialState
      });

      shallow(
        <HeaderSearchContainer />, { context: { store } }
      ).dive();

      expect(getSuggestionsAction).not.toHaveBeenCalled();
    });
  });

  describe('componentDidUpdate', () => {
    it('should not call onGetSuggestions without a query', () => {
      global.suggestionToLoadUri = true;
      global.opener = true;
      const store = configureMockStore()({
        ...initialState
      });

      const wrapper = shallow(<HeaderSearchContainer />, { context: { store } }).dive();
      wrapper.setProps({
        prefillQuery: '123',
        isMapActive: true
      });

      expect(getSuggestionsAction).not.toHaveBeenCalled();
    });

    it('should not call getSuggestions', () => {
      global.suggestionToLoadUri = true;
      global.opener = true;
      const store = configureMockStore()({
        ...initialState
      });

      const wrapper = shallow(<HeaderSearchContainer />, { context: { store } }).dive();
      wrapper.setProps({
        prefillQuery: '',
        pageName: '',
        isMapActive: false
      });

      expect(getSuggestionsAction).not.toHaveBeenCalledWith();
    });
  });
});
