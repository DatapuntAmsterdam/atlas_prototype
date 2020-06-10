/* eslint-disable camelcase */
import React from 'react'
import RouterLink from 'redux-first-router-link'
import { Heading, themeSpacing, themeColor, List, ListItem, Link } from '@datapunt/asc-ui'
import styled from 'styled-components'
import Gallery from '../Gallery/Gallery'
import getAddresses, { Address } from '../../../normalizations/construction-files/getAddresses'
import { toDataDetail } from '../../../store/redux-first-router/actions'

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

const Table = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(2)};
`

const TableRow = styled.div`
  display: flex;
  margin-bottom: ${themeSpacing(2)};

  &:not(:last-child) {
    border-bottom: 1px solid ${themeColor('tint', 'level4')};
  }
`

const TableCell = styled.div`
  padding: ${themeSpacing(1, 5)};
  white-space: normal;
  font-weight: 500;
  width: 70%;

  &:first-child {
    width: 30%;
  }
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

      <Table>
        <TableRow>
          <TableCell>Titel</TableCell>
          <TableCell>{title}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Datering</TableCell>
          <TableCell>{date}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>{fileType}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Dossiernummer</TableCell>
          <TableCell>{fileNumber}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Openbaarheid</TableCell>
          <TableCell>{access}</TableCell>
        </TableRow>
        {oloLiaanNumber && (
          <TableRow>
            <TableCell>OLO of liaan nummer</TableCell>
            <TableCell>{oloLiaanNumber}</TableCell>
          </TableRow>
        )}
      </Table>

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
                <Table>
                  {description && (
                    <TableRow>
                      <TableCell>Beschrijving</TableCell>
                      <TableCell>{description}</TableCell>
                    </TableRow>
                  )}
                  {filePath && (
                    <TableRow>
                      <TableCell>Oorspronkelijk pad</TableCell>
                      <TableCell>{filePath}</TableCell>
                    </TableRow>
                  )}
                  {documentAccess && (
                    <TableRow>
                      <TableCell>Openbaarheid</TableCell>
                      <TableCell>{documentAccess}</TableCell>
                    </TableRow>
                  )}
                </Table>
              )}
              <Gallery key={barcode} id={id} allFiles={files} access={documentAccess} />
            </>
          ),
        )}

      {addressList.length && (
        <ContentBlock>
          <SubHeading forwardedAs="h3">Adressen</SubHeading>
          <List>
            {addressList.map(({ id: addressId, label, type }) => (
              <ListItem key={addressId}>
                <Link
                  as={RouterLink}
                  variant="with-chevron"
                  to={toDataDetail([addressId, 'bag', type])}
                  title={label}
                >
                  <span>{label}</span>
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
