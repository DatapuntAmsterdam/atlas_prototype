import { ChevronDown, ExternalLink } from '@amsterdam/asc-assets'
import { ContextMenu, ContextMenuItem, Icon } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ReactComponent as Clock } from '../../../shared/assets/icons/Clock.svg'
import { fetchPanoramaRequestExternal, setPanoramaTags } from '../../ducks/actions'
import { PANO_LABELS } from '../../ducks/constants'
import { getStreetViewUrl } from '../../services/panorama-api/panorama-api'

const PanoramaToggle = ({
  heading,
  currentLabel,
  location,
  openPanoramaTags,
  openPanoramaExternal,
}) => {
  const [showMenu, showMenuToggle] = React.useState(null)

  React.useEffect(() => {
    showMenuToggle(null)
  }, [currentLabel])

  const handleOpenPanoramaExternal = () => {
    const url = getStreetViewUrl(location, heading)

    openPanoramaExternal()
    showMenuToggle(false)
    window.open(url, '_blank')
  }

  const handleSetPanoramaTags = (tags) => {
    openPanoramaTags(tags)
    showMenuToggle(false)
  }

  return (
    <section className="context-menu panorama-menu">
      <ContextMenu
        alt="Actiemenu"
        open={showMenu}
        arrowIcon={<ChevronDown />}
        icon={
          <Icon padding={4} inline size={24}>
            <Clock />
          </Icon>
        }
        label={currentLabel}
        position="bottom"
      >
        {PANO_LABELS.map(({ id, label, tags }, index) => (
          <ContextMenuItem
            key={id}
            divider={index === PANO_LABELS.length - 1}
            role="button"
            onClick={() => handleSetPanoramaTags(tags)}
            icon={<Icon padding={4} inline size={24} />}
          >
            {label}
          </ContextMenuItem>
        ))}
        <ContextMenuItem
          key="google-street-view"
          role="button"
          onClick={() => handleOpenPanoramaExternal()}
          icon={
            <Icon padding={4} inline size={24}>
              <ExternalLink />
            </Icon>
          }
        >
          Google Street View
        </ContextMenuItem>
      </ContextMenu>
    </section>
  )
}

PanoramaToggle.defaultProps = {
  location: '',
}

PanoramaToggle.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentLabel: PropTypes.string.isRequired,
  location: PropTypes.instanceOf(Array),
  openPanoramaTags: PropTypes.PropTypes.func.isRequired,
  openPanoramaExternal: PropTypes.PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      openPanoramaTags: setPanoramaTags,
      openPanoramaExternal: fetchPanoramaRequestExternal,
    },
    dispatch,
  )

export default connect(null, mapDispatchToProps)(PanoramaToggle)
