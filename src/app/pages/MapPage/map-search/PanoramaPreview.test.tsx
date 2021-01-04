import { render, waitFor } from '@testing-library/react'
import PanoramaPreview from './PanoramaPreview'
import { getPanoramaThumbnail } from '../../../../api/panorama/thumbnail'
import withAppContext from '../../../utils/withAppContext'

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/kaart',
    search: '?someOtherParam=1&lagen=random-layer',
  }),
}))

jest.mock('../../../../api/panorama/thumbnail')

describe('PanoramaPreview', () => {
  beforeEach(() => {
    // @ts-ignore
    getPanoramaThumbnail.mockImplementation(() => Promise.resolve({ url: 'example.com' }))
  })
  it('should build a link including current parameters, panorama parameters and layers for panorama', async () => {
    const { container } = render(withAppContext(<PanoramaPreview location={{ lat: 1, lng: 2 }} />))
    await waitFor(() => {
      const link = container.querySelector('a')
      const params = new URLSearchParams(link?.search)
      expect(params.get('someOtherParam')).toBeDefined()
      expect(params.get('lagen')).toContain('random-layer')
      expect(params.get('lagen')).toContain('pano')
      expect(params.get('pano')).toBeDefined()
    })
  })
})
