import { connect } from 'react-redux';
import { getSearchQueryResults } from '../../../shared/ducks/data-search/selectors';
import DataSearch from './DataSearchContainer';

const mapStateToProps = (state) => ({
  searchResults: getSearchQueryResults(state)
});

export default connect(mapStateToProps, null)(DataSearch);
