import React from 'react'
import RouterLink from 'redux-first-router-link'
import { Heading, themeSpacing, themeColor, List, ListItem, Link } from '@datapunt/asc-ui'
import styled from 'styled-components'
import Gallery from '../Gallery/Gallery'
import getAddresses from '../../../normalizations/construction-files/getAddresses'
import { toDataDetail } from '../../../store/redux-first-router/actions'

export type ConstructionFileImage = {
  filename: string
  url: string
}

type ConstructionFile = {
  barcode: string
  bestanden: Array<ConstructionFileImage>
  // eslint-disable-next-line camelcase
  subdossier_titel: string
  access: 'RESTRICTED' | 'PUBLIC'
}

type ConstructionFileAddress = {
  id: string
  label: string
}

type ConstructionFileDetailProps = {
  titel: string
  documenten: Array<ConstructionFile>
  datering: string
  // eslint-disable-next-line camelcase
  dossier_type: string
  dossiernr: number
  stadsdeel: string
  adressen: Array<ConstructionFileAddress>
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
  margin-bottom: ${themeSpacing(2)};
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

  &:first-child {
    width: 33%;
  }
`

const ConstructionFileDetail: React.FC<ConstructionFileDetailProps> = ({
  titel: title,
  documenten: documents,
  adressen: addresses,
  stadsdeel: district,
  datering: date,
  dossier_type: fileType,
  dossiernr: fileNumber,
}) => {
  const id = `${district}${fileNumber}`

  return (
    <PageWrapper>
      <ContentBlock>
        <SubHeading forwardedAs="h3">Bouwdossier</SubHeading>
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
      </Table>

      {documents.length &&
        documents.map(
          ({ barcode, bestanden: files, subdossier_titel: subdossierTitle, access }) => (
            <Gallery
              key={barcode}
              id={id}
              title={subdossierTitle}
              allFiles={files}
              access={access}
            />
          ),
        )}

      <ContentBlock>
        <SubHeading forwardedAs="h3">Adressen</SubHeading>
        <List>
          {getAddresses(addresses).map(({ id: addressId, label }: ConstructionFileAddress) => (
            <ListItem key={addressId}>
              <Link
                as={RouterLink}
                variant="with-chevron"
                to={toDataDetail([addressId, 'bag', 'nummeraanduiding'])}
                title={label}
              >
                <span>{label}</span>
              </Link>
            </ListItem>
          ))}
        </List>
      </ContentBlock>
    </PageWrapper>
  )
}

export default ConstructionFileDetail
