import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { css } from '@datapunt/asc-core'
import { Header as HeaderComponent, styles, breakpoint, ascDefaultTheme } from '@datapunt/asc-ui'
import HeaderSearchContainer from '../../../header/containers/header-search/HeaderSearchContainer'
import { useAppReducer } from '../../utils/useAppReducer'
import HeaderMenuContainer from './HeaderMenuContainer'

import EmbedHeader from './EmbedHeader'
import PrintHeader from './PrintHeader'

const style = homePage => css`
  ${styles.HeaderWrapperStyle} {
    ${homePage &&
      css`
        @media screen and ${breakpoint('min-width', 'laptopM')({
            theme: ascDefaultTheme,
          })} {
          /* The "tall" header has a position relative on the homepage only, while the smaller header has a fixed position */
          position: relative;
          margin: 0;
        }
      `}
  }
  ${styles.HeaderNavigationStyle} {
    @media screen and ${breakpoint('min-width', 'tabletM')({
        theme: ascDefaultTheme,
      })} {
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
  const setBackDrop = payload => {
    actions.setBackDrop({
      payload,
    })
  }

  if (!printOrEmbedMode) {
    return (
      <section className="styled-header" data-test="header">
        <HeaderComponent
          tall={homePage}
          title="City Data"
          homeLink="/"
          css={() => style(homePage)}
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
      </section>
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
