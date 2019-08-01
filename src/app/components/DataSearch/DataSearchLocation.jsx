import { connect } from 'react-redux'
import { getMapListResults } from '../../../shared/ducks/data-search/selectors'
import DataSearchContainer from './DataSearchContainer'

const mapStateToProps = state => ({
  searchResults: getMapListResults(state),
})

export default connect(
  mapStateToProps,
  null,
)(DataSearchContainer)
