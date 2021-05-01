import { screen, fireEvent, render, within } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { singleFixture as bouwdossierFixture } from '../../../../../api/iiif-metadata/bouwdossier'
import withAppContext from '../../../../utils/withAppContext'
import FilesGallery from '../FilesGallery'
import LoginLinkRequestModal from '../LoginLinkRequestModal'
import DossierDetails from './DossierDetails'

jest.mock('../FilesGallery')
jest.mock('../LoginLinkRequestModal')

const FilesGalleryMock = mocked(FilesGallery)
const LoginLinkRequestModalMock = mocked(LoginLinkRequestModal)

describe.skip('DossierDetails', () => {
  beforeEach(() => {
    FilesGalleryMock.mockImplementation(({ dossierId, document, ...otherProps }) => {
      return <div {...otherProps} />
    })

    LoginLinkRequestModalMock.mockImplementation(({ onClose, ...otherProps }) => {
      return <div {...otherProps} />
    })
  })

  afterEach(() => {
    FilesGalleryMock.mockReset()
    LoginLinkRequestModalMock.mockReset()
  })

  it('sets the title', () => {
    render(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />))

    expect(screen.getByText('Bouw- en omgevingsdossiers')).toBeInTheDocument()
    expect(screen.getByText(bouwdossierFixture.titel)).toBeInTheDocument()
  })

  it('renders a definition list', () => {
    render(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />))

    const definitionList = screen.getByTestId('definitionList')
    const listElements = ['titel', 'datering', 'dossier_type', 'dossiernr', 'access']

    listElements.forEach((element) => {
      const definitionDescription = within(definitionList).getByText(
        `${bouwdossierFixture[element] as string}`,
      )
      expect(definitionDescription).toBeInTheDocument()
    })
  })

  it('renders olo_liaan_nummer', () => {
    const { rerender } = render(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }}
        />,
      ),
    )

    expect(screen.queryByTestId('oloLiaanNumber')).not.toBeInTheDocument()

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const olo_liaan_nummer = 1

    rerender(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, olo_liaan_nummer }}
        />,
      ),
    )

    expect(screen.getByTestId('oloLiaanNumber')).toBeInTheDocument()
  })

  it('renders the subfiles', () => {
    const { rerender } = render(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }}
        />,
      ),
    )

    expect(screen.getByTestId('DocumentsHeading')).toBeInTheDocument()

    bouwdossierFixture.documenten.forEach((doc, index) => {
      expect(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        screen.getByText(`${doc.subdossier_titel} (${doc.bestanden.length})`),
      ).toBeInTheDocument()
      const filesGallery = within(screen.getByTestId(`constructionDocuments-${index}`)).getByTestId(
        'filesGallery',
      )
      expect(filesGallery).toBeInTheDocument()
      expect(
        within(screen.getByTestId(`constructionDocuments-${index}`)).queryAllByTestId(
          'oloLiaanNumberDocumentDescription',
        ),
      ).not.toBeInTheDocument()
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const olo_liaan_nummer = 1

    rerender(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          dossier={{ ...bouwdossierFixture, olo_liaan_nummer }}
        />,
      ),
    )

    expect(screen.getAllByTestId('oloLiaanNumberDocumentDescription')).toHaveLength(
      bouwdossierFixture.documenten.length,
    )
  })

  it('renders the addresses', () => {
    const { rerender } = render(
      withAppContext(
        <DossierDetails dossierId="SDC9999" dossier={{ ...bouwdossierFixture, adressen: [] }} />,
      ),
    )

    expect(screen.queryByTestId('constructionDossierAddresses')).not.toBeInTheDocument()

    rerender(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />))

    expect(screen.getByTestId('constructionDossierAddresses')).toBeInTheDocument()
  })

  it('opens and closes the login link request modal', () => {
    LoginLinkRequestModalMock.mockImplementation(({ onClose }) => {
      return <button data-testid="closeModal" onClick={onClose} type="button" />
    })

    render(withAppContext(<DossierDetails dossierId="SDC9999" dossier={bouwdossierFixture} />))

    expect(screen.queryByTestId('loginLinkRequestModal')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('requestLoginLink'))
    expect(screen.queryByTestId('loginLinkRequestModal')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('closeModal'))
    expect(screen.queryByTestId('loginLinkRequestModal')).not.toBeInTheDocument()
  })
})
