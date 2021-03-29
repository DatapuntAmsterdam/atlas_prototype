import { fireEvent, render, within } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { singleFixture as bouwdossierFixture } from '../../../../../api/iiif-metadata/bouwdossier'
import withAppContext from '../../../../utils/withAppContext'
import DocumentGallery from '../DocumentGallery'
import LoginLinkRequestModal from '../LoginLinkRequestModal'
import FileDetails from './FileDetails'

jest.mock('../DocumentGallery')
jest.mock('../LoginLinkRequestModal')

const DocumentGalleryMock = mocked(DocumentGallery)
const LoginLinkRequestModalMock = mocked(LoginLinkRequestModal)

describe('FileDetails', () => {
  beforeEach(() => {
    DocumentGalleryMock.mockImplementation(
      ({ fileId, document, onRequestLoginLink, ...otherProps }) => {
        return <div {...otherProps} />
      },
    )

    LoginLinkRequestModalMock.mockImplementation(({ onClose, ...otherProps }) => {
      return <div {...otherProps} />
    })
  })

  afterEach(() => {
    DocumentGalleryMock.mockReset()
    LoginLinkRequestModalMock.mockReset()
  })

  it('sets the title', () => {
    const { container, getByText } = render(
      withAppContext(<FileDetails fileId="SDC9999" file={bouwdossierFixture} />),
    )
    const h1 = container.querySelector('h1')

    expect(getByText('Bouw- en omgevingsdossiers')).toBeInTheDocument()
    expect(h1).toHaveTextContent(bouwdossierFixture.titel)
  })

  it('renders a definition list', () => {
    const { getByTestId } = render(
      withAppContext(<FileDetails fileId="SDC9999" file={bouwdossierFixture} />),
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
        <FileDetails
          fileId="SDC9999"
          file={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }}
        />,
      ),
    )

    expect(queryByTestId('oloLiaanNumber')).not.toBeInTheDocument()

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const olo_liaan_nummer = 1

    rerender(
      withAppContext(
        <FileDetails fileId="SDC9999" file={{ ...bouwdossierFixture, olo_liaan_nummer }} />,
      ),
    )

    expect(getByTestId('oloLiaanNumber')).toBeInTheDocument()
  })

  it('renders the subfiles', () => {
    const { getAllByTestId, getByTestId, getByText, rerender } = render(
      withAppContext(
        <FileDetails
          fileId="SDC9999"
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
        <FileDetails fileId="SDC9999" file={{ ...bouwdossierFixture, olo_liaan_nummer }} />,
      ),
    )

    expect(getAllByTestId('oloLiaanNumberDocumentDescription')).toHaveLength(
      bouwdossierFixture.documenten.length,
    )
  })

  it('renders the addresses', () => {
    const { queryByTestId, getByTestId, rerender } = render(
      withAppContext(
        <FileDetails fileId="SDC9999" file={{ ...bouwdossierFixture, adressen: [] }} />,
      ),
    )

    expect(queryByTestId('constructionFileAddresses')).not.toBeInTheDocument()

    rerender(withAppContext(<FileDetails fileId="SDC9999" file={bouwdossierFixture} />))

    expect(getByTestId('constructionFileAddresses')).toBeInTheDocument()
  })

  it('opens and closes the login link request modal', () => {
    DocumentGalleryMock.mockImplementation(({ onRequestLoginLink }) => {
      return <button data-testid="requestLoginLink" onClick={onRequestLoginLink} type="button" />
    })

    LoginLinkRequestModalMock.mockImplementation(({ onClose }) => {
      return <button data-testid="closeModal" onClick={onClose} type="button" />
    })

    const { queryByTestId, getByTestId } = render(
      withAppContext(<FileDetails fileId="SDC9999" file={bouwdossierFixture} />),
    )

    expect(queryByTestId('loginLinkRequestModal')).toBeNull()
    fireEvent.click(getByTestId('requestLoginLink'))
    expect(queryByTestId('loginLinkRequestModal')).toBeDefined()

    fireEvent.click(getByTestId('closeModal'))
    expect(queryByTestId('loginLinkRequestModal')).toBeNull()
  })
})
