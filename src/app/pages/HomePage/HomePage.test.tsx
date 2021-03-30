import { render } from '@testing-library/react'
import HomePage from './HomePage'
import withAppContext from '../../utils/withAppContext'

describe('HomePage', () => {
  it('renders the home page', () => {
    const { container } = render(withAppContext(<HomePage />))

    expect(container.firstChild).toBeDefined()
  })
})
