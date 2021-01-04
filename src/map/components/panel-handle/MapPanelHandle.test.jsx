import { shallow } from 'enzyme'

import MapPanelHandle from './MapPanelHandle'

describe('MapPanelHandle', () => {
  it('should render children by default', () => {
    const mapPanelHandle = shallow(
      <MapPanelHandle isMapPanelHandleVisible onMapPanelHandleToggle={() => {}}>
        <div className="children-test" />
      </MapPanelHandle>,
    )

    expect(mapPanelHandle.find('.children-test').length).toBe(1)
    expect(mapPanelHandle).toMatchSnapshot()
  })

  it('should hide children on click', () => {
    const onButtonClickSpy = jest.fn()
    const mapPanelHandle = shallow(
      <MapPanelHandle isMapPanelHandleVisible={false} onMapPanelHandleToggle={onButtonClickSpy}>
        <div className="children-test" />
      </MapPanelHandle>,
    )

    mapPanelHandle.find('.map-panel-handle__toggle').simulate('click')
    expect(onButtonClickSpy).toHaveBeenCalledTimes(1)
    expect(mapPanelHandle.find('.children-test').length).toBe(0)
  })
})
