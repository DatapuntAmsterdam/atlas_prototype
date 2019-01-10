import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PanoramaContainer from './PanoramaContainer';
import { getOrientation, loadScene } from '../services/marzipano/marzipano';
import { fetchPanoramaRequest, setView } from '../ducks/actions';
import PANORAMA_VIEW from '../ducks/panorama-view';
import { getPanorama, getPanoramaLocation, getReference } from '../ducks/selectors';

jest.mock('../../map/ducks/map/map-selectors');
jest.mock('../services/marzipano/marzipano');
jest.mock('../ducks/selectors');

describe('PanoramaContainer', () => {
  const initialState = {};
  const store = configureMockStore()({ ...initialState });
  const props = {
    isFullscreen: false,
    detailReference: []
  };

  getPanorama.mockImplementation(() => ({
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
  }));
  getReference.mockImplementation(() => []);
  getPanoramaLocation.mockImplementation(() => []);

  beforeEach(() => {
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    store.dispatch.mockClear();
  });

  it('should render everything', () => {
    const wrapper = shallow(
      <PanoramaContainer {...props} />, { context: { store } }
    ).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render StatusBar when panoramaState is complete', () => {
    const wrapper = shallow(
      <PanoramaContainer {...props} />, { context: { store } }
    ).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it('should load new scene when panorama image information changes', () => {
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
    expect(store.dispatch).toHaveBeenCalledWith(setView(`${PANORAMA_VIEW.PANO}`));

    wrapper.setProps({ isFullscreen: true });

    wrapper.instance().toggleFullscreen();
    expect(store.dispatch).toHaveBeenCalledWith(setView(`${PANORAMA_VIEW.MAP_PANO}`));
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
