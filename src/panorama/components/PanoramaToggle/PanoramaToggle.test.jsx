import React from 'react';
import { shallow } from 'enzyme';

import { setPanoramaTags } from '../../ducks/actions';

import PanoramaToggle from './PanoramaToggle';

jest.mock('../../ducks/actions');

describe('PanoramaToggle', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <PanoramaToggle
        {...{
          heading: 999,
          currentLabel: 'Meest recent',
          location: [2, 3],
          setPanoramaTags: jest.fn
        }}
      />
    );
  });

  setPanoramaTags.mockReturnValue({ type: '' });

  it('should render everything', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('menu opens on button click', () => {
    expect(wrapper.instance().state.showMenu).toBe(false);

    wrapper.find('.c-panorama-toggle__button').simulate('click');

    expect(wrapper.instance().state.showMenu).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('fires panoramaRequest on button click in menu', () => {
    wrapper.instance().setState({ showMenu: true });
    wrapper.update();

    wrapper.find('.c-panorama-toggle__item').at(1).simulate('click');
    expect(wrapper.instance().state.showMenu).toBe(false);
  });
});
