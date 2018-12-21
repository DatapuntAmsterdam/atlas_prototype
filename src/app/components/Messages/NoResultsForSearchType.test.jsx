import React from 'react';
import { shallow } from 'enzyme';
import NoResultsForSearchType from './NoResultsForSearchType';

describe('NoResultsForSearchType', () => {
  it('should render everything', () => {
    const component = shallow(<NoResultsForSearchType message="Tip: this is the message" />);
    expect(component).toMatchSnapshot();
  });
});
