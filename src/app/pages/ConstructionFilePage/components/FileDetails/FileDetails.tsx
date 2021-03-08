import { Heading, Link, List, ListItem, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent, useMemo } from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { Single as Bouwdossier } from '../../../../../api/iiif-metadata/bouwdossier'
import { toDataDetail } from '../../../../../store/redux-first-router/actions'
import DefinitionList, { DefinitionListItem } from '../../../../components/DefinitionList'
import formatAddresses from '../../utils/formatAddresses'
import DocumentGallery from '../DocumentGallery'

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

export interface FileDetailsProps {
  fileId: string
  file: Bouwdossier
}

const FileDetails: FunctionComponent<FileDetailsProps> = ({ fileId, file, ...otherProps }) => {
  const addresses = useMemo(() => formatAddresses(file.adressen), [file.adressen])
  const sortedDocuments = useMemo(
    () =>
      file.documenten.sort((a, b) =>
        (a.subdossier_titel ?? '').localeCompare(b.subdossier_titel ?? ''),
      ),
    [file.documenten],
  )

  return (
    <PageWrapper {...otherProps}>
      <Header>
        <SubHeading forwardedAs="p">Bouw- en omgevingsdossiers</SubHeading>
        <Heading>{file.titel}</Heading>
      </Header>

      <StyledDefinitionList data-testid="definitionList">
        <StyledDefinitionListItem term="Titel">{file.titel}</StyledDefinitionListItem>
        <StyledDefinitionListItem term="Datering">{file.datering}</StyledDefinitionListItem>
        <StyledDefinitionListItem term="Type">{file.dossier_type}</StyledDefinitionListItem>
        <StyledDefinitionListItem term="Dossiernummer">{file.dossiernr}</StyledDefinitionListItem>
        <StyledDefinitionListItem term="Openbaarheid">{file.access}</StyledDefinitionListItem>
        {file.olo_liaan_nummer && (
          <StyledDefinitionListItem term="OLO of liaan nummer" data-testid="oloLiaanNumber">
            {file.olo_liaan_nummer}
          </StyledDefinitionListItem>
        )}
      </StyledDefinitionList>

      {sortedDocuments.map((document, index) => (
        <div data-testid={`constructionDocuments-${index}`} key={document.barcode}>
          <ContentBlock>
            {document.subdossier_titel ? (
              <SubHeading
                hasMarginBottom={false}
                forwardedAs="h3"
                data-testid="DocumentsHeading"
              >{`${document.subdossier_titel} (${document.bestanden.length})`}</SubHeading>
            ) : null}
          </ContentBlock>
          {file.olo_liaan_nummer && (
            <StyledDefinitionList data-testid="oloLiaanNumberDocumentDescription">
              {document.document_omschrijving && (
                <StyledDefinitionListItem term="Beschrijving">
                  {document.document_omschrijving}
                </StyledDefinitionListItem>
              )}
              {document.oorspronkelijk_pad.length && (
                <StyledDefinitionListItem term="Oorspronkelijk pad">
                  {document.oorspronkelijk_pad.join(', ')}
                </StyledDefinitionListItem>
              )}
              {document.access && (
                <StyledDefinitionListItem term="Openbaarheid">
                  {document.access}
                </StyledDefinitionListItem>
              )}
            </StyledDefinitionList>
          )}
          <DocumentGallery data-testid="filesGallery" fileId={fileId} document={document} />
        </div>
      ))}

      {addresses.length && (
        <ContentBlock data-testid="constructionFileAddresses">
          <SubHeading forwardedAs="h3">Adressen</SubHeading>
          <List>
            {addresses.map((address) => (
              <ListItem key={address.id}>
                <Link as={RouterLink} inList to={toDataDetail([address.id, 'bag', address.type])}>
                  <span>{address.label}</span>
                </Link>
              </ListItem>
            ))}
          </List>
        </ContentBlock>
      )}
    </PageWrapper>
  )
}

export default FileDetails
