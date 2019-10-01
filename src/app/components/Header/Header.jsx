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

const style = theme => css`
  z-index: 9999; // Check why this z-index is set when refactoring the print and embed header

  ${styles.HeaderNavigationStyle} {
    // This must be added to the @datapunt/asc-ui project https://github.com/Amsterdam/amsterdam-styled-components/issues/165
    @media screen and ${breakpoint('min-width', 'laptop')({ theme })} {
      margin-left: 29px;
      margin-right: 29px;
    }

    @media screen and ${breakpoint('min-width', 'tabletM')({ theme })} {
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

const HeaderWrapper = styled.section`
  width: 100%;
  z-index: 9999; // Check why this z-index is set when refactoring the print and embed header
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
      <HeaderWrapper data-test="header">
        <HeaderComponent
          tall={homePage}
          title="City Data"
          homeLink="/"
          css={({ theme }) => style(theme, homePage)}
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
