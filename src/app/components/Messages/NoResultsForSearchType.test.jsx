import React from 'react';
import { shallow } from 'enzyme';
import NoResultsForSearchType from './NoResultsForSearchType';

describe('NoResultsForSearchType', () => {
  it('should render', () => {
    const component = shallow(
      <NoResultsForSearchType message="Tip: this is the message" />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render with login message', () => {
    const component = shallow(
      <NoResultsForSearchType message="Tip: this is the message" authMessage />
    );
    expect(component).toMatchSnapshot();
  });
});
