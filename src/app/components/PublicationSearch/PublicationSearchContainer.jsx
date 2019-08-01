import { connect } from 'react-redux'
import {
  getNumberOfResults,
  getSearchQuery,
  getSearchQueryResults,
} from '../../../shared/ducks/data-search/selectors'
import PublicationSearch from './PublicationSearch'

const mapStateToProps = state => ({
  numberOfResults: getNumberOfResults(state),
  searchQuery: getSearchQuery(state),
  searchResults: getSearchQueryResults(state),
})

export default connect(
  mapStateToProps,
  null,
)(PublicationSearch)
