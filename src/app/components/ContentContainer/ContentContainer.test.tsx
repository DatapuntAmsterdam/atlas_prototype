import { render, screen } from '@testing-library/react'
import ContentContainer from './ContentContainer'

describe('ContentContainer', () => {
  it('renders with children', () => {
    render(
      <ContentContainer>
        <h1>Hello World!</h1>
      </ContentContainer>,
    )

    expect(screen.getByText('Hello World!')).toBeInTheDocument()
  })

  it('adds a default class', () => {
    const { container } = render(<ContentContainer />)
    expect(container.firstChild).toHaveClass('content-container')
  })

  it('passes the the className prop', () => {
    const { container } = render(<ContentContainer className="my-class" />)
    expect(container.firstChild).toHaveClass('my-class')
  })
})
