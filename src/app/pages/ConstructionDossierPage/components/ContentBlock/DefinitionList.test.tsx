import { render } from '@testing-library/react'
import DefinitionList from './DefinitionList'

describe('DefinitionList', () => {
  it('renders the definition list', () => {
    const { container } = render(<DefinitionList />)
    expect(container.firstChild).toBeDefined()
  })
})
