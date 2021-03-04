import { render, within } from '@testing-library/react'
import { singleFixture as bouwdossierFixture } from '../../../../../api/iiif-metadata/bouwdossier'
import withAppContext from '../../../../utils/withAppContext'
import FileDetails from './FileDetails'

jest.mock('../DocumentGallery', () => ({ allFiles, ...rest }: { allFiles: any }) => (
  <div {...rest} />
))

describe('FileDetails', () => {
  it('sets the title', () => {
    const { container, getByText } = render(
      withAppContext(<FileDetails file={bouwdossierFixture} />),
    )
    const h1 = container.querySelector('h1')

    expect(getByText('Bouw- en omgevingsdossiers')).toBeInTheDocument()
    expect(h1).toHaveTextContent(bouwdossierFixture.titel)
  })

  it('renders a definition list', () => {
    const { getByTestId } = render(withAppContext(<FileDetails file={bouwdossierFixture} />))

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
      withAppContext(<FileDetails file={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }} />),
    )

    expect(queryByTestId('oloLiaanNumber')).not.toBeInTheDocument()

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const olo_liaan_nummer = 1

    rerender(withAppContext(<FileDetails file={{ ...bouwdossierFixture, olo_liaan_nummer }} />))

    expect(getByTestId('oloLiaanNumber')).toBeInTheDocument()
  })

  it('renders the subfiles', () => {
    const { getAllByTestId, getByTestId, getByText, rerender } = render(
      withAppContext(<FileDetails file={{ ...bouwdossierFixture, olo_liaan_nummer: undefined }} />),
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

    rerender(withAppContext(<FileDetails file={{ ...bouwdossierFixture, olo_liaan_nummer }} />))

    expect(getAllByTestId('oloLiaanNumberDocumentDescription')).toHaveLength(
      bouwdossierFixture.documenten.length,
    )
  })

  it('renders the addresses', () => {
    const { queryByTestId, getByTestId, rerender } = render(
      withAppContext(<FileDetails file={{ ...bouwdossierFixture, adressen: [] }} />),
    )

    expect(queryByTestId('constructionFileAddresses')).not.toBeInTheDocument()

    rerender(withAppContext(<FileDetails file={bouwdossierFixture} />))

    expect(getByTestId('constructionFileAddresses')).toBeInTheDocument()
  })
})
