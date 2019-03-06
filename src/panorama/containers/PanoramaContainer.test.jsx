import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PanoramaContainer from './PanoramaContainer';
import { getOrientation, loadScene } from '../services/marzipano/marzipano';
import { fetchPanoramaHotspotRequest } from '../ducks/actions';
import {
  getDetailReference,
  getLabelObjectByTags,
  getPanorama,
  getPanoramaLocation,
  getPanoramaTags
} from '../ducks/selectors';
import { getMapOverlays } from '../../map/ducks/map/selectors';
import { setViewMode, VIEW_MODE } from '../../shared/ducks/ui/ui';

jest.mock('../../map/ducks/map/selectors');
jest.mock('../services/marzipano/marzipano');
jest.mock('../ducks/selectors');
jest.mock('../../shared/ducks/ui/ui');

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
    location: [1, 2]
  }));
  getLabelObjectByTags.mockImplementation(() => ({ label: 'Meest recent' }));
  getPanoramaTags.mockImplementation(() => (['mission-bi']));
  setViewMode.mockImplementation(() => ({ type: 'some type' }));
  getDetailReference.mockImplementation(() => []);
  getMapOverlays.mockImplementation(() => ([]));
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
    expect(store.dispatch).toHaveBeenCalledWith(fetchPanoramaHotspotRequest({ id: 'XYZ' }));
  });

  it('should toggle size of panorama image', () => {
    jest.spyOn(store, 'dispatch');
    const wrapper = shallow(
      <PanoramaContainer {...props} />, { context: { store } }
    ).dive();

    expect(wrapper.instance().props.isFullscreen).toBe(false);

    wrapper.instance().toggleFullscreen();
    expect(store.dispatch).toHaveBeenCalledWith(setViewMode(VIEW_MODE.FULL));

    wrapper.setProps({ isFullscreen: true });

    wrapper.instance().toggleFullscreen();
    expect(store.dispatch).toHaveBeenCalledWith(setViewMode(VIEW_MODE.SPLIT));
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
