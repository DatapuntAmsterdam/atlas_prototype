import React from 'react'
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react'
import { boolean, withKnobs } from '@storybook/addon-knobs'
import { Row, Column } from '@datapunt/asc-ui'
import NavigationBlock from '../NavigationBlock'

storiesOf('Dataportaal/Frontpage', module)
  .addDecorator(storyFn => (
    <div style={{ padding: '40px 0px', background: 'rgb(250,250,250)' }}>{storyFn()}</div>
  ))
  .addDecorator(withKnobs)
  .add('Navigation links block', () => (
    <Row hasMargin={false}>
      <Column
        className="column-with-heading"
        span={{ small: 1, medium: 2, big: 6, large: 5, xLarge: 5 }}
        push={{ small: 0, medium: 0, big: 0, large: 7, xLarge: 7 }}
      >
        <NavigationBlock
          loading={boolean('laodong', false)}
          showError={boolean('error', false)}
          hasMargin
        />
      </Column>
    </Row>
  ))
