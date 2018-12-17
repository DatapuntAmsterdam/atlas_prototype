import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PanoramaContainer from './PanoramaContainer';
import { getPanorama } from '../ducks/panorama';
import { getLocationLatLong } from '../../map/ducks/map/map-selectors';

jest.mock('../ducks/panorama');
jest.mock('../../map/ducks/map/map-selectors');
jest.mock('../services/marzipano/marzipano');

describe('PanoramaContainer', () => {
  let initialState;
  beforeEach(() => {
    initialState = {};
    getPanorama.mockReturnValue(({}));
    getLocationLatLong.mockReturnValue([]);
  });

  it('should render', () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(
      <PanoramaContainer
        isFullscreen={false}
      />,
      { context: { store } }
    ).dive();
    expect(component).toMatchSnapshot();
  });
});
