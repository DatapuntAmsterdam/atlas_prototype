import React from 'react';
import { shallow } from 'enzyme';

import MapDetailWinkelgebied from './MapDetailWinkelgebied';

describe('MapDetailWinkelgebied', () => {
  it('should render everything', () => {
    const winkelgebied = {
      label: 'Foo',
      category: 'Foo foo'
    };

    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailWinkelgebied
        panoUrl="panoUrl"
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        winkelgebied={winkelgebied}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
