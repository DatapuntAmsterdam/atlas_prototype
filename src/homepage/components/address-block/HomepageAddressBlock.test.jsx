import React from 'react';
import { shallow } from 'enzyme';

import HomepageAddressBlock from './HomepageAddressBlock';

describe('HomepageAddressBlock', () => {
  it('should render links', () => {
    const wrapper = shallow(<HomepageAddressBlock />);

    expect(wrapper).toMatchSnapshot();
  });
});
