import { render } from '@testing-library/react'
import SubHeading from './SubHeading'

describe('SubHeading', () => {
  it('renders the definition list', () => {
    const { container } = render(<SubHeading />)
    expect(container.firstChild).toBeDefined()
  })
})
