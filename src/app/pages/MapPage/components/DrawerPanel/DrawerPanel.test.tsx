import { render } from '@testing-library/react'
import 'jest-styled-components'
import withAppContext from '../../../../utils/withAppContext'
import { DeviceMode } from '../DrawerOverlay'
import DrawerPanel, { slideInMobile, slideInDesktop } from './DrawerPanel'

describe('DrawerPanel', () => {
  it('renders the panel', () => {
    const { container } = render(withAppContext(<DrawerPanel />))

    expect(container.firstChild).toBeDefined()
  })

  it('renders the panel in a stack on mobile', () => {
    const { container } = render(withAppContext(<DrawerPanel stackLevel={1} />))

    expect(container.firstChild).toHaveStyleRule('margin-top', '32px')
    expect(container.firstChild).toHaveStyleRule('box-shadow', expect.any(String))
  })

  it('renders the panel in a stack on desktop', () => {
    const { container } = render(
      withAppContext(<DrawerPanel deviceMode={DeviceMode.Desktop} stackLevel={1} />),
    )

    expect(container.firstChild).toHaveStyleRule('margin-right', '32px')
    expect(container.firstChild).toHaveStyleRule('box-shadow', expect.any(String))
  })

  it('renders the panel with the correct animation on mobile', () => {
    const { container } = render(withAppContext(<DrawerPanel />))

    expect(container.firstChild).toHaveStyleRule(
      'animation',
      expect.stringContaining(slideInMobile.getName()),
    )
  })

  it('renders the panel with the correct animation on desktop', () => {
    const { container } = render(withAppContext(<DrawerPanel deviceMode={DeviceMode.Desktop} />))

    expect(container.firstChild).toHaveStyleRule(
      'animation',
      expect.stringContaining(slideInDesktop.getName()),
    )
  })
})
