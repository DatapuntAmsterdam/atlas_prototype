import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideEmbedMode, hidePrintMode } from '../../../shared/ducks/ui/ui'
import Header from './Header'

/* istanbul ignore next */
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      hidePrintMode,
      hideEmbedMode,
    },
    dispatch,
  )

export default connect(
  null,
  mapDispatchToProps,
)(Header)
