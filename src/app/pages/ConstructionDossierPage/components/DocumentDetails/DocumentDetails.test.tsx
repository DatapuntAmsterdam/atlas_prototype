import { fireEvent, render, screen } from '@testing-library/react'
import { FunctionComponent } from 'react'
import { mocked } from 'ts-jest/utils'
import { singleFixture as dossierFixture } from '../../../../../api/iiif-metadata/bouwdossier'
import withAppContext from '../../../../utils/withAppContext'
import AuthTokenContext from '../../AuthTokenContext'
import FilesGallery from '../FilesGallery'
import DocumentDetails from './DocumentDetails'
import * as userDuck from '../../../../../shared/ducks/user/user'
import { SCOPES } from '../../../../../shared/services/auth/auth-legacy'

jest.mock('../FilesGallery')

const FilesGalleryMock = mocked(FilesGallery)
const getUserScopesMock = jest.spyOn(userDuck, 'getUserScopes')

const MOCK_TOKEN = 'faketoken'
const documentFixture = dossierFixture.documenten[0]

const wrapper: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: null }}>{children}</AuthTokenContext.Provider>,
  )

const wrapperWithToken: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: MOCK_TOKEN }}>{children}</AuthTokenContext.Provider>,
  )

describe('DocumentDetails', () => {
  beforeEach(() => {
    FilesGalleryMock.mockImplementation(
      ({ dossierId, document, selectedFiles, onFileSelectionChange, ...otherProps }) => {
        return <div {...otherProps} />
      },
    )

    getUserScopesMock.mockReturnValue([])
  })

  afterEach(() => {
    FilesGalleryMock.mockReset()
    getUserScopesMock.mockReset()
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

    expect(screen.getByTestId('noRights')).toBeDefined()
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

  it('renders a message if the document is restricted and the user has no extended rights', () => {
    getUserScopesMock.mockReturnValue([SCOPES['BD/R']])

    render(
      <DocumentDetails
        dossierId="SDC9999"
        dossier={dossierFixture}
        document={{ ...documentFixture, access: 'RESTRICTED' }}
        onRequestLoginLink={() => {}}
      />,
      { wrapper },
    )

    expect(screen.getByTestId('noExtendedRights')).toBeDefined()
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
