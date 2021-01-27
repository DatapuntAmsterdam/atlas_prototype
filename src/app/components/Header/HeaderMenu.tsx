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
import { ComponentProps, FunctionComponent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import environment from '../../../environment'
import CONSTANTS from '../../../shared/config/constants'
import { HEADER_LINKS_ABOUT, HEADER_LINK_HELP } from '../../../shared/config/content-links'
import { authenticateRequest, getUser } from '../../../shared/ducks/user/user'
import { login, logout } from '../../../shared/services/auth/auth'
import truncateString from '../../../shared/services/truncateString/truncateString'
import { toArticleDetail } from '../../../store/redux-first-router/actions'
import navigationLinks from '../HomePage/services/navigationLinks'
import { openFeedbackForm } from '../Modal/FeedbackModal'

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
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const [menuOpen, setMenuOpen] = useState(false)
  const { trackEvent } = useMatomo()
  const Menu = components[type]

  function handleLogin() {
    dispatch(authenticateRequest('inloggen'))
    login()
  }

  function handleLogout() {
    dispatch(authenticateRequest('uitloggen'))
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
          onClick={async () => {
            trackEvent({
              category: 'navigation',
              action: 'main-menu',
              name: 'Feedback',
            })
            await setMenuOpen(false)
            openFeedbackForm()
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
          to={toArticleDetail(HEADER_LINK_HELP.id[environment.DEPLOY_ENV], HEADER_LINK_HELP.slug)}
        >
          {HEADER_LINK_HELP.title}
        </MenuButton>
      </MenuItem>
      {!user.authenticated ? (
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
        <MenuFlyOut data-test="login" label={truncateString(user.name, 9)}>
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
