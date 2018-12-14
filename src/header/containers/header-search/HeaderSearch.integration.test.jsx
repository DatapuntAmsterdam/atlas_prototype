import React from 'react';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { mount } from 'enzyme';
import createSagaMiddleware from 'redux-saga';

import HeaderSearchContainer from './HeaderSearchContainer';
import headerSearchMock from './HeaderSearch.integration.mock';

import watchFetchSuggestions from '../../../header/sagas/auto-suggest/auto-suggest';
import AutoSuggestReducer from '../../ducks/auto-suggest/auto-suggest';
import DataSelectionReducer from '../../../shared/ducks/data-selection/reducer';

import * as search from '../../../shared/ducks/data-search/actions';
import * as details from '../../../shared/ducks/detail/reducer';
import { fetchDetail } from '../../../shared/ducks/detail/actions';

// mock authentication call, as this is not part of this test scope
jest.mock('../../../shared/services/auth/auth');

// In the code several reducers are combined, resulting in a "key: reducer" structure
// to make sure the state is as much as the running app, we put this one reducer in the same
// structure with the combineReducers
const mainReducer = combineReducers({
  autoSuggest: AutoSuggestReducer
});

let store;
let enhancer;

describe('HeaderSearchContainer', () => {
  beforeEach(() => {
    global._paq = [];
    // create real store with saga. The code does not seem to update a mock-store correctly
    const sagaMiddleware = createSagaMiddleware();
    enhancer = compose(
      applyMiddleware(sagaMiddleware)
    );
    store = createStore(mainReducer, {}, enhancer);
    // Only run the saga which is in scope for this test
    sagaMiddleware.run(watchFetchSuggestions);

    fetch.mockResponse(JSON.stringify(headerSearchMock.mockFetchResponse), { status: 200 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets and formats the data correctly before setting it to the state', () => {
    const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

    const input = headerSearch.find('input');
    input.simulate('focus');
    input.instance().value = 'dijk';
    input.simulate('change');
    // first state change is from the REQUEST
    expect(store.getState()).toMatchSnapshot();

    return new Promise((resolve) =>
      // nextTick to ensure all async actions are done
      process.nextTick(() => {
        // second state change is from the SUCCESS (with suggestions)
        expect(store.getState()).toMatchSnapshot();
        resolve();
      })
    );
  });

  it('allows the user to clear the query and suggestions by clicking on the clear button', () => {
    const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

    const input = headerSearch.find('input');
    input.simulate('focus');
    input.instance().value = 'dijk';
    input.simulate('change');


    return new Promise((resolve) =>
      // nextTick to ensure all async actions are done
      process.nextTick(() => {
        headerSearch.update();
        expect(headerSearch).toMatchSnapshot(); // suggestions are visible
        expect(store.getState()).toMatchSnapshot();
        const clearButton = headerSearch.find('.auto-suggest__clear');
        clearButton.simulate('click');
        headerSearch.update();
        expect(headerSearch).toMatchSnapshot(); // suggestions are not visible
        expect(store.getState()).toMatchSnapshot(); // query cleared
        resolve();
      })
    );
  });

  describe('auto-suggest dropdown', () => {
    it('allows the user to use the keyboard to dismiss the suggestions', () => {
      const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

      const input = headerSearch.find('input');
      input.simulate('focus');
      input.instance().value = 'dijk';
      input.simulate('change');

      return new Promise((resolve) =>
        // nextTick to ensure all async actions are done
        process.nextTick(() => {
          headerSearch.update();
          input.simulate('keyDown', { key: 'escape', keyCode: 27, which: 27 });
          headerSearch.update();
          expect(headerSearch).toMatchSnapshot(); // suggestions are not visible
          resolve();
        })
      );
    });

    it('allows the user to use the keyboard to navigate and select suggestions', () => {
      jest.spyOn(details, 'fetchDetail');
      const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

      const input = headerSearch.find('input');
      input.simulate('focus');
      input.instance().value = 'dijk';
      input.simulate('change');


      return new Promise((resolve) =>
        // nextTick to ensure all async actions are done
        process.nextTick(() => {
          headerSearch.update();
          input.simulate('keyDown', { key: 'Down arrow', keyCode: 40, which: 40 });
          headerSearch.update();
          expect(headerSearch).toMatchSnapshot(); // first suggestion is active
          input.simulate('keyDown', { key: 'Enter', keyCode: 13, which: 13 });
          headerSearch.update();
          expect(fetchDetail)
            .toHaveBeenCalledWith('https://acc.api.data.amsterdam.nl/bag/openbareruimte/03630000001528/');
          // dropdown should be hidden and value should be cleared
          expect(headerSearch).toMatchSnapshot();
          resolve();
        })
      );
    });

    it('allows the user click on a suggestion', () => {
      jest.spyOn(details, 'fetchDetail');
      const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

      const input = headerSearch.find('input');
      input.simulate('focus');
      input.instance().value = 'dijk';
      input.simulate('change');


      return new Promise((resolve) =>
        // nextTick to ensure all async actions are done
        process.nextTick(() => {
          headerSearch.update();
          const autoSuggestItem = headerSearch.find('.auto-suggest__dropdown-item').first();
          autoSuggestItem.simulate('click');
          headerSearch.update();
          expect(fetchDetail)
            .toHaveBeenCalledWith('https://acc.api.data.amsterdam.nl/bag/openbareruimte/03630000001528/');
          // dropdown should be hidden and value should be cleared
          expect(headerSearch).toMatchSnapshot();
          resolve();
        })
      );
    });

    it('allows the user to dismiss the suggestions when blurring the input field', () => {
      jest.useFakeTimers();
      const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

      const input = headerSearch.find('input');
      input.simulate('focus');
      input.instance().value = 'dijk';
      input.simulate('change');

      return new Promise((resolve) =>
        // nextTick to ensure all async actions are done
        process.nextTick(() => {
          headerSearch.update();
          input.simulate('blur');
          jest.runAllTimers();
          headerSearch.update();
          expect(headerSearch).toMatchSnapshot(); // suggestions are not visible
          resolve();
        })
      );
    });

    it('updates the input value accordingly to the users input', () => {
      const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

      const input = headerSearch.find('input');
      input.simulate('focus');
      input.instance().value = 'dijk';
      input.simulate('change');

      // timeout to ensure all async actions are done
      return new Promise((resolve) =>
        // nextTick to ensure all async actions are done
        process.nextTick(() => {
          headerSearch.update();
          expect(input.instance().value).toBe('dijk');

          // First suggestion
          input.simulate('keyDown', { key: 'Down arrow', keyCode: 40, which: 40 });
          headerSearch.update();
          expect(input.instance().value).toBe('Dijkbraak');

          // Back to input field
          input.simulate('keyDown', { key: 'Up arrow', keyCode: 38, which: 38 });
          headerSearch.update();
          expect(input.instance().value).toBe('dijk');

          // Second suggestion
          input.simulate('keyDown', { key: 'Down arrow', keyCode: 40, which: 40 });
          input.simulate('keyDown', { key: 'Down arrow', keyCode: 40, which: 40 });
          headerSearch.update();
          expect(input.instance().value).toBe('Dijkdwarsstraat');

          // dismiss auto-suggest
          input.simulate('keyDown', { key: 'Escape', keyCode: 27, which: 27 });
          headerSearch.update();
          expect(input.instance().value).toBe('dijk');
          resolve();
        })
      );
    });
  });

  describe('submitting the search form', () => {
    it('regular search', () => {
      jest.spyOn(search, 'fetchSearchResultsByQuery');
      jest.spyOn(search, 'fetchDataSelection');
      jest.spyOn(store, 'dispatch');

      const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

      const input = headerSearch.find('input');
      input.simulate('focus');
      input.instance().value = 'dijk';
      input.simulate('change');

      const submit = headerSearch.find('form');
      submit.simulate('submit');

      expect(store.dispatch).toHaveBeenCalled();
      expect(search.fetchSearchResultsByQuery).toHaveBeenCalledWith('dijk');
      expect(search.fetchDataSelection).not.toHaveBeenCalled();
      expect(input.instance().value).toBe('dijk');
    });

    it('dataset search', () => {
      // override the store set in the beforeEach(), as we need
      // the dataSelection value for this test
      const combinedReducer = combineReducers({
        autoSuggest: AutoSuggestReducer,
        dataSelection: DataSelectionReducer
      });

      const newState = {
        dataSelection: {
          view: 'CATALOG'
        }
      };
      store = createStore(combinedReducer, newState, enhancer);

      jest.spyOn(search, 'fetchSearchResultsByQuery');
      jest.spyOn(search, 'fetchDataSelection');
      jest.spyOn(store, 'dispatch');

      const headerSearch = mount(<HeaderSearchContainer />, { context: { store } });

      const input = headerSearch.find('input');
      input.simulate('focus');
      input.instance().value = 'dijk';
      input.simulate('change');

      const submit = headerSearch.find('form');
      submit.simulate('submit');

      expect(store.dispatch).toHaveBeenCalled();
      expect(search.fetchDataSelection).toHaveBeenCalledWith('dijk');
      expect(search.fetchSearchResultsByQuery).not.toHaveBeenCalled();
      expect(input.instance().value).toBe('dijk');
    });
  });
});
