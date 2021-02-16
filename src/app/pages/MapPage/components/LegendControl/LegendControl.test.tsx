import { fireEvent, render } from '@testing-library/react'
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
    const { getByTestId } = render(
      withAppContext(<LegendControl showDesktopVariant={false} onClick={() => {}} />),
    )

    expect(getByTestId('mobileIcon')).toBeDefined()
  })

  it('renders the control with the desktop icon', () => {
    const { getByTestId } = render(
      withAppContext(<LegendControl showDesktopVariant onClick={() => {}} />),
    )

    expect(getByTestId('desktopIcon')).toBeDefined()
  })

  it('calls the onClick callback when the control is clicked', () => {
    const onClick = jest.fn()
    const { getByTitle } = render(
      withAppContext(<LegendControl showDesktopVariant={false} onClick={onClick} />),
    )

    fireEvent.click(getByTitle('Legenda'))

    expect(onClick).toHaveBeenCalled()
  })
})
