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
import { getPage, toDataSearch, toDatasetSearch } from '../../../store/redux-first-router';
import QuerySearch from './QuerySearch';
import { getUser } from '../../../shared/ducks/user/user';

const mapStateToProps = (state) => ({
  isLoading: isDatasetsLoading(state) || isSearchLoading(state),
  query: getSearchQuery(state),
  user: getUser(state),
  numberOfDataResults: getNumberOfResults(state),
  numberOfDatasetResults: datasetNumberOfResults(state),
  currentPage: getPage(state)
});

const mapDispatchToProps = (dispatch) => ({
  toDataPage: (...args) => dispatch(toDataSearch(...args)),
  toDatasetPage: (...args) => dispatch(toDatasetSearch(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(QuerySearch);
