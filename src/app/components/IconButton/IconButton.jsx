import PropTypes from 'prop-types'

const IconButton = ({ title, icon, onClick, alignLeft }) => (
  <button
    type="button"
    title={title}
    className={`icon-button icon-button${alignLeft ? '__left' : '__right'}`}
    onClick={onClick}
  >
    <span
      className={`
        rc-icon-button
        rc-icon-button--${icon}
      `}
    />
  </button>
)

IconButton.defaultProps = {
  alignLeft: false,
}

IconButton.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  alignLeft: PropTypes.bool,
}

export default IconButton
