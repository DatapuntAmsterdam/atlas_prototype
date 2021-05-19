import { fireEvent, render, screen } from '@testing-library/react'
import LegendControl from './LegendControl'
import withMapContext from '../../../../utils/withMapContext'
import { DrawerState } from '../DrawerOverlay'

describe('LegendControl', () => {
  it('renders the control', () => {
    const { container } = render(withMapContext(<LegendControl showDesktopVariant={false} />))

    expect(container.firstChild).toBeDefined()
  })

  it('renders the control with the mobile icon', () => {
    render(withMapContext(<LegendControl showDesktopVariant={false} />))

    expect(screen.getByTestId('mobileIcon')).toBeInTheDocument()
  })

  it('renders the control with the desktop icon', () => {
    render(withMapContext(<LegendControl showDesktopVariant />))

    expect(screen.getByTestId('desktopIcon')).toBeInTheDocument()
  })

  it('calls the onClick callback when the control is clicked', () => {
    const setLegendActiveMock = jest.fn()
    const setDrawerStateMock = jest.fn()
    render(
      withMapContext(<LegendControl showDesktopVariant={false} />, {
        setLegendActive: setLegendActiveMock,
        setDrawerState: setDrawerStateMock,
      }),
    )

    fireEvent.click(screen.getByTitle('Legenda'))

    expect(setLegendActiveMock).toHaveBeenCalledWith(true)
    expect(setDrawerStateMock).toHaveBeenCalledWith(DrawerState.Open)
  })
})
