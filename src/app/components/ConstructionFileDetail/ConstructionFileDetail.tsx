/* eslint-disable camelcase */
import { Heading, Link, List, ListItem, themeColor, themeSpacing } from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import getAddresses, { Address } from '../../../normalizations/construction-files/getAddresses'
import { toDataDetail } from '../../../store/redux-first-router/actions'
import DefinitionList, { DefinitionListItem } from '../DefinitionList'
import Gallery from '../Gallery/Gallery'

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

const StyledDefinitionList = styled(DefinitionList)`
  margin-bottom: ${themeSpacing(2)};
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

      <StyledDefinitionList>
        <DefinitionListItem term="Titel">{title}</DefinitionListItem>
        <DefinitionListItem term="Datering">{date}</DefinitionListItem>
        <DefinitionListItem term="Type">{fileType}</DefinitionListItem>
        <DefinitionListItem term="Dossiernummer">{fileNumber}</DefinitionListItem>
        <DefinitionListItem term="Openbaarheid">{access}</DefinitionListItem>
        {oloLiaanNumber && (
          <DefinitionListItem term="OLO of liaan nummer">{oloLiaanNumber}</DefinitionListItem>
        )}
      </StyledDefinitionList>

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
                <StyledDefinitionList>
                  {description && (
                    <DefinitionListItem term="Beschrijving">{description}</DefinitionListItem>
                  )}
                  {filePath && (
                    <DefinitionListItem term="Oorspronkelijk pad">{filePath}</DefinitionListItem>
                  )}
                  {documentAccess && (
                    <DefinitionListItem term="Openbaarheid">{documentAccess}</DefinitionListItem>
                  )}
                </StyledDefinitionList>
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
