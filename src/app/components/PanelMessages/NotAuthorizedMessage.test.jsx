import React from 'react';
import { shallow } from 'enzyme';
import NotAuthorizedPanel from './NotAuthorizedMessage';

describe('NotAuthorizedPanel', () => {
  it('should render everything', () => {
    const component = shallow(<NotAuthorizedPanel />);
    expect(component).toMatchSnapshot();
  });
});
