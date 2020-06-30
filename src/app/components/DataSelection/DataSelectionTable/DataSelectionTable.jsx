/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import { getDetailPageData } from '../../../../store/redux-first-router/actions'
import { routing } from '../../../routes'
import DataSelectionFormatter from '../DataSelectionFormatter/DataSelectionFormatter'

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
      <div className="c-ds-table">
        <div className="c-ds-table__head">
          <div className="c-ds-table__row c-ds-table__row--link">
            {content.head.map((field, i) => (
              <div key={i} className="c-ds-table__cell">
                {field}
              </div>
            ))}
          </div>
        </div>
        <div className="c-ds-table__body">
          {content.body.map((row, i) => (
            <RouterLink
              key={i}
              className="c-ds-table__row c-ds-table__row--link qa-table-link"
              to={buildLink(row)}
            >
              {row.content.map((variables, j) => (
                <div
                  key={`${variables[0].value}_${variables[0].key}_${j}`}
                  className="c-ds-table__cell"
                >
                  <DataSelectionFormatter
                    variables={variables}
                    formatter={content.formatters[j]}
                    template={content.templates[j]}
                  />
                </div>
              ))}
            </RouterLink>
          ))}
        </div>
      </div>
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
