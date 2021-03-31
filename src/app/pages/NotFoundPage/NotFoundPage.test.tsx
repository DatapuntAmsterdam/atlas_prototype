import { render } from '@testing-library/react'
import withAppContext from '../../utils/withAppContext'
import NotFoundPage from './NotFoundPage'

describe('NotFoundPage', () => {
  it('renders the page', () => {
    const { container } = render(withAppContext(<NotFoundPage />))

    expect(container.firstChild).toBeDefined()
  })
})
