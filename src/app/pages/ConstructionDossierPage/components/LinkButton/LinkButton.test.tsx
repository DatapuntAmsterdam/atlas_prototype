import { render } from '@testing-library/react'
import LinkButton from './LinkButton'

describe('LinkButton', () => {
  it('renders the button', () => {
    const { container } = render(<LinkButton />)

    expect(container.firstChild).toBeDefined()
  })
})
