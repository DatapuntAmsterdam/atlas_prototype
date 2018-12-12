import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PanoramaContainer from '../PanoramaContainer';
import { getHotspots, getPanorama, getReference } from '../../../shared/ducks/panorama/selectors';
import { isPrintMode } from '../../../shared/ducks/ui/ui';
import { getMapCenter } from '../../../map/ducks/map/map-selectors';

jest.mock('../../../shared/ducks/panorama/selectors');
jest.mock('../../../shared/ducks/ui/ui');
jest.mock('../../../map/ducks/map/map-selectors');

describe('PanoramaContainer', () => {
  it('should render', () => {
    const store = configureMockStore()();
    getPanorama.mockReturnValue(({}));
    getHotspots.mockReturnValue([]);
    getReference.mockReturnValue([123, 'bag', 'verblijfplaats']);
    isPrintMode.mockReturnValue(false);
    getMapCenter.mockReturnValue([123, 321]);
    const component = shallow(
      <PanoramaContainer isFullscreen={false} />,
      { context: { store } }
    ).dive();
    expect(component).toMatchSnapshot();
  });
});
