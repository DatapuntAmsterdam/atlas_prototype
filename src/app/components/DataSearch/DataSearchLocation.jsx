import { connect } from 'react-redux';
import { getMapListResults } from '../../../shared/ducks/data-search/selectors';
import DataSearch from './DataSearchContainer';

const mapStateToProps = (state) => ({
  searchResults: getMapListResults(state)
});

export default connect(mapStateToProps, null)(DataSearch);
