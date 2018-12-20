import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { fetchPanoramaRequestToggle } from '../../ducks/actions';

import PanoramaToggle from './PanoramaToggle';

jest.mock('../../ducks/actions');

describe('PanoramaToggle', () => {
  const store = configureMockStore()();
  const props = {
    heading: 999,
    history: {
      year: 2020,
      label: 'ABC',
      missionType: 'ABC'
    },
    historyOptions: [
      {
        year: 2020,
        label: 'ABC',
        layerName: '2020ABC',
        missionType: 'ABC'
      },
      {
        year: 2020,
        label: 'XYZ',
        layerName: '2020XYZ',
        missionType: 'XYZ'
      }
    ],
    location: [2, 3]
  };

  fetchPanoramaRequestToggle.mockReturnValue({ type: '' });

  it('should render everything', () => {
    const wrapper = shallow(
      <PanoramaToggle {...props} />, { context: { store } }
    ).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it('menu opens on button click', () => {
    const wrapper = shallow(
      <PanoramaToggle {...props} />, { context: { store } }
    ).dive();

    expect(wrapper.instance().state.showMenu).toBe(false);

    wrapper.find('.c-panorama-toggle__button').simulate('click');

    expect(wrapper.instance().state.showMenu).toBe(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('fires panoramaRequest on button click in menu', () => {
    jest.spyOn(store, 'dispatch');
    const wrapper = shallow(
      <PanoramaToggle {...props} />, { context: { store } }
    ).dive();

    wrapper.instance().setState({ showMenu: true });
    wrapper.update();

    wrapper.find('.c-panorama-toggle__item button').at(1).simulate('click');

    expect(wrapper.instance().state.showMenu).toBe(false);
  });
});
