import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { generatePath, Link } from 'react-router-dom'
import { getDetailPageData } from '../../../store/redux-first-router/actions'
import { routing } from '../../routes'
import DataSelectionFormatter from './DataSelectionFormatter/DataSelectionFormatter'
import { Data } from './types'

const TableRowLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const DataSelectionTable: FunctionComponent<{ content: Data }> = ({ content }) =>
  content.body && content.body.length > 0 ? (
    <table className="c-ds-table" data-testid="dataSelectionTable">
      <thead className="c-ds-table__head">
        <tr className="c-ds-table__row c-ds-table__row--link">
          {content.head.map((field) => (
            <th key={field} className="c-ds-table__cell">
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
            {row.content.map((variables, j) => (
              <td key={variables[0].id} className="c-ds-table__cell">
                {/* @ts-ignore */}
                <DataSelectionFormatter
                  variables={variables}
                  formatter={content.formatters[j]}
                  template={content.templates[j]}
                />
              </td>
            ))}
            <TableRowLink
              to={generatePath(routing.dataDetail.path, getDetailPageData(row.detailEndpoint))}
            />
          </tr>
        ))}
      </tbody>
    </table>
  ) : null

export default DataSelectionTable
