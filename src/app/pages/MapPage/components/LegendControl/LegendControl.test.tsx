import { screen, fireEvent, render } from '@testing-library/react'
import withAppContext from '../../../../utils/withAppContext'
import LegendControl from './LegendControl'

describe('LegendControl', () => {
  it('renders the control', () => {
    const { container } = render(
      withAppContext(<LegendControl showDesktopVariant={false} onClick={() => {}} />),
    )

    expect(container.firstChild).toBeDefined()
  })

  it('renders the control with the mobile icon', () => {
    render(withAppContext(<LegendControl showDesktopVariant={false} onClick={() => {}} />))

    expect(screen.getByTestId('mobileIcon')).toBeInTheDocument()
  })

  it('renders the control with the desktop icon', () => {
    render(withAppContext(<LegendControl showDesktopVariant onClick={() => {}} />))

    expect(screen.getByTestId('desktopIcon')).toBeInTheDocument()
  })

  it('calls the onClick callback when the control is clicked', () => {
    const onClick = jest.fn()
    render(withAppContext(<LegendControl showDesktopVariant={false} onClick={onClick} />))

    fireEvent.click(screen.getByTitle('Legenda'))

    expect(onClick).toHaveBeenCalled()
  })
})
