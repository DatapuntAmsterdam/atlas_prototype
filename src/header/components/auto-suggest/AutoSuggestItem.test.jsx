import React from 'react';
import { shallow } from 'enzyme';
import AutoSuggestItem from './AutoSuggestItem';

describe('AutoSuggestItem', () => {
  it('should render the item', () => {
    const props = {
      isActive: false,
      onSuggestionSelection: jest.fn(),
      content: 'Dam 10',
      query: 'dam'
    };
    const wrapper = shallow(
      <AutoSuggestItem {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});

