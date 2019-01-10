import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TabBar from './TabBar';
import { getSearchQuery } from '../../../shared/ducks/data-search/selectors';
import { toDatasets } from '../../../store/redux-first-router/actions';

const mapStateToProps = (state) => ({
  searchQuery: getSearchQuery(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  goToDatasets: toDatasets
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
