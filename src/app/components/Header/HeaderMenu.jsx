import React from 'react'
import { MenuInline, MenuToggle, MenuFlyOut, MenuItem, MenuButton } from '@datapunt/asc-ui'
import { ChevronRight } from '@datapunt/asc-assets'
import PropTypes from 'prop-types'
import RouterLink from 'redux-first-router-link'
import {
  toApisPage,
  toAvailabilityPage,
  toDatasets,
  toHelpPage,
  toMaintentancePage,
  toMap,
  toPanoramaAndPreserveQuery,
  toPrivacyPage,
} from '../../../store/redux-first-router/actions'
import truncateString from '../../../shared/services/truncateString/truncateString'

const toPanoramaAction = toPanoramaAndPreserveQuery(undefined, undefined, undefined, 'home')
const toMapAction = toMap()
const toDatasetsAction = toDatasets()
const toApisAction = toApisPage()
const toPrivacyAction = toPrivacyPage()
const toAvailabilityAction = toAvailabilityPage()
const toMaintentanceAction = toMaintentancePage()
const toHelpAction = toHelpPage()

const components = {
  default: MenuInline,
  mobile: MenuToggle,
}

const Link = ({ children, ...otherProps }) => (
  <MenuButton $as={RouterLink} {...otherProps}>
    {children}
  </MenuButton>
)

const HeaderMenu = ({ type, login, logout, user, showFeedbackForm, ...props }) => {
  const Menu = components[type]

  return (
    <Menu {...props}>
      <MenuFlyOut label="Onderdelen">
        <MenuItem>
          <Link iconLeft={<ChevronRight />} to={toMapAction}>
            Kaart
          </Link>
        </MenuItem>
        <MenuItem>
          <Link iconLeft={<ChevronRight />} to={toPanoramaAction}>
            Panoramabeelden
          </Link>
        </MenuItem>
        <MenuItem>
          <Link iconLeft={<ChevronRight />} to={toDatasetsAction}>
            Datasets
          </Link>
        </MenuItem>
        <MenuItem>
          <Link iconLeft={<ChevronRight />} to={toApisAction}>
            Data services
          </Link>
        </MenuItem>
      </MenuFlyOut>
      <MenuFlyOut label="Over">
        <MenuItem>
          <Link iconLeft={<ChevronRight />} to={toPrivacyAction}>
            Privacy en informatiebeveiliging
          </Link>
        </MenuItem>
        <MenuItem>
          <Link iconLeft={<ChevronRight />} to={toAvailabilityAction}>
            Beschikbaarheid en kwaliteit data
          </Link>
        </MenuItem>
        <MenuItem>
          <Link iconLeft={<ChevronRight />} to={toMaintentanceAction}>
            Technisch beheer en werkwijze
          </Link>
        </MenuItem>
        <MenuItem>
          <MenuButton iconLeft={<ChevronRight />} href="mailto:datapunt@amsterdam.nl">
            Contact
          </MenuButton>
        </MenuItem>
      </MenuFlyOut>
      <MenuItem>
        <MenuButton type="button" onClick={showFeedbackForm}>
          Feedback
        </MenuButton>
      </MenuItem>
      <MenuItem>
        <Link to={toHelpAction}>Help</Link>
      </MenuItem>

      {!user.authenticated ? (
        <MenuItem>
          <MenuButton type="button" onClick={login}>
            Inloggen
          </MenuButton>
        </MenuItem>
      ) : (
        <MenuFlyOut data-test="login" label={truncateString(user.name, 9)}>
          <MenuItem>
            <MenuButton type="button" onClick={logout} iconLeft={<ChevronRight />}>
              Uitloggen
            </MenuButton>
          </MenuItem>
        </MenuFlyOut>
      )}
    </Menu>
  )
}

HeaderMenu.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  showFeedbackForm: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  user: PropTypes.shape({}).isRequired,
}

export default HeaderMenu
