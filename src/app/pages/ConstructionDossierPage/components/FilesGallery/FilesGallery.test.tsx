import { fireEvent, render, screen } from '@testing-library/react'
import { FunctionComponent } from 'react'
import {
  Bestand,
  Document,
  singleFixture as bouwdossierFixture,
} from '../../../../../api/iiif-metadata/bouwdossier'
import { NOT_FOUND_THUMBNAIL } from '../../../../../shared/config/constants'
import withAppContext from '../../../../utils/withAppContext'
import AuthTokenContext from '../../AuthTokenContext'
import FilesGallery from './FilesGallery'

jest.mock('../IIIFThumbnail', () => ({ ...props }) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <img {...props} />
))

const MOCK_FILES: Bestand[] = Array.from({ length: 10 }).map((_, index) => ({
  filename: `file-${index}.png`,
  url: `https://imageserver/path/to/file-${index}.png`,
}))

const MOCK_DOCUMENT: Document = { ...bouwdossierFixture.documenten[0], bestanden: MOCK_FILES }
const MOCK_TOKEN = 'faketoken'

const wrapper: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: null }}>{children}</AuthTokenContext.Provider>,
  )

const wrapperWithToken: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: MOCK_TOKEN }}>{children}</AuthTokenContext.Provider>,
  )

describe('FilesGallery', () => {
  it('renders the gallery', () => {
    const { container } = render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled={false}
      />,
      { wrapper },
    )

    expect(container.firstChild).toBeDefined()
  })

  it('renders a link', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled={false}
      />,
      { wrapper },
    )

    expect(screen.getAllByTestId('detailLink')[0].tagName).toEqual('A')
  })

  it('renders a disabled link', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled
      />,
      { wrapper },
    )

    expect(screen.getAllByTestId('detailLink')[0].tagName).toEqual('SPAN')
  })

  it('renders a thumbnail image', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled={false}
      />,
      { wrapper },
    )

    expect(screen.getAllByTestId('thumbnail')[0]).toHaveAttribute(
      'src',
      expect.stringContaining(MOCK_FILES[0].filename),
    )
  })

  it('renders a thumbnail image with the login link token', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled={false}
      />,
      { wrapper: wrapperWithToken },
    )

    expect(screen.getAllByTestId('thumbnail')[0]).toHaveAttribute(
      'src',
      expect.stringContaining(`?auth=${MOCK_TOKEN}`),
    )
  })

  it('renders a placeholder thumbnail if disabled', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled
      />,
      { wrapper },
    )

    expect(screen.getAllByTestId('thumbnail')[0]).toHaveAttribute('src', NOT_FOUND_THUMBNAIL)
  })

  it('renders the file selection toggle', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled={false}
      />,
      { wrapper },
    )

    expect(screen.getAllByTestId('fileToggle')[0]).toBeDefined()
  })

  it('selects and deselects files', () => {
    const onFileSelectionChangeMock = jest.fn()

    const { rerender } = render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={onFileSelectionChangeMock}
        disabled={false}
      />,
      { wrapper },
    )

    fireEvent.click(screen.getAllByTestId('fileToggle')[0])
    expect(onFileSelectionChangeMock).toHaveBeenCalledWith([MOCK_FILES[0]])

    rerender(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[MOCK_FILES[0]]}
        onFileSelectionChange={onFileSelectionChangeMock}
        disabled={false}
      />,
    )

    fireEvent.click(screen.getAllByTestId('fileToggle')[0])
    expect(onFileSelectionChangeMock).toHaveBeenCalledWith([])
  })

  it('renders a maximum amount of results initially', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled={false}
      />,
      { wrapper },
    )

    expect(screen.getAllByTestId('fileResult')).toHaveLength(6)
  })

  it('toggles between all results and less results', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={MOCK_DOCUMENT}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled={false}
      />,
      { wrapper },
    )

    fireEvent.click(screen.getByTestId('showMore'))
    expect(screen.getAllByTestId('fileResult')).toHaveLength(MOCK_FILES.length)

    fireEvent.click(screen.getByTestId('showLess'))
    expect(screen.getAllByTestId('fileResult')).toHaveLength(6)
  })

  it('hides the button to show more results if there are not enough results', () => {
    render(
      <FilesGallery
        dossierId="SDC9999"
        document={{ ...MOCK_DOCUMENT, bestanden: [] }}
        selectedFiles={[]}
        onFileSelectionChange={() => {}}
        disabled={false}
      />,
      { wrapper },
    )

    expect(screen.queryByTestId('showMore')).toBeNull()
  })
})
