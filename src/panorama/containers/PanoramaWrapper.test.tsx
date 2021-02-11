import { render } from '@testing-library/react'
import PanoramaWrapper from './PanoramaWrapper'
import * as api from '../../shared/services/api/api'

describe('PanoramaWrapper', () => {
  it('should try to make a request to an acceptance API to check if user is on a secured network', () => {
    const fetchWithoutTokenMock = jest.spyOn(api, 'fetchWithoutToken')
    render(<PanoramaWrapper />)

    expect(fetchWithoutTokenMock).toHaveBeenCalledTimes(1)
  })
})
