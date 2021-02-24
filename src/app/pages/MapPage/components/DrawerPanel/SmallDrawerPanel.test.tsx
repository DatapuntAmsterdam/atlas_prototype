import { ascDefaultTheme } from '@amsterdam/asc-ui'
import { render } from '@testing-library/react'
import 'jest-styled-components'
import withAppContext from '../../../../utils/withAppContext'
import SmallDrawerPanel from './SmallDrawerPanel'

const { breakpoints } = ascDefaultTheme

describe('SmallDrawerPanel', () => {
  it('should set the width for a medium tablet', () => {
    const { container } = render(withAppContext(<SmallDrawerPanel />))

    expect(container.firstChild).toHaveStyleRule('width', '356px', {
      media: `screen and ${breakpoints.tabletM('min-width')}`,
    })
  })
})
