import React from 'react';
import { shallow } from 'enzyme';

import ToggleDrawing from './ToggleDrawing';
import drawToolConfig from '../../services/draw-tool/draw-tool-config';

describe('ToggleDrawing', () => {
  let toggleDrawing;

  beforeEach(() => {
    toggleDrawing = jest.fn();
  });

  it('should trigger toggle drawing on when clicked', () => {
    const wrapper = shallow(
      <ToggleDrawing
        drawingMode={drawToolConfig.DRAWING_MODE.NONE}
        shapeMarkers={0}
        toggleDrawing={toggleDrawing}
      />
    );
    wrapper.find('button').at(0).simulate('click');
    expect(toggleDrawing).toHaveBeenCalled();
  });

  it('should render with drawing mode none and no markers', () => {
    const wrapper = shallow(
      <ToggleDrawing
        drawingMode={drawToolConfig.DRAWING_MODE.NONE}
        shapeMarkers={0}
        toggleDrawing={toggleDrawing}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with drawing mode none and 3 markers showing "Opnieuw tekenen"', () => {
    const wrapper = shallow(
      <ToggleDrawing
        drawingMode={drawToolConfig.DRAWING_MODE.NONE}
        shapeMarkers={3}
        toggleDrawing={toggleDrawing}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with drawing mode draw and 3 markers showing "Eindig tekenen"', () => {
    const wrapper = shallow(
      <ToggleDrawing
        drawingMode={drawToolConfig.DRAWING_MODE.DRAW}
        shapeMarkers={3}
        toggleDrawing={toggleDrawing}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
