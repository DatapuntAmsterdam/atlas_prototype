import React from 'react';
import { shallow } from 'enzyme';
import NotAuthorizedMessage from './NotAuthorizedMessage';

describe('NotAuthorizedMessage', () => {
  it('should render everything', () => {
    const component = shallow(<NotAuthorizedMessage scopeError />);
    expect(component).toMatchSnapshot();
  });
});
