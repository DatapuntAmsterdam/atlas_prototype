import {
  AmsterdamLogo,
  breakpoint,
  Header as HeaderComponent,
  showAboveBackDrop,
  styles,
} from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'
import type { FunctionComponent } from 'react'
import HeaderSearch from '../../../header/components/HeaderSearch'
import HeaderMenu from './HeaderMenu'

const stickyStyle = css`
  position: sticky;
  top: 0;
`

interface HeaderWrapperProps {
  isHomePage: boolean
}

const HeaderWrapper = styled.section<HeaderWrapperProps>`
  width: 100%;
  // As position: sticky isn't supported on IE, this is needed to have position the header on top of the other content
  position: relative;

  @media print {
    display: none;
  }

  ${({ isHomePage }) =>
    isHomePage
      ? css`
          @media screen and ${breakpoint('max-width', 'laptopM')} {
            ${stickyStyle}
          }
        `
      : stickyStyle}

  ${showAboveBackDrop(true) as any}
`

const StyledHeader = styled(HeaderComponent)`
  a {
    /* Making sure the anchors in the header have a decent clickable area size */
    display: flex;
    height: 100%;
    align-items: center;
  }

  ${styles.HeaderNavigationStyle} {
    // This must be added to the @amsterdam/asc-ui project https://github.com/Amsterdam/amsterdam-styled-components/issues/165
    @media screen and ${breakpoint('min-width', 'desktop')} {
      margin-left: 29px;
      margin-right: 29px;
    }

    @media screen and ${breakpoint('min-width', 'tabletM')} {
      justify-content: space-between;
    }
  }
`

export interface HeaderProps {
  homePage: boolean
  hasMaxWidth: boolean
}

const Header: FunctionComponent<HeaderProps> = ({ homePage, hasMaxWidth }) => (
  <HeaderWrapper isHomePage={homePage} data-testid="header">
    <StyledHeader
      tall={homePage}
      title="Data verkenner"
      homeLink="/"
      className="styled-header"
      fullWidth={!hasMaxWidth}
      logo={AmsterdamLogo}
      navigation={
        <>
          <HeaderSearch />
          <HeaderMenu
            type="default"
            data-test="header-menu-default"
            tall={homePage}
            showAt="laptopM"
          />
          <HeaderMenu type="mobile" align="right" data-test="header-menu-mobile" hideAt="laptopM" />
        </>
      }
    />
  </HeaderWrapper>
)

export default Header
