import { fireEvent, render, within } from '@testing-library/react'
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

describe('DossierDetails', () => {
  beforeEach(() => {
    FilesGalleryMock.mockImplementation(
      ({ dossierId, document, onRequestLoginLink, ...otherProps }) => {
        return <div {...otherProps} />
      },
    )

    LoginLinkRequestModalMock.mockImplementation(({ onClose, ...otherProps }) => {
      return <div {...otherProps} />
    })
  })

  afterEach(() => {
    FilesGalleryMock.mockReset()
    LoginLinkRequestModalMock.mockReset()
  })

  it('sets the title', () => {
    const { container, getByText } = render(
      withAppContext(<DossierDetails dossierId="SDC9999" file={bouwdossierFixture} />),
    )
    const h1 = container.querySelector('h1')

    expect(getByText('Bouw- en omgevingsdossiers')).toBeInTheDocument()
    expect(h1).toHaveTextContent(bouwdossierFixture.titel)
  })

  it('renders a definition list', () => {
    const { getByTestId } = render(
      withAppContext(<DossierDetails dossierId="SDC9999" file={bouwdossierFixture} />),
    )

    const definitionList = getByTestId('definitionList')
    const listElements = ['titel', 'datering', 'dossier_type', 'dossiernr', 'access']

    listElements.forEach((element) => {
      const definitionDescription = within(definitionList).getByText(
        `${bouwdossierFixture[element] as string}`,
      )
      expect(definitionDescription).toBeInTheDocument()
    })
  })

  it('renders olo_liaan_nummer', () => {
    const { getByTestId, queryByTestId, rerender } = render(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          file={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }}
        />,
      ),
    )

    expect(queryByTestId('oloLiaanNumber')).not.toBeInTheDocument()

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const olo_liaan_nummer = 1

    rerender(
      withAppContext(
        <DossierDetails dossierId="SDC9999" file={{ ...bouwdossierFixture, olo_liaan_nummer }} />,
      ),
    )

    expect(getByTestId('oloLiaanNumber')).toBeInTheDocument()
  })

  it('renders the subfiles', () => {
    const { getAllByTestId, getByTestId, getByText, rerender } = render(
      withAppContext(
        <DossierDetails
          dossierId="SDC9999"
          file={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }}
        />,
      ),
    )

    expect(getByTestId('DocumentsHeading')).toBeInTheDocument()

    bouwdossierFixture.documenten.forEach((doc, index) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      expect(getByText(`${doc.subdossier_titel} (${doc.bestanden.length})`)).toBeInTheDocument()
      const filesGallery = within(getByTestId(`constructionDocuments-${index}`)).getByTestId(
        'filesGallery',
      )
      expect(filesGallery).toBeInTheDocument()
      expect(
        within(getByTestId(`constructionDocuments-${index}`)).queryAllByTestId(
          'oloLiaanNumberDocumentDescription',
        ),
      ).toHaveLength(0)
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const olo_liaan_nummer = 1

    rerender(
      withAppContext(
        <DossierDetails dossierId="SDC9999" file={{ ...bouwdossierFixture, olo_liaan_nummer }} />,
      ),
    )

    expect(getAllByTestId('oloLiaanNumberDocumentDescription')).toHaveLength(
      bouwdossierFixture.documenten.length,
    )
  })

  it('renders the addresses', () => {
    const { queryByTestId, getByTestId, rerender } = render(
      withAppContext(
        <DossierDetails dossierId="SDC9999" file={{ ...bouwdossierFixture, adressen: [] }} />,
      ),
    )

    expect(queryByTestId('constructionDossierAddresses')).not.toBeInTheDocument()

    rerender(withAppContext(<DossierDetails dossierId="SDC9999" file={bouwdossierFixture} />))

    expect(getByTestId('constructionDossierAddresses')).toBeInTheDocument()
  })

  it('opens and closes the login link request modal', () => {
    FilesGalleryMock.mockImplementation(({ onRequestLoginLink }) => {
      return <button data-testid="requestLoginLink" onClick={onRequestLoginLink} type="button" />
    })

    LoginLinkRequestModalMock.mockImplementation(({ onClose }) => {
      return <button data-testid="closeModal" onClick={onClose} type="button" />
    })

    const { queryByTestId, getByTestId } = render(
      withAppContext(<DossierDetails dossierId="SDC9999" file={bouwdossierFixture} />),
    )

    expect(queryByTestId('loginLinkRequestModal')).toBeNull()
    fireEvent.click(getByTestId('requestLoginLink'))
    expect(queryByTestId('loginLinkRequestModal')).toBeDefined()

    fireEvent.click(getByTestId('closeModal'))
    expect(queryByTestId('loginLinkRequestModal')).toBeNull()
  })
})
