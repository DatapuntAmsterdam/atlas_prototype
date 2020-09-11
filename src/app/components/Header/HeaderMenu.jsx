import { ChevronRight } from '@datapunt/asc-assets'
import {
  MenuButton,
  MenuFlyOut,
  MenuInline,
  MenuItem,
  MenuToggle,
  themeColor,
} from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import environment from '../../../environment'
import { HEADER_LINKS } from '../../../shared/config/config'
import CONSTANTS from '../../../shared/config/constants'
import truncateString from '../../../shared/services/truncateString/truncateString'
import { toArticleDetail } from '../../../store/redux-first-router/actions'
import navigationLinks from '../HomePage/services/navigationLinks'

const StyledMenuInline = styled(MenuInline)`
  background-color: ${({ tall, theme }) =>
    tall ? themeColor('tint', 'level2')({ theme }) : themeColor('tint', 'level1')({ theme })};
`

const components = {
  default: StyledMenuInline,
  mobile: MenuToggle,
}

function dropFocus() {
  document.activeElement?.blur()
}

const HeaderMenu = ({ type, login, logout, user, showFeedbackForm, ...props }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { trackEvent } = useMatomo()
  const Menu = components[type]

  return (
    <Menu
      {...props}
      open={menuOpen}
      hasBackDrop
      onExpand={setMenuOpen}
      backdropOpacity={CONSTANTS.BACKDROP_OPACITY}
    >
      <MenuFlyOut label="Onderdelen">
        {navigationLinks.map(({ id, title, to }) => (
          <MenuButton
            onClick={() => {
              trackEvent({
                category: 'navigation',
                action: 'main-menu',
                name: title,
              })
              dropFocus()
            }}
            as={RouterLink}
            iconLeft={<ChevronRight />}
            key={id}
            title={title}
            to={to}
          >
            {title}
          </MenuButton>
        ))}
      </MenuFlyOut>
      <MenuFlyOut label="Over OIS">
        {HEADER_LINKS &&
          HEADER_LINKS.ABOUT.map(({ title, id, slug }) => {
            const linkId = id[environment.DEPLOY_ENV]

            return (
              <MenuItem key={linkId}>
                <MenuButton
                  onClick={() => {
                    trackEvent({
                      category: 'navigation',
                      action: 'main-menu',
                      name: title,
                    })
                    dropFocus()
                  }}
                  as={RouterLink}
                  iconLeft={<ChevronRight />}
                  title={title}
                  to={toArticleDetail(linkId, slug)}
                >
                  {title}
                </MenuButton>
              </MenuItem>
            )
          })}
      </MenuFlyOut>
      <MenuItem>
        <MenuButton
          type="button"
          onClick={async () => {
            trackEvent({
              category: 'navigation',
              action: 'main-menu',
              name: 'Feedback',
            })
            await setMenuOpen(false)
            showFeedbackForm()
            dropFocus()
          }}
        >
          Feedback
        </MenuButton>
      </MenuItem>
      {HEADER_LINKS && (
        <MenuItem>
          <MenuButton
            as={RouterLink}
            onClick={() => {
              trackEvent({
                category: 'navigation',
                action: 'main-menu',
                name: HEADER_LINKS.HELP.title,
              })
              dropFocus()
            }}
            title={HEADER_LINKS.HELP.title}
            to={toArticleDetail(
              HEADER_LINKS.HELP.id[environment.DEPLOY_ENV],
              HEADER_LINKS.HELP.slug,
            )}
          >
            {HEADER_LINKS.HELP.title}
          </MenuButton>
        </MenuItem>
      )}
      {!user.authenticated ? (
        <MenuItem>
          <MenuButton
            type="button"
            onClick={(e) => {
              login(e)
              trackEvent({
                category: 'navigation',
                action: 'main-menu',
                name: 'Login',
              })
              dropFocus()
            }}
          >
            Inloggen
          </MenuButton>
        </MenuItem>
      ) : (
        <MenuFlyOut data-test="login" label={truncateString(user.name, 9)}>
          <MenuItem>
            <MenuButton
              type="button"
              onClick={(e) => {
                logout(e)
                trackEvent({
                  category: 'navigation',
                  action: 'main-menu',
                  name: 'Logout',
                })
                dropFocus()
              }}
              iconLeft={<ChevronRight />}
            >
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
