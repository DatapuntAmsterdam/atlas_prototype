import { render } from '@testing-library/react'
import ContentBlock from './ContentBlock'

describe('ContentBlock', () => {
  it('renders the content block', () => {
    const { container } = render(<ContentBlock />)
    expect(container.firstChild).toBeDefined()
  })
})
