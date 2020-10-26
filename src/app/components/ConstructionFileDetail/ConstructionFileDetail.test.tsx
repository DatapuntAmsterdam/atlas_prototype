import React from 'react'
import { render, within } from '@testing-library/react'

import bouwdossierFixture from '../../../api/iiif-metadata/bouwdossier/fixture'
import withAppContext from '../../utils/withAppContext'

import ConstructionFileDetail from './ConstructionFileDetail'

jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')

// mocking Gallery component to prevent having to write async test case functions and to await the fetch result from the Gallery component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock('../Gallery/Gallery', () => ({ allFiles, ...rest }: { allFiles: any }) => (
  <span {...rest} />
))

describe('ConstructionFileDetail', () => {
  it('should set the title', () => {
    const { container, getByText } = render(
      withAppContext(<ConstructionFileDetail {...bouwdossierFixture} />),
    )
    const h1 = container.querySelector('h1')

    expect(getByText('Bouw- en omgevingsdossiers')).toBeInTheDocument()
    expect(h1).toHaveTextContent(bouwdossierFixture.titel)
  })

  it('should render a definition list', () => {
    const { getByTestId } = render(
      withAppContext(<ConstructionFileDetail {...bouwdossierFixture} />),
    )

    const definitionList = getByTestId('definitionList')
    const listElements = ['titel', 'datering', 'dossier_type', 'dossiernr', 'access']

    listElements.forEach((element) => {
      const definitionDescription = within(definitionList).getByText(
        `${bouwdossierFixture[element]}`,
      )
      expect(definitionDescription).toBeInTheDocument()
    })
  })

  it('should render olo_liaan_nummer', () => {
    const { getByTestId, queryByTestId, rerender } = render(
      withAppContext(
        <ConstructionFileDetail {...{ ...bouwdossierFixture, olo_liaan_nummer: undefined }} />,
      ),
    )

    expect(queryByTestId('oloLiaanNumber')).not.toBeInTheDocument()

    // eslint-disable-next-line camelcase
    const olo_liaan_nummer = 'Foo bar'

    rerender(
      withAppContext(<ConstructionFileDetail {...{ ...bouwdossierFixture, olo_liaan_nummer }} />),
    )

    expect(getByTestId('oloLiaanNumber')).toBeInTheDocument()
  })

  it('should render the subfiles', () => {
    const { getAllByTestId, getByTestId, getByText, rerender } = render(
      withAppContext(
        <ConstructionFileDetail {...{ ...bouwdossierFixture, olo_liaan_nummer: undefined }} />,
      ),
    )

    expect(getByTestId('DocumentsHeading')).toBeInTheDocument()

    bouwdossierFixture.documenten.forEach((doc: any, index: number) => {
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

    // eslint-disable-next-line camelcase
    const olo_liaan_nummer = 'Zork'

    rerender(
      withAppContext(<ConstructionFileDetail {...{ ...bouwdossierFixture, olo_liaan_nummer }} />),
    )

    expect(getAllByTestId('oloLiaanNumberDocumentDescription')).toHaveLength(
      bouwdossierFixture.documenten.length,
    )
  })

  it('should render the addresses', () => {
    const { queryByTestId, getByTestId, rerender } = render(
      withAppContext(<ConstructionFileDetail {...{ ...bouwdossierFixture, adressen: [] }} />),
    )

    expect(queryByTestId('constructionFileAddresses')).not.toBeInTheDocument()

    rerender(withAppContext(<ConstructionFileDetail {...bouwdossierFixture} />))

    expect(getByTestId('constructionFileAddresses')).toBeInTheDocument()
  })
})
