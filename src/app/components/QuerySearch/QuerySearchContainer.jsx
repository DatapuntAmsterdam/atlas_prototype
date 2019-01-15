import { connect } from 'react-redux';
import {
  getNumberOfResults,
  getSearchQuery,
  isSearchLoading
} from '../../../shared/ducks/data-search/selectors';
import {
  getNumberOfResults as datasetNumberOfResults,
  isLoading as isDatasetsLoading
} from '../../../shared/ducks/datasets/datasets';
import { getFilters } from '../../../shared/ducks/filters/filters';
import { toDataSearchQuery, toDatasetSearch } from '../../../store/redux-first-router/actions';
import { getPage } from '../../../store/redux-first-router/selectors';
import QuerySearch from './QuerySearch';
import { getUser } from '../../../shared/ducks/user/user';
import PARAMETERS from '../../../store/parameters';

const mapStateToProps = (state) => ({
  isLoading: isDatasetsLoading(state) || isSearchLoading(state),
  query: getSearchQuery(state),
  filters: getFilters(state),
  user: getUser(state),
  numberOfDataResults: getNumberOfResults(state),
  numberOfDatasetResults: datasetNumberOfResults(state),
  currentPage: getPage(state)
});

const mapDispatchToProps = (dispatch) => ({
  toDataPage: (query, filters) => dispatch(toDataSearchQuery({
    [PARAMETERS.QUERY]: query,
    [PARAMETERS.FILTERS]: filters
  }, true)),
  toDatasetPage: (query, filters) => dispatch(toDatasetSearch({
    [PARAMETERS.QUERY]: query,
    [PARAMETERS.FILTERS]: filters
  }, true))
});

export default connect(mapStateToProps, mapDispatchToProps)(QuerySearch);
