import { Column, Row } from '@amsterdam/asc-ui'
import React from 'react'
import NavigationBlock from '../NavigationBlock'

export default {
  title: 'Dataportaal/Homepage/NavigationBlock',

  decorators: [
    (storyFn: () => React.ReactNode) => <div style={{ padding: '40px 10px' }}>{storyFn()}</div>,
  ],
}

export const DefaultState = () => (
  <Row hasMargin={false}>
    <Column
      className="column-with-heading"
      span={{ small: 1, medium: 2, big: 6, large: 5, xLarge: 5 }}
      push={{ small: 0, medium: 0, big: 0, large: 7, xLarge: 7 }}
    >
      <NavigationBlock />
    </Column>
  </Row>
)
