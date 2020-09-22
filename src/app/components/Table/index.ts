import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const Table = styled.table`
  border-spacing: 0;
`

const cellStyle = css`
  height: 42px;
  padding: ${themeSpacing(1, 4, 1, 2)};
  text-align: left;
  white-space: nowrap;
  vertical-align: middle;

  &:last-child {
    padding-right: ${themeSpacing(2)};
  }
`

export const TableHeader = styled.th`
  ${cellStyle}
  font-weight: bold;
`

export const TableData = styled.td`
  ${cellStyle}
  font-weight: normal;
  border-bottom: 1px solid ${themeColor('tint', 'level4')};
`

export interface TableRowProps {
  header?: boolean
}

export const TableRow = styled.tr<TableRowProps>`
  ${(props) =>
    !props.header &&
    css`
      &:hover,
      &:focus {
        background-color: ${themeColor('tint', 'level3')};
      }

      &:last-child ${TableData} {
        border-bottom: 0;
      }
    `}
`
