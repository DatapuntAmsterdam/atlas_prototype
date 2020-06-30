/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toDetailFromEndpoint } from '../../../../store/redux-first-router/actions'
import DataSelectionFormatter from '../DataSelectionFormatter/DataSelectionFormatter'

const DataSelectionList = ({ content, navigateToDetail }) => (
  <ul className="o-list u-margin__bottom--1">
    {content.body.map((row, index) => (
      <li key={`${index}/${row.detailEndpoint}`}>
        <button
          type="button"
          className="o-btn o-btn--link"
          onClick={() => navigateToDetail(row.detailEndpoint)}
        >
          <DataSelectionFormatter
            variables={row.content[0]}
            formatter={content.formatters[0]}
            useInline
          />
        </button>

        {row.content.map(
          (variables, i) =>
            i !== 0 && (
              <DataSelectionFormatter
                key={i}
                variables={variables}
                formatter={content.formatters[i]}
                useInline
              />
            ),
        )}
      </li>
    ))}
  </ul>
)

/* eslint-disable react/forbid-prop-types */
DataSelectionList.propTypes = {
  content: PropTypes.shape({
    head: PropTypes.array,
    body: PropTypes.array,
  }).isRequired,
  navigateToDetail: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      navigateToDetail: toDetailFromEndpoint,
    },
    dispatch,
  )

export default connect(null, mapDispatchToProps)(DataSelectionList)
