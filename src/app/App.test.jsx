import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import App from './App';

describe('App', () => {
  it('should render', () => {
    const store = configureMockStore()({
      ui: {
        isEmbed: false,
        isEmbedPreview: false,
        isPrintMode: false
      },
      map: {
        view: 'home'
      },
      user: {}
    });
    const component = shallow(
      <App />, { context: { store } }
    ).dive();
    expect(component).toMatchSnapshot();
  });
});
