import React from 'react';
import { shallow } from 'enzyme';

import MapDetailOplaadpunt from './MapDetailOplaadpunt';

describe('MapDetailOplaadpunt', () => {
  it('should render everything', () => {
    const oplaadpunt = {
      label: 'Foo',
      address: 'Foo foo',
      capacity: 'Foo',
      connectorType: 'Foo',
      status: 'Foo',
      quantity: '8',
      type: 'Monument type'
    };

    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailOplaadpunt
        panoUrl="panoUrl"
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        oplaadpunt={oplaadpunt}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
