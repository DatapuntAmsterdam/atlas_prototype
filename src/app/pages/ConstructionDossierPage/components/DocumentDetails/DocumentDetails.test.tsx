import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { createUnsecuredToken, Json } from 'jsontokens'
import type { FunctionComponent } from 'react'
import { singleFixture as dossierFixture } from '../../../../../api/iiif-metadata/bouwdossier'
import withAppContext from '../../../../utils/withAppContext'
import AuthTokenContext, { DecodedToken } from '../../AuthTokenContext'
import FilesGallery from '../FilesGallery'
import DocumentDetails from './DocumentDetails'
import { SCOPES } from '../../../../../shared/services/auth/auth-legacy'
import { getScopes } from '../../../../../shared/services/auth/auth'

jest.mock('../FilesGallery')
jest.mock('../../../../../shared/services/auth/auth')

const FilesGalleryMock = mocked(FilesGallery)
const getScopesMock = mocked(getScopes)
const documentFixture = dossierFixture.documenten[0]

const VALID_DECODED_TOKEN: DecodedToken = {
  scopes: [],
  sub: 'jane.doe@example.com',
  exp: Date.now() / 1000 + 120,
}

const VALID_TOKEN = createUnsecuredToken(VALID_DECODED_TOKEN as unknown as Json)

const wrapper: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: null, decodedToken: null, isTokenExpired: false }}>
      {children}
    </AuthTokenContext.Provider>,
  )

const wrapperWithToken: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider
      value={{ token: VALID_TOKEN, decodedToken: VALID_DECODED_TOKEN, isTokenExpired: false }}
    >
      {children}
    </AuthTokenContext.Provider>,
  )

describe('DocumentDetails', () => {
  beforeEach(() => {
    FilesGalleryMock.mockImplementation(
      ({
        dossierId,
        document,
        selectedFiles,
        onFileSelectionChange,
        restricted,
        ...otherProps
      }) => {
        return <div {...otherProps} />
      },
    )

    getScopesMock.mockReturnValue([])
  })

  afterEach(() => {
    FilesGalleryMock.mockReset()
    getScopesMock.mockReset()
  })

  it('renders the title', () => {
    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(
      screen.getByText(
        `${documentFixture.subdossier_titel ?? ''} (${documentFixture.bestanden.length})`,
      ),
    ).toBeInTheDocument()
  })

  it('renders olo_liaan_nummer description', () => {
    const { rerender } = render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: undefined }}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByTestId('oloLiaanNumberDescription')).not.toBeInTheDocument()

    rerender(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
    )

    expect(screen.getByTestId('oloLiaanNumberDescription')).toBeInTheDocument()
  })

  it('renders the document description', () => {
    const { rerender } = render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={{ ...documentFixture, document_omschrijving: null }}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByText('Beschrijving')).not.toBeInTheDocument()

    const description = 'Some description'

    rerender(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={{ ...documentFixture, document_omschrijving: description }}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
    )

    expect(screen.queryByText('Beschrijving')).toBeInTheDocument()
    expect(screen.queryByText(description)).toBeInTheDocument()
  })

  it('renders the original paths', () => {
    const { rerender } = render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={{ ...documentFixture, oorspronkelijk_pad: [] }}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByText('Oorspronkelijk pad')).not.toBeInTheDocument()

    const path = ['foo', 'bar']

    rerender(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={{ ...documentFixture, oorspronkelijk_pad: path }}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
    )

    expect(screen.queryByText('Oorspronkelijk pad')).toBeInTheDocument()
    expect(screen.queryByText(path.join(', '))).toBeInTheDocument()
  })

  it('renders a message if the user has no rights', () => {
    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(screen.getByTestId('noRights')).toBeInTheDocument()
  })

  it('triggers the onRequestLoginLink prop if a login link is requested', () => {
    const onRequestLoginLinkMock = jest.fn()

    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={onRequestLoginLinkMock}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    fireEvent.click(screen.getByText('toegang aanvragen'))

    expect(onRequestLoginLinkMock).toBeCalled()
  })

  it('renders a message if the dossier is restricted and the user has no extended rights', () => {
    getScopesMock.mockReturnValue([SCOPES['BD/R']])

    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, access: 'RESTRICTED' }}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(screen.getByTestId('noExtendedRights')).toBeInTheDocument()
  })

  it('renders a message if the document is restricted and the user has no extended rights', () => {
    getScopesMock.mockReturnValue([SCOPES['BD/R']])

    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={{ ...documentFixture, access: 'RESTRICTED' }}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(screen.getByTestId('noExtendedRights')).toBeInTheDocument()
  })

  it('renders the the files gallery', () => {
    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByTestId('filesGallery')).toBeInTheDocument()
  })

  it('renders a message if there are no files', () => {
    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={{ ...documentFixture, bestanden: [] }}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByTestId('filesGallery')).not.toBeInTheDocument()
    expect(screen.queryByTestId('noResults')).toBeInTheDocument()
  })

  it('renders the select all checkbox if the user has rights', () => {
    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper: wrapperWithToken },
    )

    expect(screen.queryByTestId('allFilesToggle')).toBeInTheDocument()
  })

  it('renders no select all checkbox if the user has insufficient rights', () => {
    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, access: 'RESTRICTED' }}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper: wrapperWithToken },
    )

    expect(screen.queryByTestId('allFilesToggle')).not.toBeInTheDocument()
  })

  it('checking the select all checkbox updates the label accordingly', () => {
    render(
      <DocumentDetails
        index={0}
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={() => {}}
        onDownloadFiles={() => {}}
      />,
      { wrapper: wrapperWithToken },
    )

    expect(screen.getByText('Alles selecteren (0)')).toBeInTheDocument()

    const checkbox = screen.queryByTestId('allFilesToggle') as HTMLElement
    fireEvent.click(checkbox)

    expect(
      screen.getByText(`Alles selecteren (${documentFixture.bestanden.length})`),
    ).toBeInTheDocument()
  })
})
