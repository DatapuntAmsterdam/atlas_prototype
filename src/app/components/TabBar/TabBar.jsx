import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { getSearchQuery } from '../../../shared/ducks/data-search/selectors'

const TabBar = ({ numberOfResults, searchQuery, children }) => (
  <div>
    <h1 className="qa-tab-header__title c-tab-header__title">
      {numberOfResults !== 0 && (
        <span className="c-tab-header__title__text">
          Resultaten met &apos;
          {searchQuery}
          &apos;
        </span>
      )}
      {numberOfResults === 0 && (
        <span className="c-tab-header__title__text">
          Geen resultaten met &apos;
          {searchQuery}
          &apos;
        </span>
      )}
    </h1>
    {children}
  </div>
)

TabBar.defaultProps = {
  children: null,
}

TabBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  children: PropTypes.node,
  numberOfResults: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  searchQuery: getSearchQuery(state),
})

export default connect(
  mapStateToProps,
  null,
)(TabBar)
