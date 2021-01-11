import PropTypes from 'prop-types'

const PointsAvailable = ({ markersLeft }) => {
  const label =
    markersLeft === 0
      ? 'Geen punten meer mogelijk'
      : `Nog ${markersLeft} punt${markersLeft !== 1 ? 'en' : ''} mogelijk`

  return (
    <div className="points-available">
      <span aria-label={label} className="points-available__label">
        {label}
      </span>
    </div>
  )
}

PointsAvailable.propTypes = {
  markersLeft: PropTypes.number.isRequired,
}

export default PointsAvailable
