import { Column, Row } from '@amsterdam/asc-ui'
import React from 'react'
import HighlightBlock from '../HighlightBlock'

export default {
  title: 'Dataportaal/Homepage/HighlightBlock',

  decorators: [
    (storyFn: () => React.ReactNode) => <div style={{ padding: '40px 10px' }}>{storyFn()}</div>,
  ],
}

export const DefaultState = () => (
  <Row debug>
    <Column debug wrap span={{ small: 1, medium: 2, big: 6, large: 8, xLarge: 8 }}>
      <HighlightBlock />
    </Column>
  </Row>
)
