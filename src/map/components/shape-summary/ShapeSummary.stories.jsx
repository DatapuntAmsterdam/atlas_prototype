import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies

import ShapeSummary from './ShapeSummary';

storiesOf('Map/DrawTool/ShapeSummary', module)
  .add('line summary', () => (
    <ShapeSummary
      shapeDistanceTxt="12,3 m"
      onClearDrawing={action('onClearDrawing')}
    />
  ));
