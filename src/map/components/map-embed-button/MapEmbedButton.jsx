import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { getEmbedButtonLink } from '../../../shared/services/embed-url/embed-url'
import { toggleEmbedButtonAction } from '../../ducks/map/actions'

const MapEmbedButton = ({ toggleEmbedButton }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault()
      toggleEmbedButton()
      setTimeout(() => window.open(getEmbedButtonLink(), '_blank'), 300)
    }}
    title="Naar interactieve kaart"
    className="c-embed-button"
    data-test="embed-button"
  >
    <span className="c-embed-button__icon c-embed-button__icon--maximize" />
    <span className="c-embed-button__label">data.amsterdam.nl</span>
  </button>
)

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleEmbedButton: toggleEmbedButtonAction,
    },
    dispatch,
  )

MapEmbedButton.propTypes = {
  toggleEmbedButton: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(MapEmbedButton)
