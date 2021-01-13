import { cleanup, render, screen } from '@testing-library/react'
import { shallow } from 'enzyme'
import * as path from 'path'
import * as fs from 'fs'
import IIIFThumbnail from './IIIFThumbnail'
import { server, rest } from '../../../../test/server'

const mockAccessToken = 'ABC'
const mockImageUrl = 'this.a.image.url'

// Mock the access token
jest.mock('../../../shared/services/redux/get-state', () =>
  jest.fn(() => ({ user: { accessToken: mockAccessToken } })),
)

// The function createObjectURL doesnt exist on global
declare global {
  namespace NodeJS {
    interface Global {
      URL: {
        createObjectURL: () => void
      }
    }
  }
}

// Create a mock for the global URL
const mockCreateObjectURL = jest.fn(() => mockImageUrl)
global.URL.createObjectURL = mockCreateObjectURL

describe('IIIFThumbnail', () => {
  beforeEach(() => cleanup())

  it('should set the loading skeleton when the src is being fetched', async () => {
    const component = shallow(<IIIFThumbnail src="" title="foo" />) // We want to test the props that are set on a component, this is something testing-library doesn't support, as it prefers to test the DOM

    const card = component.find('Styled(Card)')
    expect(card.props()).toMatchObject({ isLoading: true })
  })

  it("should set the not found image when the src can't be fetched", async () => {
    server.use(
      rest.get(/localhost/, async (req, res, ctx) => {
        return res(ctx.status(404))
      }),
    )

    render(<IIIFThumbnail src="http://localhost/" title="foo" />)

    const image = (await screen.findByTestId('Image')) as HTMLImageElement

    // Fetch returns ok = false, so render not found image
    expect(image.src).toContain('not_found_thumbnail.jpg')
  })

  it('should call the fetch method with the user token and display the image', async () => {
    let request: any

    server.use(
      rest.get(/localhost/, async (req, res, ctx) => {
        const imageBuffer = fs.readFileSync(path.resolve(__dirname, './blob.jpg'))
        request = req

        return res(
          ctx.set('Content-Length', imageBuffer.byteLength.toString()),
          ctx.set('Content-Type', 'image/jpeg'),
          // Respond with the "ArrayBuffer".
          ctx.body(imageBuffer),
        )
      }),
    )

    const src = 'http://localhost/this.is.an.endpoint'

    render(<IIIFThumbnail src={src} title="foo" />)

    await screen.findByTestId('Image')

    // Calls fetch with the src and headers
    expect(request.headers.get('authorization')).toEqual(`Bearer ${mockAccessToken}`)

    const image = (await screen.findByTestId('Image')) as HTMLImageElement

    // Response.ok is true, so construct the image url using the blob
    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(image.src).toContain(mockImageUrl)
  })
})
