import styled from 'styled-components'
import { Paragraph } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import type { DetailResultItemTable } from '../../legacy/types/details'
import { Table, TableData, TableHeader, TableRow } from '../../../../components/Table'

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`

export interface DetailTableProps {
  item: DetailResultItemTable
}

const DetailTable: FunctionComponent<DetailTableProps> = ({ item }) =>
  item.values?.length ? (
    <TableWrapper data-testid="detailTable">
      <Table>
        <thead>
          <TableRow header>
            {item.headings.map(({ key, title }) => (
              <TableHeader key={key}>{title}</TableHeader>
            ))}
          </TableRow>
        </thead>
        <tbody>
          {item.values.map((value, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={index}>
              {item.headings.map(({ key }) => (
                <TableData key={key}>{value[key]}</TableData>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  ) : (
    <Paragraph>Geen resultaten gevonden</Paragraph>
  )

export default DetailTable
