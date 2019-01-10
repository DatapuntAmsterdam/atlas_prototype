import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserScopes } from '../../../shared/ducks/user/user';
import { getNumberOfResults, getSearchCategory, getSearchQuery } from '../../../shared/ducks/data-search/selectors';
import DataSearch from './DataSearch';
import { toDataSearchCategory } from '../../../store/redux-first-router/actions';
import { fetchDetail } from '../../../shared/ducks/detail/actions';

const mapStateToProps = (state) => ({
  userScopes: getUserScopes(state),
  numberOfResults: getNumberOfResults(state),
  category: getSearchCategory(state),
  searchQuery: getSearchQuery(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setSearchCategory: toDataSearchCategory,
  fetchDetailPage: fetchDetail
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearch);
