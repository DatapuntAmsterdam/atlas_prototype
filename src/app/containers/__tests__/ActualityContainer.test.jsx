import React from 'react';
import { shallow } from 'enzyme';
import ActualityContainer from '../ActualityContainer';

describe('ActualityContainer', () => {
  it('should render', () => {
    const component = shallow(<ActualityContainer />);
    expect(component).toMatchSnapshot();
  });
});
