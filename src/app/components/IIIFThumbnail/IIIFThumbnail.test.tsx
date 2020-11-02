import { cleanup, render } from '@testing-library/react'
import { shallow } from 'enzyme'
import React from 'react'
import IIIFThumbnail from './IIIFThumbnail'

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
    ;(fetch as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        ok: false,
        blob: () => Promise.resolve(new Blob('image')),
      }),
    )
    const { findByTestId } = render(<IIIFThumbnail src="" title="foo" />)

    const image = (await findByTestId('Image')) as HTMLImageElement

    // Fetch returns ok = false, so render not found image
    expect(image.src).toContain('not_found_thumbnail.jpg')
  })

  it('should call the fetch method with the user token and display the image', async () => {
    const mockFetch = (fetch as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve({}),
      }),
    )
    const src = 'this.a.endpoint'

    const { findByTestId } = render(<IIIFThumbnail src={src} title="foo" />)

    // Calls fetch with the src and headers
    expect(mockFetch).toHaveBeenCalledWith(src, {
      headers: { authorization: `Bearer ${mockAccessToken}` },
    })

    const image = (await findByTestId('Image')) as HTMLImageElement

    // Response.ok is true, so construct the image url using the blob
    expect(mockCreateObjectURL).toHaveBeenCalled()

    expect(image.src).toContain(mockImageUrl)
  })
})
