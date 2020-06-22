/* eslint-disable camelcase */
import React from 'react'
import RouterLink from 'redux-first-router-link'
import { Heading, themeSpacing, themeColor, List, ListItem, Link } from '@datapunt/asc-ui'
import styled from 'styled-components'
import Gallery from '../Gallery/Gallery'
import getAddresses, { Address } from '../../../normalizations/construction-files/getAddresses'
import { toDataDetail } from '../../../store/redux-first-router/actions'
import DefinitionList, { DefinitionListItem } from '../DefinitionList'

export type ConstructionFileImage = {
  filename: string
  url: string
}

// eslint-disable camelcase
type ConstructionFile = {
  barcode: string
  bestanden: Array<ConstructionFileImage>
  subdossier_titel: string
  access: 'RESTRICTED' | 'PUBLIC'
  document_omschrijving?: string
  oorspronkelijk_pad?: string
}

type ConstructionFileDetailProps = {
  titel: string
  documenten: Array<ConstructionFile>
  datering: string
  access: 'RESTRICTED' | 'PUBLIC'
  dossier_type: string
  dossiernr: number
  stadsdeel: string
  adressen: Array<Address>
  olo_liaan_nummer?: string
  document_omschrijving?: string
}

const ContentBlock = styled.div`
  display: block;
  padding: ${themeSpacing(5)};
`

const PageWrapper = styled.div`
  padding-bottom: ${themeSpacing(18)};
`

const SubHeading = styled(Heading)`
  color: ${themeColor('secondary')};
  // @ts-ignore the marginBottom prop cannot be set on Heading
  margin-bottom: ${({ hasMarginBottom }: { hasMarginBottom?: boolean }) =>
    hasMarginBottom ? themeSpacing(2) : 0};
`

const ConstructionFileDetail: React.FC<ConstructionFileDetailProps> = ({
  titel: title,
  documenten,
  adressen: addresses,
  stadsdeel: district,
  datering: date,
  dossier_type: fileType,
  dossiernr: fileNumber,
  access,
  olo_liaan_nummer: oloLiaanNumber,
}) => {
  const id = `${district}${fileNumber}`
  const addressList = getAddresses(addresses)

  // Sort alphabetically
  const documents = documenten.sort((a, b) => a.subdossier_titel.localeCompare(b.subdossier_titel))

  return (
    <PageWrapper>
      <ContentBlock>
        <SubHeading forwardedAs="h3">Bouw- en omgevingsdossiers</SubHeading>
        <Heading forwardedAs="h1">{title}</Heading>
      </ContentBlock>

      <DefinitionList>
        <DefinitionListItem term="Titel" description={title} />
        <DefinitionListItem term="Datering" description={date} />
        <DefinitionListItem term="Type" description={fileType} />
        <DefinitionListItem term="Dossiernummer" description={fileNumber} />
        <DefinitionListItem term="Openbaarheid" description={access} />
        {oloLiaanNumber && (
          <DefinitionListItem term="OLO of liaan nummer" description={oloLiaanNumber} />
        )}
      </DefinitionList>

      {documents.length &&
        documents.map(
          ({
            barcode,
            bestanden: files,
            subdossier_titel: documentTitle,
            access: documentAccess,
            document_omschrijving: description,
            oorspronkelijk_pad: filePath,
          }) => (
            <>
              <ContentBlock>
                <SubHeading
                  hasMarginBottom={false}
                  forwardedAs="h3"
                  data-testid="DocumentsHeading"
                >{`${documentTitle} (${files.length})`}</SubHeading>
              </ContentBlock>
              {oloLiaanNumber && (
                <DefinitionList>
                  {description && (
                    <DefinitionListItem term="Beschrijving" description={description} />
                  )}
                  {filePath && (
                    <DefinitionListItem term="Oorspronkelijk pad" description={filePath} />
                  )}
                  {documentAccess && (
                    <DefinitionListItem term="Openbaarheid" description={documentAccess} />
                  )}
                </DefinitionList>
              )}
              <Gallery key={barcode} id={id} allFiles={files} access={documentAccess} />
            </>
          ),
        )}

      {addressList.length && (
        <ContentBlock>
          <SubHeading forwardedAs="h3">Adressen</SubHeading>
          <List>
            {addressList.map(({ id: addressId, label: term, type }) => (
              <ListItem key={addressId}>
                <Link
                  as={RouterLink}
                  variant="with-chevron"
                  to={toDataDetail([addressId, 'bag', type])}
                  title={term}
                >
                  <span>{term}</span>
                </Link>
              </ListItem>
            ))}
          </List>
        </ContentBlock>
      )}
    </PageWrapper>
  )
}

export default ConstructionFileDetail
