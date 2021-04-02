import { render } from '@testing-library/react'
import ButtonBar from './ButtonBar'

describe('ButtonBar', () => {
  it('renders the button bar', () => {
    const { container } = render(<ButtonBar />)
    expect(container.firstChild).toBeDefined()
  })
})
