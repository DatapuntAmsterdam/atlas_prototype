import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { ControlButton } from '@amsterdam/arm-core'
import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { ExternalLink } from '@amsterdam/asc-assets'
import { getEmbedButtonLink } from '../../../shared/services/embed-url/embed-url'
import { toggleEmbedButtonAction } from '../../ducks/map/actions'

export const StyledControlButton = styled(ControlButton)`
  position: absolute;
  right: ${themeSpacing(2)};
  top: ${themeSpacing(2)};
  z-index: 1;

  svg path {
    fill: ${themeColor('tint', 'level7')};
  }
`

const MapEmbedButton = ({ toggleEmbedButton }) => (
  <StyledControlButton
    variant="blank"
    iconSize={18}
    type="button"
    onClick={(e) => {
      e.preventDefault()
      toggleEmbedButton()
      setTimeout(() => window.open(getEmbedButtonLink(), '_blank'), 300)
    }}
    title="Naar interactieve kaart"
    data-test="embed-button"
    iconLeft={<ExternalLink />}
  >
    data.amsterdam.nl
  </StyledControlButton>
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
