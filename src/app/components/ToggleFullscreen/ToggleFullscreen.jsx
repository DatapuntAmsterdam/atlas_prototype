import PropTypes from 'prop-types'
import IconButton from '../IconButton/IconButton'

const ToggleFullscreen = ({ isFullscreen, title, onToggleFullscreen, alignLeft }) => (
  <IconButton
    title={isFullscreen ? `${title} verkleinen` : `${title} vergroten`}
    icon={isFullscreen ? 'minimize' : 'maximize'}
    onClick={onToggleFullscreen}
    alignLeft={alignLeft}
    extraClass="qa-toggle-fullscreen"
  />
)

ToggleFullscreen.defaultProps = {
  alignLeft: false,
}

ToggleFullscreen.propTypes = {
  alignLeft: PropTypes.bool,
  isFullscreen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired,
}

export default ToggleFullscreen
