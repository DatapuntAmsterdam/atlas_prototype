import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUser } from '../../../shared/ducks/user/user';
import { getNumberOfResults, getSearchCategory } from '../../../shared/ducks/data-search/selectors';
import DataSearch from './DataSearch';
import { toDataSearchCategory } from '../../../store/redux-first-router';
import { fetchDetail } from '../../../shared/ducks/detail/actions';

const mapStateToProps = (state) => ({
  user: getUser(state),
  numberOfResults: getNumberOfResults(state),
  category: getSearchCategory(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setSearchCategory: toDataSearchCategory,
  fetchDetailPage: fetchDetail
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearch);
