import { connect } from 'react-redux'
import { authenticateRequest, getUser } from '../../../shared/ducks/user/user'
import { login, logout } from '../../../shared/services/auth/auth'
import { openFeedbackForm } from '../Modal/FeedbackModal'
import HeaderMenu from './HeaderMenu'

/* istanbul ignore next */
const mapStateToProps = (state) => ({
  user: getUser(state),
})

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({
  showFeedbackForm: openFeedbackForm,
  login: () => {
    dispatch(authenticateRequest('inloggen'))
    login()
  },
  logout: () => {
    dispatch(authenticateRequest('uitloggen'))
    logout()
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenu)
