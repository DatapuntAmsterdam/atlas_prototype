import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ChevronRight } from '@amsterdam/asc-assets'
import { Icon, themeColor } from '@amsterdam/asc-ui'

const StyledIcon = styled(Icon)`
  svg path {
    fill: ${themeColor('tint', 'level5')};
  }
`

const MapSearchResultsItem = ({ label, onClick, statusLabel }) => (
  <li className="map-search-results-item">
    <button
      type="button"
      className="map-search-results-item__button"
      onClick={onClick}
      title={label}
    >
      <section className="map-search-results-item__content">
        <div className="map-search-results-item__name">{label}</div>
        {statusLabel && statusLabel.length > 1 ? (
          <div className="map-search-results-item__status">{statusLabel.toLowerCase()}</div>
        ) : (
          ''
        )}
      </section>
      <StyledIcon size={12}>
        <ChevronRight />
      </StyledIcon>
    </button>
  </li>
)

MapSearchResultsItem.defaultProps = {
  statusLabel: '',
}

MapSearchResultsItem.propTypes = {
  label: PropTypes.string.isRequired,
  statusLabel: PropTypes.string,
  onClick: PropTypes.func, // eslint-disable-line
}

export default MapSearchResultsItem
