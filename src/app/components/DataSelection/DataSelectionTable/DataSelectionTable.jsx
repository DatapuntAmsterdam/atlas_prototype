/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { getDetailPageData } from '../../../../store/redux-first-router/actions'
import { routing } from '../../../routes'
import DataSelectionFormatter from '../DataSelectionFormatter/DataSelectionFormatter'

const TableRowLink = styled(RouterLink)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const DataSelectionTable = ({ content }) => {
  const buildLink = (row) => {
    const { id, type, subtype } = getDetailPageData(row.detailEndpoint)
    return {
      type: routing.dataDetail.type,
      payload: {
        type,
        subtype,
        id: `id${id}`,
      },
    }
  }

  return (
    content.body &&
    content.body.length > 0 && (
      <table className="c-ds-table">
        <thead className="c-ds-table__head">
          <tr className="c-ds-table__row c-ds-table__row--link">
            {content.head.map((field, i) => (
              <th key={i} className="c-ds-table__cell">
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="c-ds-table__body">
          {content.body.map((row, i) => (
            <tr key={i} className="c-ds-table__row c-ds-table__row--link qa-table-link">
              {row.content.map((variables, j) => (
                <td
                  key={`${variables[0].value}_${variables[0].key}_${j}`}
                  className="c-ds-table__cell"
                >
                  <DataSelectionFormatter
                    variables={variables}
                    formatter={content.formatters[j]}
                    template={content.templates[j]}
                  />
                </td>
              ))}
              <TableRowLink to={buildLink(row)} />
            </tr>
          ))}
        </tbody>
      </table>
    )
  )
}

/* eslint-disable react/forbid-prop-types */
DataSelectionTable.propTypes = {
  content: PropTypes.shape({
    head: PropTypes.array,
    body: PropTypes.array,
  }).isRequired,
}

export default DataSelectionTable
