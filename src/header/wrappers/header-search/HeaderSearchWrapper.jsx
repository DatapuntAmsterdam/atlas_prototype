import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { ThemeProvider } from '@datapunt/asc-ui';

import HeaderSearchContainer from '../../containers/header-search/HeaderSearchContainer';

const HeaderSearchWrapper = (props) => (
  <ThemeProvider>
    <Provider store={window.reduxStore}>
      <HeaderSearchContainer {...props} />
    </Provider>
  </ThemeProvider>
);

export default HeaderSearchWrapper;

window.React = window.React || React;
// istanbul ignore next
window.render = window.render || render;
window.HeaderSearchWrapper = HeaderSearchWrapper;
