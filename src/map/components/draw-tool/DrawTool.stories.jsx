import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies

import DrawTool from './DrawTool';
import { DRAWING_MODE } from '../../services/draw-tool/draw-tool-config';

const toggleDrawing = action('toggleDrawing');
const onClearDrawing = action('onClearDrawing');

const defaultProps = {
  onClearDrawing,
  isEnabled: false,
  toggleDrawing,
  shapeDistanceTxt: '12.3 m',
  shapeMarkers: 0
};

storiesOf('Map/DrawTool', module)
  .add('Disabled tool', () => (
    <DrawTool
      {...defaultProps}
      drawingMode={DRAWING_MODE.NONE}
    />
  ))
  .add('Line summary', () => (
    <DrawTool
      {...defaultProps}
      drawingMode={DRAWING_MODE.NONE}
      shapeMarkers={2}
    />
  ))
  .add('Remaining markers warning', () => (
    <DrawTool
      {...defaultProps}
      drawingMode={DRAWING_MODE.DRAW}
      isEnabled
      shapeMarkers={10}
    />
  ));
