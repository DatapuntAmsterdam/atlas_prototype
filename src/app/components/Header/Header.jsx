import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styled, { css } from '@datapunt/asc-core'
import { Header as HeaderComponent, styles, breakpoint } from '@datapunt/asc-ui'
import HeaderSearchContainer from '../../../header/containers/header-search/HeaderSearchContainer'
import { useAppReducer } from '../../utils/useAppReducer'
import HeaderMenuContainer from './HeaderMenuContainer'

import EmbedHeader from './EmbedHeader'
import PrintHeader from './PrintHeader'
import hasTouchCapabilities from '../../../shared/services/touch/has-touch-capabilities'

const HeaderWrapper = styled.section.attrs({
  tabIndex: hasTouchCapabilities ? 0 : -1,
})`
  width: 100%;

  // As position: sticky isn't supported on IE, this is needed to have position the header on top of the other contents
  z-index: 999;
  position: relative;

  // Add position: sticky for supported browsers
  ${({ isHomePage }) =>
    !isHomePage &&
    css`
      position: sticky;
      top: 0;
    `}
`

const StyledHeader = styled(HeaderComponent)`
  ${styles.HeaderNavigationStyle} {
    // This must be added to the @datapunt/asc-ui project https://github.com/Amsterdam/amsterdam-styled-components/issues/165
    @media screen and ${breakpoint('min-width', 'laptop')} {
      margin-left: 29px;
      margin-right: 29px;
    }

    @media screen and ${breakpoint('min-width', 'tabletM')} {
      justify-content: space-between;
    }

    fieldset > ${styles.SearchBarStyle} {
      flex-grow: 1;
      max-width: 80%;

      ${styles.TextFieldStyle} {
        flex-grow: 0;
        width: 100%;
      }
    }
  }
`

const MenuDefault = props => <HeaderMenuContainer {...props} type="default" />
const MenuMobile = props => <HeaderMenuContainer {...props} type="mobile" align="right" />

const Header = ({
  homePage,
  printOrEmbedMode,
  printMode,
  embedPreviewMode,
  hasMaxWidth,
  hidePrintMode,
  hideEmbedMode,
}) => {
  const [, actions] = useAppReducer('ui')
  const setBackDrop = open => {
    actions.setBackDrop({
      payload: {
        open,
        key: 'menu',
      },
    })
  }

  if (!printOrEmbedMode) {
    return (
      <HeaderWrapper isHomePage={homePage} data-test="header">
        <StyledHeader
          tall={homePage}
          title="Data en informatie"
          homeLink="/"
          className="styled-header"
          fullWidth={!hasMaxWidth}
          navigation={
            <React.Fragment>
              <HeaderSearchContainer />
              <MenuDefault
                data-test="header-menu-default"
                showAt="laptopM"
                onExpand={setBackDrop}
              />
              <MenuMobile data-test="header-menu-mobile" hideAt="laptopM" onExpand={setBackDrop} />
            </React.Fragment>
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
          {embedPreviewMode && <EmbedHeader closeAction={hideEmbedMode} />}
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
