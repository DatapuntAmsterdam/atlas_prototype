import { connect } from 'react-redux'
import {
  getNumberOfResults,
  getSearchQuery,
  isSearchLoading,
} from '../../../shared/ducks/data-search/selectors'
import { isLoading as isDatasetsLoading } from '../../../shared/ducks/datasets/datasets'
import { getFilters } from '../../../shared/ducks/filters/filters'
import { getPage } from '../../../store/redux-first-router/selectors'
import QuerySearch from './QuerySearch'
import { getUser } from '../../../shared/ducks/user/user'
import PARAMETERS from '../../../store/parameters'

const mapStateToProps = state => ({
  isLoading: isDatasetsLoading(state) || isSearchLoading(state),
  query: getSearchQuery(state),
  filters: getFilters(state),
  user: getUser(state),
  numberOfResults: getNumberOfResults(state),
  currentPage: getPage(state),
})

const mapDispatchToProps = dispatch => ({
  toSearchPage: (toPageActionCreator, query, filters) =>
    dispatch(
      toPageActionCreator({
        [PARAMETERS.QUERY]: query,
        [PARAMETERS.FILTERS]: filters,
      }),
      true,
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuerySearch)
