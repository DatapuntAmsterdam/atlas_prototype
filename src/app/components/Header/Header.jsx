import {
  AmsterdamLogo,
  breakpoint,
  Header as HeaderComponent,
  showAboveBackDrop,
  styles,
} from '@amsterdam/asc-ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import HeaderSearch from '../../../header/components/HeaderSearch'
import EmbedHeader from './EmbedHeader'
import HeaderMenuContainer from './HeaderMenuContainer'
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
  h1,
  nav {
    position: relative;
    z-index: 1;
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

const Header = ({
  homePage,
  printOrEmbedMode,
  printMode,
  embedPreviewMode,
  hasMaxWidth,
  hidePrintMode,
  hideEmbedPreview,
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
              <HeaderMenuContainer
                type="default"
                data-test="header-menu-default"
                tall={homePage}
                showAt="laptopM"
              />
              <HeaderMenuContainer
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
          {printMode && <PrintHeader closeAction={hidePrintMode} />}
          {embedPreviewMode && <EmbedHeader closeAction={hideEmbedPreview} />}
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  homePage: PropTypes.bool.isRequired,
  hasMaxWidth: PropTypes.bool.isRequired,
  printMode: PropTypes.bool.isRequired,
  embedPreviewMode: PropTypes.bool.isRequired,
  printOrEmbedMode: PropTypes.bool.isRequired,
}

export default Header
