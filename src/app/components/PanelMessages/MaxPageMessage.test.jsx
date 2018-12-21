import React from 'react';
import { shallow } from 'enzyme';
import MaxPageMessage from './MaxPageMessage';

describe('MaxPageMessage', () => {
  it('should render everything', () => {
    const component = shallow(<MaxPageMessage maxAvailablePages={100} />);
    expect(component).toMatchSnapshot();
  });
});
