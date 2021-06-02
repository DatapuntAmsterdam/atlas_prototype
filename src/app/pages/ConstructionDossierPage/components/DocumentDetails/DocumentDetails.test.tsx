import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import type { FunctionComponent } from 'react'
import { singleFixture as dossierFixture } from '../../../../../api/iiif-metadata/bouwdossier'
import withAppContext from '../../../../utils/withAppContext'
import AuthTokenContext from '../../AuthTokenContext'
import FilesGallery from '../FilesGallery'
import DocumentDetails from './DocumentDetails'
import { SCOPES } from '../../../../../shared/services/auth/auth-legacy'
import { getScopes } from '../../../../../shared/services/auth/auth'

jest.mock('../FilesGallery')
jest.mock('../../../../../shared/services/auth/auth')

const FilesGalleryMock = mocked(FilesGallery)
const getScopesMock = mocked(getScopes)

const documentFixture = dossierFixture.documenten[0]

const wrapper: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: null, decodedToken: null, isTokenExpired: false }}>
      {children}
    </AuthTokenContext.Provider>,
  )

describe('DocumentDetails', () => {
  beforeEach(() => {
    FilesGalleryMock.mockImplementation(
      ({ dossierId, document, selectedFiles, onFileSelectionChange, ...otherProps }) => {
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
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={() => {}}
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
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: undefined }}
        document={documentFixture}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByTestId('oloLiaanNumberDescription')).not.toBeInTheDocument()

    rerender(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={documentFixture}
        onRequestLoginLink={() => {}}
      />,
    )

    expect(screen.getByTestId('oloLiaanNumberDescription')).toBeInTheDocument()
  })

  it('renders the document description', () => {
    const { rerender } = render(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={{ ...documentFixture, document_omschrijving: null }}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByText('Beschrijving')).not.toBeInTheDocument()

    const description = 'Some description'

    rerender(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={{ ...documentFixture, document_omschrijving: description }}
        onRequestLoginLink={() => {}}
      />,
    )

    expect(screen.queryByText('Beschrijving')).toBeInTheDocument()
    expect(screen.queryByText(description)).toBeInTheDocument()
  })

  it('renders the original paths', () => {
    const { rerender } = render(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={{ ...documentFixture, oorspronkelijk_pad: [] }}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByText('Oorspronkelijk pad')).not.toBeInTheDocument()

    const path = ['foo', 'bar']

    rerender(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, olo_liaan_nummer: 1 }}
        document={{ ...documentFixture, oorspronkelijk_pad: path }}
        onRequestLoginLink={() => {}}
      />,
    )

    expect(screen.queryByText('Oorspronkelijk pad')).toBeInTheDocument()
    expect(screen.queryByText(path.join(', '))).toBeInTheDocument()
  })

  it('renders a message if the user has no rights', () => {
    render(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.getByTestId('noRights')).toBeInTheDocument()
  })

  it('triggers the onRequestLoginLink prop if a login link is requested', () => {
    const onRequestLoginLinkMock = jest.fn()

    render(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={onRequestLoginLinkMock}
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
        dossierId="SDC9999"
        dossier={{ ...dossierFixture, access: 'RESTRICTED' }}
        document={documentFixture}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.getByTestId('noExtendedRights')).toBeInTheDocument()
  })

  it('renders a message if the document is restricted and the user has no extended rights', () => {
    getScopesMock.mockReturnValue([SCOPES['BD/R']])

    render(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={{ ...documentFixture, access: 'RESTRICTED' }}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.getByTestId('noExtendedRights')).toBeInTheDocument()
  })

  it('renders the the files gallery', () => {
    render(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={documentFixture}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByTestId('filesGallery')).toBeInTheDocument()
  })

  it('renders a message if there are no files', () => {
    render(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={{ ...documentFixture, bestanden: [] }}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.queryByTestId('filesGallery')).not.toBeInTheDocument()
    expect(screen.queryByTestId('noResults')).toBeInTheDocument()
  })
})
