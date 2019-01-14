import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme/build/index';
import HeaderSearchWrapper from './HeaderSearchWrapper';

describe('HeaderSearchWrapper', () => {
  const initialState = {
    dataQuerySearch: {
      query: 'dam'
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

  it('should render', () => {
    const store = configureMockStore()({ ...initialState });
    global.window.reduxStore = store;
    jest.spyOn(store, 'dispatch');
    const component = shallow(<HeaderSearchWrapper />, { context: { store } }).dive().dive();

    expect(component).toMatchSnapshot();
  });
});
