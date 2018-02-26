import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies

import PointsAvailable from './PointsAvailable';

storiesOf('Map/DrawTool/PointsAvailable', module)
  .add('no markers left', () => (
    <PointsAvailable
      markersLeft={0}
    />
  ))
  .add('1 marker left', () => (
    <PointsAvailable
      markersLeft={1}
    />
  ))
  .add('multiple markers left', () => (
    <PointsAvailable
      markersLeft={2}
    />
  ));
