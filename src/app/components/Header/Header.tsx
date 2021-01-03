import {
  AmsterdamLogo,
  breakpoint,
  Header as HeaderComponent,
  showAboveBackDrop,
  styles,
} from '@amsterdam/asc-ui'
import classNames from 'classnames'
import { FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import HeaderSearch from '../../../header/components/HeaderSearch'
import EmbedHeader from './EmbedHeader'
import HeaderMenu from './HeaderMenu'
import PrintHeader from './PrintHeader'

const stickyStyle = css`
  position: sticky;
  top: 0;
`

const HeaderWrapper = styled.section`
  width: 100%;

  // As position: sticky isn't supported on IE, this is needed to have position the header on top of the other content
  position: relative;

  ${showAboveBackDrop(true)}

  // Add position: sticky for supported browsers
  ${({ isHomePage }) =>
    isHomePage
      ? css`
          @media screen and ${breakpoint('max-width', 'laptopM')} {
            ${stickyStyle}
          }
        `
      : stickyStyle}
`

const StyledHeader = styled(HeaderComponent)`
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
  printMode: boolean
  embedPreviewMode: boolean
  printOrEmbedMode: boolean
}

const Header: FunctionComponent<HeaderProps> = ({
  homePage,
  printOrEmbedMode,
  printMode,
  embedPreviewMode,
  hasMaxWidth,
}) => {
  if (!printOrEmbedMode) {
    return (
      <HeaderWrapper isHomePage={homePage} data-test="header">
        <StyledHeader
          tall={homePage}
          title="Data en informatie"
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
              <HeaderMenu
                type="mobile"
                align="right"
                data-test="header-menu-mobile"
                hideAt="laptopM"
              />
            </>
          }
        />
      </HeaderWrapper>
    )
  }

  return (
    <div className={classNames({ 'u-fixed': !printMode && !embedPreviewMode })}>
      <div
        className={`c-dashboard__heading ${classNames({
          'o-max-width': hasMaxWidth,
        })}`}
      >
        <div className={classNames({ 'o-max-width__inner': hasMaxWidth })}>
          {printMode && <PrintHeader />}
          {embedPreviewMode && <EmbedHeader />}
        </div>
      </div>
    </div>
  )
}

export default Header
