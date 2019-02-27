import React from 'react';
import { shallow } from 'enzyme';
import MapDetailParkeervak from './MapDetailParkeervak';


describe('MapDetailParkeervak', () => {
  it('should render everything', () => {
    const item = {
      straatnaam: 'Straatnaam',
      type: 'type',
      bord: 'bord'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailParkeervak
        panoUrl="panoUrl"
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        item={item}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
