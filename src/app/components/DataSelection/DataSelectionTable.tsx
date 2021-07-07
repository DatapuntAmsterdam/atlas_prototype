import { Link } from 'react-router-dom'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { getDetailPageData } from '../../../store/redux-first-router/actions'
import { toDataDetail } from '../../links'
import DataSelectionFormatter from './DataSelectionFormatter/DataSelectionFormatter'
import type { Data } from './types'

const TableRowLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export interface DataSelectionTableProps {
  content: Data
}

const DataSelectionTable: FunctionComponent<DataSelectionTableProps> = ({ content }) =>
  content.body.length > 0 ? (
    <table className="c-ds-table" data-testid="dataSelectionTable">
      <thead className="c-ds-table__head">
        <tr className="c-ds-table__row c-ds-table__row--link">
          {content.head.map((field) => (
            <th key={field} className="c-ds-table__cell" scope="col">
              {field}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="c-ds-table__body">
        {content.body.map((row) => (
          <tr
            key={row.id}
            className="c-ds-table__row c-ds-table__row--link qa-table-link"
            data-testid="dataSelectionTableRow"
          >
            {row.content.map((variables, index) => (
              <td key={variables[0].id} className="c-ds-table__cell">
                <DataSelectionFormatter
                  variables={variables}
                  formatter={content.formatters[index]}
                  template={content.templates[index]}
                />
              </td>
            ))}
            <TableRowLink to={toDataDetail(getDetailPageData(row.detailEndpoint as string))} />
          </tr>
        ))}
      </tbody>
    </table>
  ) : null

export default DataSelectionTable
