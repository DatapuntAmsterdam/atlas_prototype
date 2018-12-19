import React from 'react';
import { mount, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PanoramaContainer from './PanoramaContainer';
import { fetchPanoramaRequest, setPanoramaOrientation } from '../ducks/panorama';
import { loadScene, getOrientation } from '../services/marzipano/marzipano';

jest.mock('../../map/ducks/map/map-selectors');
jest.mock('../services/marzipano/marzipano');

describe('PanoramaContainer', () => {
  const initialState = {};
  const store = configureMockStore()({ ...initialState });
  const props = {
    isFullscreen: false,
    panoramaState: {
      id: 'ABC',
      heading: 999,
      image: 'ABC_IMAGE.jpg',
      date: '2012-12-12T00:00:00.000Z',
      location: [1, 2],
      history: {
        year: 2020,
        label: 'ABC',
        missionType: 'ABC'
      }
    }
  };

  it('should render everything', () => {
    const wrapper = mount(
      <PanoramaContainer {...props} />, { context: { store } }
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render StatusBar when panoramaState is complete', () => {
    const wrapper = shallow(
      <PanoramaContainer {...props} />, { context: { store } }
    ).dive();

    wrapper.setProps({
      panoramaState: {
        date: '2012-12-12T00:00:00.000Z',
        location: [],
        history: {},
        heading: 999
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should set panorama orientation onMouseDown', () => {
    jest.spyOn(store, 'dispatch');
    getOrientation.mockReturnValue({ heading: 999, pitch: 10, fov: 80 });
    const wrapper = shallow(
      <PanoramaContainer {...props} />, { context: { store } }
    ).dive();

    wrapper.find('.js-marzipano-viewer').simulate('mousedown');
    expect(store.dispatch).toHaveBeenCalledWith(
      setPanoramaOrientation({ heading: 999, pitch: 10, fov: 80 })
    );
  });

  it('should load new scene when panorama image information changes', () => {
    jest.spyOn(store, 'dispatch');
    getOrientation.mockReturnValue({ heading: 999, pitch: 10, fov: 80 });
    const wrapper = shallow(
      <PanoramaContainer {...props} />, { context: { store } }
    ).dive();

    wrapper.instance().hotspotClickHandler('XYZ');
    expect(store.dispatch).toHaveBeenCalledWith(fetchPanoramaRequest({ id: 'XYZ' }));
  });

  it('should toggle size of panorama image', () => {
    jest.spyOn(store, 'dispatch');
    const wrapper = shallow(
      <PanoramaContainer {...props} />, { context: { store } }
    ).dive();

    expect(wrapper.instance().props.isFullscreen).toBe(false);

    wrapper.instance().toggleFullscreen();
    expect(store.dispatch).toHaveBeenCalledTimes(3);

    wrapper.setProps({ isFullscreen: true });

    wrapper.instance().toggleFullscreen();
    expect(store.dispatch).toHaveBeenCalledTimes(4);
  });

  it('should load new scene when panorama image information changes', () => {
    loadScene.mockImplementation();
    const wrapper = shallow(
      <PanoramaContainer {...props} />, { context: { store } }
    ).dive();

    wrapper.setProps({ panoramaState: { image: 'ABC_IMAGE_2.jpg' } });
    wrapper.instance().setState({ update: true });
    wrapper.update();

    expect(wrapper.instance().props.panoramaState.image).toBe('ABC_IMAGE_2.jpg');
    expect(loadScene).toHaveBeenCalled();
  });
});
