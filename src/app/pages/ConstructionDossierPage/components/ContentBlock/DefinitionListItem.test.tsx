import { render } from '@testing-library/react'
import DefinitionListItem from './DefinitionListItem'

describe('DefinitionListItem', () => {
  it('renders the item', () => {
    const { container } = render(<DefinitionListItem term="Foo" />)
    expect(container.firstChild).toBeDefined()
  })
})
