import React from 'react';
import { shallow } from 'enzyme';
import Hotspot from './Hotspot';

describe('Hotspot', () => {
  it('should render', () => {
    const props = {
      year: '2020',
      size: 9,
      angle: 9
    };

    const component = shallow(
      <Hotspot {...props} />
    );
    expect(component).toMatchSnapshot();
  });
});
