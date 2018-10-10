import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import DrawToolContainer from './DrawToolContainer';
import drawToolConfig from '../../services/draw-tool/draw-tool.config';

import { setDataSelectionGeometryFilter } from '../../../shared/ducks/data-selection/data-selection';
import { setPageName } from '../../../shared/ducks/page/page';
import { setMapFullscreen } from '../../../shared/ducks/ui/ui';
import { setStraatbeeldOff } from '../../../shared/ducks/straatbeeld/straatbeeld';

import { isEnabled } from '../../services/draw-tool/draw-tool';
import {
  MAP_CLEAR,
  mapClear,
  mapEndDrawing,
  mapStartDrawing,
  mapUpdateShape
} from '../../ducks/map/map';

jest.mock('../../services/draw-tool/draw-tool');

describe('DrawToolContainer', () => {
  let store;
  let wrapper;
  let wrapperInstance;
  const initialState = {
    map: {
      baseLayer: '',
      overlays: [],
      drawingMode: 'none',
      shapeMarkers: 0,
      shapeDistanceTxt: ''
    },
    dataSelection: null,
    ui: { isMapFullscreen: true }
  };

  const props = {
    currentShape: { markers: [] },
    leafletInstance: {},
    toggleDrawing: jest.fn(),
    cancel: jest.fn(),
    initialize: jest.fn(),
    setPolygon: jest.fn(),
    dataSelection: null
  };

  const markers = [
    [
      52.37690230194533,
      4.892827975989587
    ],
    [
      52.376176949302526,
      4.892688030418347
    ],
    [
      52.37600183542343,
      4.894145613811505
    ]
  ];

  const polygonMock = {
    type: null,
    markers: [
      [
        52.37658883244462,
        4.893694991480347
      ],
      [
        52.3769023,
        4.892828
      ],
      [
        52.3761769,
        4.892688
      ],
      [
        52.3760018,
        4.8941456
      ]
    ],
    markersMaxCount: 40,
    area: 5482.935446954233,
    areaTxt: '5.482,9 m²',
    distance: 322.5467512423164,
    distanceTxt: '322,5 m'
  };

  beforeEach(() => {
    store = configureMockStore()({ ...initialState });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render DrawToolContainer', () => {
    const setPolygonMock = jest.spyOn(props, 'setPolygon');
    const initializeMock = jest.spyOn(props, 'initialize');
    wrapper = shallow(
      <DrawToolContainer {...props} />, { context: { store } }
    ).dive().dive();
    wrapperInstance = wrapper.instance();
    expect(wrapper).toMatchSnapshot();
    expect(setPolygonMock).toHaveBeenCalled();
    expect(initializeMock).toHaveBeenCalled();
    expect(wrapperInstance.state).toEqual({
      drawingMode: drawToolConfig.DRAWING_MODE.NONE,
      previousMarkers: [],
      dataSelection: null
    });
  });

  describe('DrawToolContainer methods', () => {
    let spy;
    beforeEach(() => {
      spy = jest.spyOn(store, 'dispatch');
      wrapper = shallow(
        <DrawToolContainer {...props} />, { context: { store } }
      ).dive().dive();
      wrapperInstance = wrapper.instance();
    });

    afterEach(() => {
      spy.mockReset();
    });

    describe('componentWillReceiveProps', () => {
      it('should reset the polygon when there is no geometry or dataSelection', () => {
        wrapperInstance.props.setPolygon.mockClear();

        wrapperInstance.componentWillReceiveProps({
          ...props,
          drawingMode: drawToolConfig.DRAWING_MODE.NONE,
          geometry: [],
          dataSelection: null
        });

        expect(wrapperInstance.props.setPolygon).toHaveBeenCalledWith([]);
      });

      it('should save the markers as previous markers', () => {
        const geometry = [...markers.filter((item, index) => index < 2)];
        wrapperInstance.props.setPolygon.mockClear();
        wrapper.setProps({ geometry });
        const oldState = wrapperInstance.state;

        wrapperInstance.componentWillReceiveProps({
          ...props,
          geometry,
          drawingMode: drawToolConfig.DRAWING_MODE.NONE
        });

        expect(wrapperInstance.state).toEqual({
          ...oldState,
          drawingMode: drawToolConfig.DRAWING_MODE.NONE,
          previousMarkers: [...geometry]
        });
        expect(wrapperInstance.props.setPolygon).toHaveBeenCalled();
      });

      it('should not cancel after the drawingMode is changed to draw', () => {
        wrapper.setState({ drawingMode: drawToolConfig.DRAWING_MODE.NONE });
        wrapperInstance.props.cancel.mockClear();
        wrapperInstance.componentWillReceiveProps({
          ...props,
          drawingMode: drawToolConfig.DRAWING_MODE.DRAW
        });
        expect(wrapperInstance.props.cancel).not.toHaveBeenCalled();
        expect(wrapperInstance.state.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.DRAW);
      });

      it('should cancel after the drawingMode is changed to NONE', () => {
        wrapper.setState({ drawingMode: drawToolConfig.DRAWING_MODE.DRAW });
        wrapperInstance.props.cancel.mockClear();
        wrapperInstance.componentWillReceiveProps({
          ...props,
          drawingMode: drawToolConfig.DRAWING_MODE.NONE
        });
        expect(wrapperInstance.props.cancel).toHaveBeenCalled();
        expect(wrapperInstance.state.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.NONE);
      });
    });

    describe('componentWillUnmount', () => {
      it(`should dispatch ${MAP_CLEAR}`, () => {
        wrapper.unmount();
        expect(store.dispatch).toHaveBeenCalledWith(mapClear());
      });
    });

    describe('onDrawingMode', () => {
      it('should dispatch MAP_END_DRAWING when the drawing mode set to NONE', () => {
        const oldState = wrapperInstance.state;
        wrapperInstance.onDrawingMode(drawToolConfig.DRAWING_MODE.NONE);
        expect(wrapperInstance.state).toEqual(oldState);
        expect(store.dispatch).toHaveBeenCalledWith(mapEndDrawing());
      });

      it('should dispatch MAP_START_DRAWING when the drawing mode set to DRAW', () => {
        wrapper.setProps({ currentShape: { markers } });
        const oldState = wrapperInstance.state;
        wrapperInstance.onDrawingMode(drawToolConfig.DRAWING_MODE.DRAW);
        expect(wrapperInstance.state).toEqual({ ...oldState, previousMarkers: markers });
        expect(store.dispatch).toHaveBeenCalledWith(
          mapStartDrawing({ drawingMode: drawToolConfig.DRAWING_MODE.DRAW })
        );
      });

      it('should dispatch MAP_START_DRAWING when the drawing mode set to EDIT', () => {
        wrapper.setProps({ currentShape: { markers } });
        const oldState = wrapperInstance.state;
        wrapperInstance.onDrawingMode(drawToolConfig.DRAWING_MODE.EDIT);
        expect(wrapperInstance.state).toEqual({ ...oldState, previousMarkers: markers });
        expect(store.dispatch).toHaveBeenCalledWith(
          mapStartDrawing({ drawingMode: drawToolConfig.DRAWING_MODE.EDIT })
        );
      });
    });

    describe('getMarkers', () => {
      it('should return an empty array when the geometry and the dataSelection are empty', () => {
        wrapper.setProps({ geometry: [], dataSelection: {} });
        const result = wrapperInstance.getMarkers();
        expect(result).toEqual([]);
      });

      it('should return the geometry when it is set', () => {
        const geometry = [...markers];
        wrapper.setProps({ geometry, dataSelection: {} });
        const result = wrapperInstance.getMarkers();
        expect(result).toEqual(geometry);
      });

      it('should return the dataSelection when the geometry is not set', () => {
        const geometryFilterMarkers = [...markers];
        wrapper.setProps({
          geometry: [],
          dataSelection: { geometryFilter: { markers: geometryFilterMarkers } }
        });
        const result = wrapperInstance.getMarkers();
        expect(result).toEqual(geometryFilterMarkers);
      });
    });

    describe('onFinishShape', () => {
      it('should ignore the action when the polygon has only one point', () => {
        const polygon = {
          ...polygonMock,
          markers: [markers[0]]
        };
        const oldState = wrapperInstance.state;
        wrapperInstance.onFinishShape(polygon);
        expect(wrapperInstance.state).toEqual(oldState);
        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('should ignore the action when the polygon is not changed', () => {
        const polygon = {
          ...polygonMock
        };
        wrapper.setState({ previousMarkers: polygonMock.markers });
        const oldState = wrapperInstance.state;
        wrapperInstance.onFinishShape(polygon);
        expect(wrapperInstance.state).toEqual(oldState);
        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('should dispatch MAP_END_DRAWING when the polygon has only two points', () => {
        const polygon = {
          ...polygonMock,
          markers: [...markers.filter((item, index) => index < 2)]
        };
        wrapperInstance.onFinishShape(polygon);
        expect(store.dispatch).toHaveBeenCalledWith(mapEndDrawing({ polygon }));
      });

      it('should set the geometry filter when the polygon is changed', () => {
        const polygon = { ...polygonMock };
        const geometryFilter = {
          markers: polygon.markers,
          description: `${polygon.distanceTxt} en ${polygon.areaTxt}`
        };

        wrapperInstance.onFinishShape(polygon);

        expect(store.dispatch).toHaveBeenCalledWith(setDataSelectionGeometryFilter(geometryFilter));
        expect(store.dispatch).toHaveBeenCalledWith(setStraatbeeldOff());
        expect(store.dispatch).toHaveBeenCalledWith(mapEndDrawing({ polygon }));
        expect(store.dispatch).toHaveBeenCalledWith(setPageName({ name: null }));
        expect(store.dispatch).toHaveBeenCalledWith(setMapFullscreen({ isMapFullscreen: false }));
      });
    });

    describe('onUpdateShape', () => {
      it('should call onMapUpdateShape', () => {
        const newShape = { ...polygonMock };
        const expected = {
          shapeMarkers: newShape.markers.length,
          shapeDistanceTxt: newShape.distanceTxt,
          shapeAreaTxt: newShape.areaTxt
        };

        wrapperInstance.onUpdateShape(newShape);

        expect(store.dispatch).toHaveBeenCalledWith(mapUpdateShape(expected));
      });
    });

    describe('setPolygon', () => {
      it('should be ignored when drawing is not enabled', () => {
        wrapperInstance.props.setPolygon.mockClear();
        isEnabled.mockImplementation(() => true);
        wrapperInstance.setPolygon();
        expect(wrapperInstance.props.setPolygon).not.toHaveBeenCalled();
      });
    });
  });
});
