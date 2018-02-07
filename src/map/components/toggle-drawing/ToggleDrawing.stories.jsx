import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies

import ToggleDrawing from './ToggleDrawing';
import { DRAWING_MODE } from '../../services/draw-tool/draw-tool-config';

const toggleDrawing = action('toggleDrawing');

storiesOf('Map/DrawTool/ToggleDrawing', module)
  .add('not drawing', () => (
    <ToggleDrawing
      drawingMode={DRAWING_MODE.NONE}
      shapeMarkers={0}
      toggleDrawing={toggleDrawing}
    />
  ))
  .add('drawing completed', () => (
    <ToggleDrawing
      drawingMode={DRAWING_MODE.NONE}
      shapeMarkers={2}
      toggleDrawing={toggleDrawing}
    />
  ))
  .add('drawing', () => (
    <ToggleDrawing
      drawingMode={DRAWING_MODE.DRAW}
      shapeMarkers={0}
      toggleDrawing={toggleDrawing}
    />
  ));
