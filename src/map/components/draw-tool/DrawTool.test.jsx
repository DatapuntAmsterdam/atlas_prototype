import React from 'react';
import { shallow } from 'enzyme';

import DrawTool from './DrawTool';
import drawToolConfig from '../../services/draw-tool/draw-tool-config';

describe('DrawTool', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      isEnabled: false,
      toggleDrawing: jest.fn(),
      onClearDrawing: jest.fn(),
      drawingMode: drawToolConfig.DRAWING_MODE.NONE,
      shapeMarkers: 0,
      shapeDistanceTxt: 'myDistanceTxt'
    };
  });

  it('should render toggle drawing', () => {
    const wrapper = shallow(<DrawTool {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render summary for 2 points', () => {
    const wrapper = shallow((
      <DrawTool
        {...defaultProps}
        shapeMarkers={2}
      />
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render summary when tool is enabled', () => {
    const wrapper = shallow((
      <DrawTool
        {...defaultProps}
        isEnabled
        shapeMarkers={2}
      />
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('should render points available if near max points', () => {
    const wrapper = shallow((
      <DrawTool
        {...defaultProps}
        isEnabled
        shapeMarkers={10}
      />
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render points available if tool is disabled', () => {
    const wrapper = shallow((
      <DrawTool
        {...defaultProps}
        shapeMarkers={10}
      />
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
