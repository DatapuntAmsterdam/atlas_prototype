import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  hasPrintMode,
  hideEmbedPreview,
  hidePrintMode,
  isMapActive,
} from '../../../shared/ducks/ui/ui'
import Header from './Header'
import { getUser } from '../../../shared/ducks/user/user'

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      hidePrintMode,
      hideEmbedPreview,
    },
    dispatch,
  )

const mapStateToProps = (state) => ({
  user: getUser(state),
  hasPrintButton: hasPrintMode(state),
  hasEmbedButton: isMapActive(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
