import React from 'react'
import styled from 'styled-components'
import { DetailResultItemTable } from '../../../../map/types/details'
import { Table, TableData, TableHeader, TableRow } from '../../../components/Table'

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: scroll;
`

export interface DetailTableProps {
  item: DetailResultItemTable
}

const DetailTable: React.FC<DetailTableProps> = ({ item }) => (
  <TableWrapper data-testid="detail-table">
    <Table>
      <TableRow header>
        {item.headings.map((heading) => (
          <TableHeader key={heading.key}>{heading.title}</TableHeader>
        ))}
      </TableRow>
      {item.values?.map((value, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <TableRow key={index}>
          {item.headings.map((heading) => (
            <TableData key={heading.key}>{value[heading.key]}</TableData>
          ))}
        </TableRow>
      ))}
    </Table>
  </TableWrapper>
)

export default DetailTable
