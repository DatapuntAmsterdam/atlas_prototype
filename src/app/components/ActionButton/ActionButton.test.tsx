import { fireEvent, render, screen } from '@testing-library/react'
import ActionButton from './ActionButton'

const LABEL = 'Some label'

describe('ActionButton', () => {
  it('renders the button', () => {
    const { container } = render(
      <ActionButton fetching={false} iconLeft={null} label={LABEL} onClick={() => {}} />,
    )

    expect(container.firstChild).toBeDefined()
  })

  it('passes along the other props', () => {
    render(
      <ActionButton
        data-testid="actionButton"
        fetching={false}
        iconLeft={null}
        label={LABEL}
        onClick={() => {}}
      />,
    )

    expect(screen.getByTestId('actionButton')).toBeInTheDocument()
  })

  it('disables the button when fetching', () => {
    render(<ActionButton fetching iconLeft={null} label={LABEL} onClick={() => {}} />)

    expect(screen.getByText(LABEL)).toBeDisabled()
  })

  it('triggers the onClick prop if pressed', () => {
    const onClickMock = jest.fn()

    render(<ActionButton fetching={false} iconLeft={null} label={LABEL} onClick={onClickMock} />)

    fireEvent.click(screen.getByText(LABEL))

    expect(onClickMock).toHaveBeenCalled()
  })
})
