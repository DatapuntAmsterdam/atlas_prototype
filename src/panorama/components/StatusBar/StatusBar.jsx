import React from 'react'
import PropTypes from 'prop-types'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system/crs-converter'
import { dateToString } from '../../../shared/services/date-formatter/date-formatter'

// Todo AfterBeta: can be removed if ViewerInfoBar is implemented in ConstructionFiles viewer
const convertLocation = (location) => {
  const [latitude, longitude] = location
  const { x: rdX, y: rdY } = wgs84ToRd({ latitude, longitude })
  const formattedWgs84Location = `${latitude.toFixed(7)}, ${longitude.toFixed(7)}`

  return `${rdX.toFixed(2)}, ${rdY.toFixed(2)} (${formattedWgs84Location})`
}

const StatusBar = ({ date, location }) => (
  <div className="c-panorama-status-bar">
    <div className="c-panorama-status-bar__items">
      <div className="c-panorama-status-bar__history">
        <span>{dateToString(date)}</span>
      </div>
      <div className="c-panorama-status-bar__coordinates">
        <span>{convertLocation(location)}</span>
      </div>
    </div>
  </div>
)

StatusBar.defaultProps = {
  date: '',
}

StatusBar.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  location: PropTypes.instanceOf(Array).isRequired,
}

export default StatusBar
