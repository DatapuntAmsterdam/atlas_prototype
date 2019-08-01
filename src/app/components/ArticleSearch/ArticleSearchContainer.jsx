import { connect } from 'react-redux'

import ArticleSearch from './ArticleSearch'
import { getNumberOfResults, getResults } from '../../../shared/ducks/datasets/datasets'

const mapStateToProps = state => ({
  numberOfResults: getNumberOfResults(state),
  searchResults: getResults(state).data,
})

export default connect(
  mapStateToProps,
  null,
)(ArticleSearch)
