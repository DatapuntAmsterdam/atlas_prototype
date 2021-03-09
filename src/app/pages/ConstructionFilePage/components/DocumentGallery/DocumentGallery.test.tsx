import { fireEvent, render } from '@testing-library/react'
import {
  Bestand,
  Document,
  singleFixture as bouwdossierFixture,
} from '../../../../../api/iiif-metadata/bouwdossier'
import * as userDuck from '../../../../../shared/ducks/user/user'
import { SCOPES } from '../../../../../shared/services/auth/auth'
import withAppContext from '../../../../utils/withAppContext'
import DocumentGallery from './DocumentGallery'

jest.mock('../../../../components/IIIFThumbnail/IIIFThumbnail', () => ({ ...props }) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <img {...props} />
))

const getUserScopesSpy = jest.spyOn(userDuck, 'getUserScopes')

const MOCK_FILES: Bestand[] = Array.from({ length: 10 }).map((_, index) => ({
  filename: `file-${index}.png`,
  url: `https://imageserver/path/to/file-${index}.png`,
}))

const MOCK_DOCUMENT: Document = { ...bouwdossierFixture.documenten[0], bestanden: MOCK_FILES }

describe('DocumentGallery', () => {
  beforeEach(() => {
    getUserScopesSpy.mockReturnValue([])
  })

  afterEach(() => {
    getUserScopesSpy.mockReset()
  })

  it('renders the gallery', () => {
    const { container } = render(
      withAppContext(<DocumentGallery fileId="SDC9999" document={MOCK_DOCUMENT} />),
    )

    expect(container.firstChild).toBeDefined()
  })

  it('renders a message if the user has no rights', () => {
    const { getByTestId } = render(
      withAppContext(<DocumentGallery fileId="SDC9999" document={MOCK_DOCUMENT} />),
    )

    expect(getByTestId('noRights')).toBeDefined()
  })

  it('renders a message if the document is restricted and the user has no extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getByTestId } = render(
      withAppContext(
        <DocumentGallery fileId="SDC9999" document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }} />,
      ),
    )

    expect(getByTestId('noExtendedRights')).toBeDefined()
  })

  it('renders a disabled link if the user has no rights', () => {
    const { getAllByTestId } = render(
      withAppContext(<DocumentGallery fileId="SDC9999" document={MOCK_DOCUMENT} />),
    )

    expect(getAllByTestId('detailLink')[0].tagName).toEqual('SPAN')
  })

  it('renders a disabled link if the document is restricted and the user has no extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getAllByTestId } = render(
      withAppContext(
        <DocumentGallery fileId="SDC9999" document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }} />,
      ),
    )
    expect(getAllByTestId('detailLink')[0].tagName).toEqual('SPAN')
  })

  it('renders a link if the user has rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getAllByTestId } = render(
      withAppContext(<DocumentGallery fileId="SDC9999" document={MOCK_DOCUMENT} />),
    )

    expect(getAllByTestId('detailLink')[0].tagName).toEqual('A')
  })

  it('renders a link if the document is restricted and the user has extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/X']])

    const { getAllByTestId } = render(
      withAppContext(
        <DocumentGallery fileId="SDC9999" document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }} />,
      ),
    )

    expect(getAllByTestId('detailLink')[0].tagName).toEqual('A')
  })

  it('renders a placeholder image if the user has no rights', () => {
    const { getAllByTestId } = render(
      withAppContext(<DocumentGallery fileId="SDC9999" document={MOCK_DOCUMENT} />),
    )

    expect(getAllByTestId('thumbnail')[0]).toHaveAttribute(
      'src',
      expect.stringContaining('not_found_thumbnail.jpg'),
    )
  })

  it('renders a placeholder image if the document is restricted and the user has no extended rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getAllByTestId } = render(
      withAppContext(
        <DocumentGallery fileId="SDC9999" document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }} />,
      ),
    )

    expect(getAllByTestId('thumbnail')[0]).toHaveAttribute(
      'src',
      expect.stringContaining('not_found_thumbnail.jpg'),
    )
  })

  it('renders a thumbnail image if the user has rights', () => {
    getUserScopesSpy.mockReturnValue([SCOPES['BD/R']])

    const { getAllByTestId } = render(
      withAppContext(<DocumentGallery fileId="SDC9999" document={MOCK_DOCUMENT} />),
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
        <DocumentGallery fileId="SDC9999" document={{ ...MOCK_DOCUMENT, access: 'RESTRICTED' }} />,
      ),
    )

    expect(getAllByTestId('thumbnail')[0]).toHaveAttribute(
      'src',
      expect.stringContaining(MOCK_FILES[0].filename),
    )
  })

  it('renders a maximum amount of results initially', () => {
    const { getAllByTestId } = render(
      withAppContext(<DocumentGallery fileId="SDC9999" document={MOCK_DOCUMENT} />),
    )

    expect(getAllByTestId('fileResult')).toHaveLength(6)
  })

  it('toggles between all results and less results', () => {
    const { getAllByTestId, getByTestId } = render(
      withAppContext(<DocumentGallery fileId="SDC9999" document={MOCK_DOCUMENT} />),
    )

    fireEvent.click(getByTestId('showMore'))
    expect(getAllByTestId('fileResult')).toHaveLength(MOCK_FILES.length)

    fireEvent.click(getByTestId('showLess'))
    expect(getAllByTestId('fileResult')).toHaveLength(6)
  })

  it('hides the button to show more results if there are not enough results', () => {
    const { queryByTestId } = render(
      withAppContext(
        <DocumentGallery
          fileId="SDC9999"
          document={{ ...MOCK_DOCUMENT, bestanden: MOCK_FILES.slice(0, 6) }}
        />,
      ),
    )

    expect(queryByTestId('showMore')).toBeNull()
  })

  it('renders a message if there are no results to show', () => {
    const { getByTestId, queryAllByTestId } = render(
      withAppContext(
        <DocumentGallery fileId="SDC9999" document={{ ...MOCK_DOCUMENT, bestanden: [] }} />,
      ),
    )

    expect(getByTestId('noResults')).toBeDefined()
    expect(queryAllByTestId('fileResult')).toHaveLength(0)
  })
})
