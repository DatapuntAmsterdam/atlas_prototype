import { rest } from 'msw'
import { render, screen } from '@testing-library/react'
import PanoramaPreview from './PanoramaPreview'
import withAppContext from '../../../utils/withAppContext'
import joinUrl from '../../../utils/joinUrl'
import environment from '../../../../environment'
import { server } from '../../../../../test/server'
import { mapLayersParam, panoHeadingParam, panoPitchParam } from '../query-params'

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/kaart',
    search: '?someOtherParam=1&lagen=random-layer',
  }),
}))

describe('PanoramaPreview', () => {
  it('should build a link including current parameters, panorama parameters and layers for panorama', async () => {
    const { container } = render(withAppContext(<PanoramaPreview location={{ lat: 1, lng: 2 }} />))

    await screen.findByTestId('panoramaPreview')

    const link = container.querySelector('a')
    const params = new URLSearchParams(link?.search)
    expect(params.get('someOtherParam')).toContain(1)
    expect(params.get(mapLayersParam.name)).toContain('random-layer')
    expect(params.get(mapLayersParam.name)).toContain('pano')
    expect(params.get(panoPitchParam.name)).toContain(0)
    expect(params.get(panoHeadingParam.name)).toContain(131)
  })

  it('should render PanoAlert when API responses with a 403 Forbidden', async () => {
    const panoramaThumbnailUrl = joinUrl([environment.API_ROOT, 'panorama/thumbnail'])
    server.use(
      rest.get(panoramaThumbnailUrl, async (req, res, ctx) => {
        return res(ctx.status(403))
      }),
    )
    const { findByTestId } = render(
      withAppContext(<PanoramaPreview location={{ lat: 1, lng: 2 }} />),
    )

    const panoAlert = await findByTestId('panoAlert')
    expect(panoAlert).toBeDefined()
  })
})
