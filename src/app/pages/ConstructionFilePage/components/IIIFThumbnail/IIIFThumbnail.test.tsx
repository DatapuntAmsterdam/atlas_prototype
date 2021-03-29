import { Card } from '@amsterdam/asc-ui'
import { render, screen, waitFor } from '@testing-library/react'
import { readFileSync } from 'fs'
import { ResponseComposition, RestContext } from 'msw/lib/types'
import path from 'path'
import { mocked } from 'ts-jest/utils'
import { rest, server } from '../../../../../../test/server'
import { NOT_FOUND_THUMBNAIL } from '../../../../../shared/config/constants'
import { getAccessToken } from '../../../../../shared/services/auth/auth'
import IIIFThumbnail from './IIIFThumbnail'

const MOCK_ACCESS_TOKEN = 'ACCESS_TOKEN'
const MOCK_OBJECT_URL = 'OBJECT_URL'

jest.mock('../../../../../shared/services/auth/auth')
jest.mock('@amsterdam/asc-ui', () => {
  const originalModule = jest.requireActual('@amsterdam/asc-ui')

  return {
    __esModule: true,
    ...originalModule,
    Card: jest.fn(),
  }
})

const CardMock = mocked(Card)
const getAccessTokenMock = mocked(getAccessToken)
const createObjectURLMock = jest.fn(() => MOCK_OBJECT_URL)
const revokeObjectURLMock = jest.fn()

global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = revokeObjectURLMock

function respondWithImage(response: ResponseComposition, context: RestContext) {
  const imageBuffer = readFileSync(path.resolve(__dirname, './blob.jpg'))

  return response(
    context.set('Content-Length', imageBuffer.byteLength.toString()),
    context.set('Content-Type', 'image/jpeg'),
    context.body(imageBuffer),
  )
}

describe('IIIFThumbnail', () => {
  beforeEach(() => {
    CardMock.mockImplementation(({ children }) => <div>{children}</div>)
    getAccessTokenMock.mockReturnValue(MOCK_ACCESS_TOKEN)
  })

  afterEach(() => {
    CardMock.mockClear()
    getAccessTokenMock.mockClear()
    createObjectURLMock.mockClear()
    revokeObjectURLMock.mockClear()
  })

  it('passes the loading state to the Card', async () => {
    server.use(
      rest.get('http://localhost/blob.jpg', async (request, response, context) =>
        respondWithImage(response, context),
      ),
    )

    render(<IIIFThumbnail src="http://localhost/blob.jpg" title="foo" />)

    expect(CardMock).toHaveBeenLastCalledWith(expect.objectContaining({ isLoading: true }), {})

    await waitFor(() => expect(screen.getByTestId('image')).toHaveAttribute('src', MOCK_OBJECT_URL))

    expect(CardMock).toHaveBeenLastCalledWith(expect.objectContaining({ isLoading: false }), {})
  })

  it('loads the image with the access token', async () => {
    server.use(
      rest.get('http://localhost/blob.jpg', async (request, response, context) => {
        expect(request.headers.get('Authorization')).toEqual(`Bearer ${MOCK_ACCESS_TOKEN}`)

        return respondWithImage(response, context)
      }),
    )

    render(<IIIFThumbnail src="http://localhost/blob.jpg" title="foo" />)

    await waitFor(() => expect(screen.getByTestId('image')).toHaveAttribute('src', MOCK_OBJECT_URL))
  })

  it('loads the image without the access token', async () => {
    getAccessTokenMock.mockReturnValue('')

    server.use(
      rest.get('http://localhost/blob.jpg', async (request, response, context) => {
        expect(request.headers.get('Authorization')).toBe(null)

        return respondWithImage(response, context)
      }),
    )

    render(<IIIFThumbnail src="http://localhost/blob.jpg" title="foo" />)

    await waitFor(() => expect(screen.getByTestId('image')).toHaveAttribute('src', MOCK_OBJECT_URL))
  })

  it('loads the fallback image if the response is not ok', async () => {
    server.use(
      rest.get('http://localhost/blob.jpg', async (request, response, context) =>
        response(context.status(404)),
      ),
    )

    render(<IIIFThumbnail src="http://localhost/blob.jpg" title="foo" />)

    await waitFor(() =>
      expect(screen.getByTestId('image')).toHaveAttribute('src', NOT_FOUND_THUMBNAIL),
    )
  })

  it('revokes the image url when the source is changed', async () => {
    server.use(
      rest.get('http://localhost/blob.jpg', async (request, response, context) =>
        respondWithImage(response, context),
      ),
      rest.get('http://localhost/blob-new.jpg', async (request, response, context) =>
        respondWithImage(response, context),
      ),
    )

    const { rerender } = render(<IIIFThumbnail src="http://localhost/blob.jpg" title="foo" />)

    await waitFor(() => expect(screen.getByTestId('image')).toHaveAttribute('src', MOCK_OBJECT_URL))

    rerender(<IIIFThumbnail src="http://localhost/blob-new.jpg" title="foo" />)

    expect(revokeObjectURLMock).toHaveBeenCalledWith(MOCK_OBJECT_URL)
  })

  it('revokes the image url when the component is unmounted', async () => {
    server.use(
      rest.get('http://localhost/blob.jpg', async (request, response, context) =>
        respondWithImage(response, context),
      ),
    )

    const { unmount } = render(<IIIFThumbnail src="http://localhost/blob.jpg" title="foo" />)

    await waitFor(() => expect(screen.getByTestId('image')).toHaveAttribute('src', MOCK_OBJECT_URL))
    unmount()

    expect(revokeObjectURLMock).toHaveBeenCalledWith(MOCK_OBJECT_URL)
  })
})
