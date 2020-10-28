/* eslint-disable camelcase */
import { Heading, Link, List, ListItem, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import React, { FunctionComponent, useMemo } from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import getAddresses from '../../../normalizations/construction-files/getAddresses'
import { toDataDetail } from '../../../store/redux-first-router/actions'
import { Bouwdossier } from '../../../api/iiif-metadata/bouwdossier'
import DefinitionList, { DefinitionListItem } from '../DefinitionList'
import Gallery from '../Gallery/Gallery'

const ContentBlock = styled.div`
  padding: ${themeSpacing(5)};
`

const Header = styled.header`
  padding: ${themeSpacing(5)};
`

const PageWrapper = styled.article`
  padding-bottom: ${themeSpacing(18)};
`

const SubHeading = styled(Heading)<{ hasMarginBottom?: boolean }>`
  color: ${themeColor('secondary')};
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? themeSpacing(2) : 0)};
  font-weight: bold;
`

const StyledDefinitionList = styled(DefinitionList)`
  margin-bottom: ${themeSpacing(2)};
`

const StyledDefinitionListItem = styled(DefinitionListItem)`
  padding-left: ${themeSpacing(5)}; // Align the terms on the left with the page content
`

const ConstructionFileDetail: FunctionComponent<Bouwdossier> = ({
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
  const sortedDocuments = useMemo(
    () =>
      documenten.sort((a, b) => (a.subdossier_titel || '').localeCompare(b.subdossier_titel || '')),
    [documenten],
  )

  return (
    <PageWrapper>
      <Header>
        <SubHeading forwardedAs="p">Bouw- en omgevingsdossiers</SubHeading>
        <Heading>{title}</Heading>
      </Header>

      <StyledDefinitionList data-testid="definitionList">
        <StyledDefinitionListItem term="Titel">{title}</StyledDefinitionListItem>
        <StyledDefinitionListItem term="Datering">{date}</StyledDefinitionListItem>
        <StyledDefinitionListItem term="Type">{fileType}</StyledDefinitionListItem>
        <StyledDefinitionListItem term="Dossiernummer">{fileNumber}</StyledDefinitionListItem>
        <StyledDefinitionListItem term="Openbaarheid">{access}</StyledDefinitionListItem>
        {oloLiaanNumber && (
          <StyledDefinitionListItem term="OLO of liaan nummer" data-testid="oloLiaanNumber">
            {oloLiaanNumber}
          </StyledDefinitionListItem>
        )}
      </StyledDefinitionList>

      {sortedDocuments.map(
        (
          {
            barcode,
            bestanden: files,
            subdossier_titel: documentTitle,
            access: documentAccess,
            document_omschrijving: description,
            oorspronkelijk_pad: filePath,
          },
          index,
        ) => (
          <div data-testid={`constructionDocuments-${index}`} key={barcode}>
            <ContentBlock>
              <SubHeading
                hasMarginBottom={false}
                forwardedAs="h3"
                data-testid="DocumentsHeading"
              >{`${documentTitle} (${files.length})`}</SubHeading>
            </ContentBlock>
            {oloLiaanNumber && (
              <StyledDefinitionList data-testid="oloLiaanNumberDocumentDescription">
                {description && (
                  <StyledDefinitionListItem term="Beschrijving">
                    {description}
                  </StyledDefinitionListItem>
                )}
                {filePath?.length && (
                  <StyledDefinitionListItem term="Oorspronkelijk pad">
                    {filePath.join(', ')}
                  </StyledDefinitionListItem>
                )}
                {documentAccess && (
                  <StyledDefinitionListItem term="Openbaarheid">
                    {documentAccess}
                  </StyledDefinitionListItem>
                )}
              </StyledDefinitionList>
            )}
            <Gallery
              data-testid="filesGallery"
              key={barcode}
              id={id}
              allFiles={files}
              access={documentAccess}
            />
          </div>
        ),
      )}

      {addressList.length && (
        <ContentBlock data-testid="constructionFileAddresses">
          <SubHeading forwardedAs="h3">Adressen</SubHeading>
          <List>
            {addressList.map(({ id: addressId, label: term, type }) => (
              <ListItem key={addressId}>
                <Link
                  as={RouterLink}
                  inList
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
