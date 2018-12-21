import React from 'react';
import { shallow } from 'enzyme';
import MoreResultsWhenLoggedIn from './MoreResultsWhenLoggedIn';

describe('MoreResultsWhenLoggedIn', () => {
  it('should render everything', () => {
    const component = shallow(<MoreResultsWhenLoggedIn />);
    expect(component).toMatchSnapshot();
  });
});
