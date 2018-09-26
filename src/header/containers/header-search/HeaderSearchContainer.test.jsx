import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import HeaderSearchContainer from './HeaderSearchContainer';
import { getSuggestions, setActiveSuggestion, FETCH_SUGGESTIONS_REQUEST, SET_ACTIVE_SUGGESTION } from '../../ducks/auto-suggest/auto-suggest';

import { fetchDataSelection, fetchSearchResultsByQuery, FETCH_DATA_SELECTION, FETCH_SEARCH_RESULTS_BY_QUERY } from '../../ducks/search/search';

import { fetchDetail, FETCH_DETAIL } from '../../../reducers/deprecated/details';
import piwikTracker from '../../../shared/services/piwik-tracker/piwik-tracker';

jest.mock('../../ducks/auto-suggest/auto-suggest');
jest.mock('../../../reducers/deprecated/details');
jest.mock('../../../shared/services/piwik-tracker/piwik-tracker');
jest.mock('../../ducks/search/search');

describe('HeaderSearchContainer', () => {
  beforeEach(() => {
    setActiveSuggestion.mockImplementation(() => ({ type: SET_ACTIVE_SUGGESTION }));
    getSuggestions.mockImplementation(() => ({ type: FETCH_SUGGESTIONS_REQUEST }));
    fetchDetail.mockImplementation((endpoint) => ({ type: FETCH_DETAIL, payload: endpoint }));
    piwikTracker.mockImplementation(() => jest.fn());
    fetchDataSelection.mockImplementation((query) => ({
      type: FETCH_DATA_SELECTION,
      payload: query
    }));
    fetchSearchResultsByQuery.mockImplementation((query) => ({
      type: FETCH_SEARCH_RESULTS_BY_QUERY,
      payload: query
    }));
  });

  afterEach(() => {
    setActiveSuggestion.mockReset();
    getSuggestions.mockReset();
    fetchDetail.mockReset();
    piwikTracker.mockReset();
    fetchDataSelection.mockReset();
    fetchSearchResultsByQuery.mockReset();
  });

  const initialState = {
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

    expect(setActiveSuggestion).not.toHaveBeenCalled();
    expect(getSuggestions).not.toHaveBeenCalled();
    expect(fetchDetail).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  describe('onSuggestionSelection', () => {
    it('does the fetch detail dispatch upon called', () => {
      const store = configureMockStore()({ ...initialState });
      const shouldOpenInNewWindow = false;
      const selectedSuggestion = {
        uri: 'bag/openbareruimte/03630000001038/',
        label: 'Damloperspad',
        index: 1,
        category: 'Straatnamen'
      };

      jest.spyOn(store, 'dispatch');
      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onSuggestionSelection(selectedSuggestion, shouldOpenInNewWindow);

      expect(fetchDetail).toHaveBeenCalled();

      expect(store.dispatch).toHaveBeenCalledWith({
        type: FETCH_DETAIL,
        payload: 'https://acc.api.data.amsterdam.nl/bag/openbareruimte/03630000001038/'
      });
    });

    it('does call to open new window if shouldOpenInNewWindow is true', () => {
      const store = configureMockStore()({ ...initialState });
      const shouldOpenInNewWindow = true;
      const selectedSuggestion = {
        uri: 'bag/openbareruimte/03630000001038/',
        label: 'Damloperspad',
        index: 1,
        category: 'Straatnamen'
      };

      jest.spyOn(store, 'dispatch');
      global.open = () => { // eslint-disable-line arrow-body-style
        return {
          window: {}
        }; // eslint-disable-line arrow-body-style
      };
      jest.spyOn(global, 'open');

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onSuggestionSelection(selectedSuggestion, shouldOpenInNewWindow);

      expect(fetchDetail).not.toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(global.open).toHaveBeenCalled();
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
        }
      });

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onFormSubmit();

      expect(fetchDataSelection).not.toHaveBeenCalled();
      expect(fetchSearchResultsByQuery).not.toHaveBeenCalled();
    });

    it('does the "fetchSearchResultsByQuery" call', () => {
      const store = configureMockStore()({
        ...initialState,
        autoSuggest: {
          activeSuggestion: {
            index: -1
          }
        },
        dataSelection: {
          view: 'NOT_CARDS'
        }
      });

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onFormSubmit();

      expect(fetchDataSelection).not.toHaveBeenCalled();
      expect(fetchSearchResultsByQuery).toHaveBeenCalled();
    });

    it('does the "fetchDataSelection" call', () => {
      const store = configureMockStore()({
        ...initialState,
        autoSuggest: {
          activeSuggestion: {
            index: -1
          }
        },
        dataSelection: {
          view: 'CATALOG'
        }
      });

      const headerSearch = shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      headerSearch.instance().onFormSubmit();

      expect(fetchDataSelection).toHaveBeenCalled();
      expect(fetchSearchResultsByQuery).not.toHaveBeenCalled();
    });
  });

  describe('openDetailOnLoad', () => {
    it('should be called when window.suggestionToLoadUri and window.opener are true', () => {
      global.suggestionToLoadUri = true;
      global.opener = true;
      const store = configureMockStore()({
        ...initialState
      });

      shallow(<HeaderSearchContainer />, { context: { store } }).dive();

      expect(fetchDetail).toHaveBeenCalled();
    });
  });

  describe('onSuggestionActivate', () => {
    it('should call getSuggestions or setActiveSuggestion', () => {
      const store = configureMockStore()({
        ...initialState,
        search: {
          query: 'i\'m set'
        }
      });

      const wrapper = shallow(
        <HeaderSearchContainer />, { context: { store } }
      ).dive();
      wrapper.instance().onSuggestionActivate({ index: -1 });
      expect(getSuggestions).toHaveBeenCalled();

      wrapper.instance().onSuggestionActivate({ index: 0 });
      expect(setActiveSuggestion).toHaveBeenCalled();
    });
  });

  describe('onUserInput', () => {
    it('should be called when window.suggestionToLoadUri and window.opener are true', () => {
      const store = configureMockStore()({
        ...initialState,
        search: {
          query: 'i\'m set'
        }
      });

      const wrapper = shallow(
        <HeaderSearchContainer />, { context: { store } }
      ).dive();
      wrapper.instance().onUserInput('query');
      expect(getSuggestions).toHaveBeenCalledWith('query');
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

      expect(getSuggestions).toHaveBeenCalled();
    });

    it('should not be called on componentDidMount id prefillQuery prop is not set', () => {
      const store = configureMockStore()({
        ...initialState
      });

      shallow(
        <HeaderSearchContainer />, { context: { store } }
      ).dive();

      expect(getSuggestions).not.toHaveBeenCalled();
    });
  });

  describe('componentDidUpdate', () => {
    it('should be call onGetSuggestions without a query', () => {
      global.suggestionToLoadUri = true;
      global.opener = true;
      const store = configureMockStore()({
        ...initialState
      });

      const wrapper = shallow(<HeaderSearchContainer />, { context: { store } }).dive();
      wrapper.setProps({
        prefillQuery: '',
        isMapFullscreen: true
      });

      expect(getSuggestions).toHaveBeenCalledWith();
    });

    it('should be call onGetSuggestions without a query', () => {
      global.suggestionToLoadUri = true;
      global.opener = true;
      const store = configureMockStore()({
        ...initialState
      });

      const wrapper = shallow(<HeaderSearchContainer />, { context: { store } }).dive();
      wrapper.setProps({
        prefillQuery: '123',
        isMapFullscreen: true
      });

      expect(getSuggestions).toHaveBeenCalledWith('123');
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
        isMapFullscreen: false
      });

      expect(getSuggestions).not.toHaveBeenCalledWith();
    });
  });
});
