import { connect } from 'react-redux';
import TabBar from './TabBar';
import { getSearchQuery } from '../../../shared/ducks/data-search/selectors';
import { toDatasets } from '../../../store/redux-first-router';

const mapStateToProps = (state) => ({
  searchQuery: getSearchQuery(state)
});

const mapDispatchToProps = (dispatch) => ({
  goToDatasets: () => dispatch(toDatasets())
});

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
