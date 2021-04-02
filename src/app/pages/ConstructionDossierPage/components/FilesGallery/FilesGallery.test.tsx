import { fireEvent, render } from '@testing-library/react'
import {
  Bestand,
  Document,
  singleFixture as bouwdossierFixture,
} from '../../../../../api/iiif-metadata/bouwdossier'
import { NOT_FOUND_THUMBNAIL } from '../../../../../shared/config/constants'
import * as userDuck from '../../../../../shared/ducks/user/user'
import { SCOPES } from '../../../../../shared/services/auth/auth'
import withAppContext from '../../../../utils/withAppContext'
import AuthTokenContext, { AuthTokenProvider } from '../../AuthTokenContext'
import FilesGallery from './FilesGallery'

jest.mock('../IIIFThumbnail', () => ({ ...props }) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <img {...props} />
))

const getUserScopesSpy = jest.spyOn(userDuck, 'getUserScopes')

const MOCK_FILES: Bestand[] = Array.from({ length: 10 }).map((_, index) => ({
  filename: `file-${index}.png`,
  url: `https://imageserver/path/to/file-${index}.png`,
}))

const MOCK_DOCUMENT: Document = { ...bouwdossierFixture.documenten[0], bestanden: MOCK_FILES }

describe('FilesGallery', () => {
  beforeEach(() => {
    getUserScopesSpy.mockReturnValue([])
  })

  afterEach(() => {
    getUserScopesSpy.mockReset()
  })

  it('renders the gallery', () => {
    const { container } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    expect(container.firstChild).toBeDefined()
  })

  it('renders a message if the user has no rights', () => {
    const { getByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    expect(getByTestId('noRights')).toBeDefined()
  })

  // TODO: Restore this when we can safely enable the login link again.
  it.skip('triggers the onRequestLoginLink prop if a login link is requested', () => {
    const onRequestLoginLinkMock = jest.fn()
    const { getByText } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={onRequestLoginLinkMock}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    fireEvent.click(getByText('toegang aanvragen'))

    expect(onRequestLoginLinkMock).toBeCalled()
  })

  it('renders a message if the document is restricted and the user has no extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }}
            onRequestLoginLink={() => {}}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    expect(getByTestId('noExtendedRights')).toBeDefined()
  })

  it('renders a disabled link if the user has no rights', () => {
    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    expect(getAllByTestId('detailLink')[0].tagName).toEqual('SPAN')
  })

  it('renders a disabled link if the document is restricted and the user has no extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }}
            onRequestLoginLink={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )
    expect(getAllByTestId('detailLink')[0].tagName).toEqual('SPAN')
  })

  it('renders a link if the user has rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    expect(getAllByTestId('detailLink')[0].tagName).toEqual('A')
  })

  it('renders a link if the document is restricted and the user has extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/X']])

    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }}
            onRequestLoginLink={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    expect(getAllByTestId('detailLink')[0].tagName).toEqual('A')
  })

  it('renders a placeholder image if the user has no rights', () => {
    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    expect(getAllByTestId('thumbnail')[0]).toHaveAttribute('src', NOT_FOUND_THUMBNAIL)
  })

  it('renders a placeholder image if the document is restricted and the user has no extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }}
            onRequestLoginLink={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    expect(getAllByTestId('thumbnail')[0]).toHaveAttribute('src', NOT_FOUND_THUMBNAIL)
  })

  it('renders a thumbnail image if the user has rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    expect(getAllByTestId('thumbnail')[0]).toHaveAttribute(
      'src',
      expect.stringContaining(MOCK_FILES[0].filename),
    )
  })

  it('renders a thumbnail image if the document is restricted and the user has extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/X']])

    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }}
            onRequestLoginLink={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    expect(getAllByTestId('thumbnail')[0]).toHaveAttribute(
      'src',
      expect.stringContaining(MOCK_FILES[0].filename),
    )
  })

  it('renders a thumbnail image if the user is using a token from a login link', () => {
    const MOCK_TOKEN = 'foobar'
    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenContext.Provider value={{ token: MOCK_TOKEN }}>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
        </AuthTokenContext.Provider>,
      ),
    )

    expect(getAllByTestId('thumbnail')[0]).toHaveAttribute(
      'src',
      expect.stringContaining(`?${new URLSearchParams({ auth: MOCK_TOKEN }).toString()}`),
    )
  })

  it('renders a maximum amount of results initially', () => {
    const { getAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    expect(getAllByTestId('fileResult')).toHaveLength(6)
  })

  it('toggles between all results and less results', () => {
    const { getAllByTestId, getByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={MOCK_DOCUMENT}
            onRequestLoginLink={() => {}}
          />
          ,
        </AuthTokenProvider>,
      ),
    )

    fireEvent.click(getByTestId('showMore'))
    expect(getAllByTestId('fileResult')).toHaveLength(MOCK_FILES.length)

    fireEvent.click(getByTestId('showLess'))
    expect(getAllByTestId('fileResult')).toHaveLength(6)
  })

  it('hides the button to show more results if there are not enough results', () => {
    const { queryByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={{ ...MOCK_DOCUMENT, bestanden: MOCK_FILES.slice(0, 6) }}
            onRequestLoginLink={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    expect(queryByTestId('showMore')).toBeNull()
  })

  it('renders a message if there are no results to show', () => {
    const { getByTestId, queryAllByTestId } = render(
      withAppContext(
        <AuthTokenProvider>
          <FilesGallery
            dossierId="SDC9999"
            document={{ ...MOCK_DOCUMENT, bestanden: [] }}
            onRequestLoginLink={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    expect(getByTestId('noResults')).toBeDefined()
    expect(queryAllByTestId('fileResult')).toHaveLength(0)
  })
})
