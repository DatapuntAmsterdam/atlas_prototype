import React from 'react'
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react'
import { boolean, withKnobs } from '@storybook/addon-knobs'
import { Row, Column } from '@datapunt/asc-ui'
import HighlightBlock from '../HighlightBlock'

storiesOf('Dataportaal/Frontpage', module)
  .addDecorator(withKnobs)
  .add('Highlights block', () => (
    <Row debug>
      <Column debug wrap span={{ small: 1, medium: 2, big: 6, large: 8, xLarge: 8 }}>
        <HighlightBlock loading={boolean('loading', false)} showError={boolean('error', false)} />
      </Column>
    </Row>
  ))
