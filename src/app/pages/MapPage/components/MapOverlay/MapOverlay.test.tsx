import { render } from '@testing-library/react'
import withAppContext from '../../../../utils/withAppContext'
import MapOverlay from './MapOverlay'

describe('MapOverlay', () => {
  it('renders the container', () => {
    const { container } = render(withAppContext(<MapOverlay />))

    expect(container.firstChild).toBeDefined()
  })
})
