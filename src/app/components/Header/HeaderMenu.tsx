import { ChevronRight } from '@amsterdam/asc-assets'
import {
  MenuButton,
  MenuFlyOut,
  MenuInline,
  MenuItem,
  MenuToggle,
  themeColor,
} from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { ComponentProps, FunctionComponent } from 'react'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import environment from '../../../environment'
import CONSTANTS from '../../../shared/config/constants'
import { HEADER_LINKS_ABOUT, HEADER_LINK_HELP } from '../../../shared/config/content-links'
import { getName, isAuthenticated, login, logout } from '../../../shared/services/auth/auth'
import truncateString from '../../../shared/services/truncateString/truncateString'
import { toArticleDetail, toHelpPage } from '../../links'
import navigationLinks from '../HomePage/services/navigationLinks'
import { FeedbackModal } from '../Modal'

const StyledMenuInline = styled(MenuInline)<{ tall: boolean }>`
  background-color: ${({ tall, theme }) =>
    tall ? themeColor('tint', 'level2')({ theme }) : themeColor('tint', 'level1')({ theme })};
`

// TODO: Fix z-index issue with overlay in ASC eventually
const StyledMenuToggle = styled(MenuToggle)`
  z-index: 24;
`

const components = {
  default: StyledMenuInline,
  mobile: StyledMenuToggle,
}

function dropFocus() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

export interface HeaderMenuProps {
  type: keyof typeof components
}

const HeaderMenu: FunctionComponent<HeaderMenuProps & ComponentProps<typeof StyledMenuInline>> = ({
  type,
  ...otherProps
}) => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { trackEvent } = useMatomo()
  const Menu = components[type]

  function handleLogin() {
    login()
  }

  function handleLogout() {
    logout()
  }

  return (
    /* @ts-ignore */
    <Menu
      {...otherProps}
      open={menuOpen}
      hasBackDrop
      onExpand={setMenuOpen}
      backdropOpacity={CONSTANTS.BACKDROP_OPACITY}
    >
      <FeedbackModal setOpen={setOpenFeedbackModal} open={openFeedbackModal} />
      <MenuFlyOut label="Onderdelen">
        {navigationLinks.map(({ id, title, to, testId }) => (
          <MenuButton
            onClick={() => {
              trackEvent({
                category: 'navigation',
                action: 'main-menu',
                name: title ?? undefined,
              })
              dropFocus()
            }}
            as={RouterLink}
            iconLeft={<ChevronRight />}
            key={id}
            /* @ts-ignore */
            to={to}
            data-testid={testId}
          >
            {title}
          </MenuButton>
        ))}
      </MenuFlyOut>
      <MenuFlyOut label="Over OIS">
        {HEADER_LINKS_ABOUT.map(({ title, id, slug, testId }) => {
          const linkId: string = id[environment.DEPLOY_ENV]

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
                /* @ts-ignore */
                to={toArticleDetail(linkId, slug)}
                data-testid={testId}
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
          onClick={() => {
            trackEvent({
              category: 'navigation',
              action: 'main-menu',
              name: 'Feedback',
            })
            setMenuOpen(false)
            setOpenFeedbackModal(true)
            dropFocus()
          }}
          data-testid="headerMenuLinkFeedback"
        >
          Feedback
        </MenuButton>
      </MenuItem>
      <MenuItem>
        <MenuButton
          as={RouterLink}
          onClick={() => {
            trackEvent({
              category: 'navigation',
              action: 'main-menu',
              name: HEADER_LINK_HELP.title,
            })
            dropFocus()
          }}
          data-testid={HEADER_LINK_HELP.testId}
          /* @ts-ignore */
          to={toHelpPage()}
        >
          {HEADER_LINK_HELP.title}
        </MenuButton>
      </MenuItem>
      {!isAuthenticated() ? (
        <MenuItem>
          <MenuButton
            type="button"
            onClick={() => {
              handleLogin()
              trackEvent({
                category: 'navigation',
                action: 'main-menu',
                name: 'Login',
              })
              dropFocus()
            }}
            data-testid="headerMenuLinkLogin"
          >
            Inloggen
          </MenuButton>
        </MenuItem>
      ) : (
        <MenuFlyOut data-test="login" label={truncateString(getName(), 9)}>
          <MenuItem>
            <MenuButton
              type="button"
              onClick={() => {
                handleLogout()
                trackEvent({
                  category: 'navigation',
                  action: 'main-menu',
                  name: 'Logout',
                })
                dropFocus()
              }}
              iconLeft={<ChevronRight />}
              data-testid="headerMenuLinkLogout"
            >
              Uitloggen
            </MenuButton>
          </MenuItem>
        </MenuFlyOut>
      )}
    </Menu>
  )
}

export default HeaderMenu
