import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PanoramaContainer from '../PanoramaContainer';
import { getHotspots, getPanorama } from '../../../shared/ducks/panorama/panorama';
import { isPrintMode } from '../../../shared/ducks/ui/ui';
import { getMapCenter } from '../../../map/ducks/map/map-selectors';

jest.mock('../../../shared/ducks/panorama/panorama');
jest.mock('../../../shared/ducks/ui/ui');
jest.mock('../../../map/ducks/map/map-selectors');

describe('PanoramaContainer', () => {
  it('should render', () => {
    const store = configureMockStore()();
    getPanorama.mockReturnValue(({}));
    getHotspots.mockReturnValue([]);
    isPrintMode.mockReturnValue(false);
    getMapCenter.mockReturnValue([123, 321]);
    const component = shallow(
      <PanoramaContainer isFullscreen={false} />,
      { context: { store } }
    ).dive();
    expect(component).toMatchSnapshot();
  });
});
