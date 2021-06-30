import { ascDefaultTheme } from '@amsterdam/asc-ui'
import { render } from '@testing-library/react'
import 'jest-styled-components'
import withAppContext from '../../../../utils/withAppContext'
import LargeDrawerPanel from './LargeDrawerPanel'

const { breakpoints } = ascDefaultTheme

describe('LargeDrawerPanel', () => {
  it('should set the width for a medium tablet', () => {
    const { container } = render(withAppContext(<LargeDrawerPanel />))

    expect(container.firstChild).toHaveStyleRule('width', '356px')
  })

  it('should set the width for a laptop', () => {
    const { container } = render(withAppContext(<LargeDrawerPanel />))

    expect(container.firstChild).toHaveStyleRule('width', '596px', {
      media: `screen and ${breakpoints.laptopM('min-width')}`,
    })
  })
})
