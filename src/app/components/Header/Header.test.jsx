import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe('Header', () => {
  it('should render', () => {
    const props = {
      embedPreviewMode: false,
      hasEmbedButton: true,
      hasMaxWidth: true,
      hasPrintButton: true,
      homePage: false,
      printMode: false,
      printOrEmbedMode: false,
      user: {}
    };

    const component = shallow(
      <Header {...props} />
    );
    expect(component).toMatchSnapshot();
  });
});
