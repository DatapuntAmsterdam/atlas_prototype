import React from 'react';
import { shallow } from 'enzyme';
import NoDetailsAvailable from './NoDetailsAvailable';

describe('NoDetailsAvailable', () => {
  it('should render everything', () => {
    const component = shallow(<NoDetailsAvailable />);
    expect(component).toMatchSnapshot();
  });
});
