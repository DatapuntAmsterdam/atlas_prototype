import { render } from '@testing-library/react'
import withAppContext from '../../../../utils/withAppContext'
import DrawerOverlay, { DeviceMode, isDesktop, isMobile } from './DrawerOverlay'

describe('isMobile', () => {
  it('detects a mobile device mode', () => {
    expect(isMobile(DeviceMode.Mobile)).toBe(true)
  })
})

describe('isDesktop', () => {
  it('detects a desktop device mode', () => {
    expect(isDesktop(DeviceMode.Desktop)).toBe(true)
  })
})

describe('DrawerOverlay', () => {
  it('renders the overlay', () => {
    const { container } = render(withAppContext(<DrawerOverlay />))

    expect(container.firstChild).toBeDefined()
  })

  // TODO: The rest of the component should have more unit tests.
  // This will require the component to be refactored first.
})
