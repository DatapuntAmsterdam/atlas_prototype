/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataSelectionFormatter from '../DataSelectionFormatter/DataSelectionFormatter';
import { toDetailFromEndpoint } from '../../../../store/redux-first-router/actions';
import { VIEW_MODE } from '../../../../shared/ducks/ui/ui';

const DataSelectionTable = ({ content, navigateToDetail }) => (
  (content.body && content.body.length > 0) && (
    <table className="c-table">
      <thead>
        <tr className="c-table__header-row">
          {content.head.map((field, i) => (
            <th key={i} className="c-table__field c-table__header-field">
              {field}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.body.map((row) => (
          <tr
            key={row.detailEndpoint}
            role="link"
            className="c-table__content-row qa-table-link"
            onClick={() => {
              if (!row.detailEndpoint) {
                return;
              }
              navigateToDetail(row.detailEndpoint, VIEW_MODE.SPLIT);
            }}
          >
            {row.content.map((variables, i) => (
              <td
                key={`${variables[0].value}_${variables[0].key}_${i}`}
                className="c-table__field c-table__field--link c-table__content-field"
              >
                <DataSelectionFormatter
                  variables={variables}
                  formatter={content.formatters[i]}
                  template={content.templates[i]}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>)
);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  navigateToDetail: toDetailFromEndpoint
}, dispatch);

DataSelectionTable.propTypes = {
  content: PropTypes.shape({
    head: PropTypes.array,
    body: PropTypes.array
  }).isRequired,
  navigateToDetail: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(DataSelectionTable);
