import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserScopes, userIsAuthenticated } from '../../../shared/ducks/user/user';
import {
  getNumberOfResults,
  getSearchCategory,
  getSearchQuery
} from '../../../shared/ducks/data-search/selectors';
import DataSearch from './DataSearch';
import {
  toDataSearchCategory,
  toDetailFromEndpoint
} from '../../../store/redux-first-router/actions';

const mapStateToProps = (state) => ({
  userAuthenticated: userIsAuthenticated(state),
  userScopes: getUserScopes(state),
  numberOfResults: getNumberOfResults(state),
  category: getSearchCategory(state),
  searchQuery: getSearchQuery(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setSearchCategory: toDataSearchCategory,
  toDetail: toDetailFromEndpoint
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearch);
