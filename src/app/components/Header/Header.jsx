import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';
import classNames from 'classnames';
import headerSize from '../../../header/services/header-size/header-size.constant';
// import { hideEmbedMode, hidePrintMode } from '../../../../src/shared/ducks/ui/ui';

import './Header.scss';
import { hidePrintMode, hideEmbedMode } from '../../../shared/ducks/ui/ui';

const Header = ({ homePage, hasMaxWidth, user, printMode, embedPreviewMode, printOrEmbedMode,
  hasPrintButton, hasEmbedButton }) => (
    // <AngularWrapper
    //   moduleName={'dpHeaderWrapper'}
    //   component="dpHeader"
    //   dependencies={['atlas']}
    //   bindings={{
    //     isHomePage: homePage,
    //     hasMaxWidth,
    //     user,
    //     isPrintMode: printMode,
    //     isEmbedPreview: embedPreviewMode,
    //     isPrintOrEmbedOrPreview: printOrEmbedMode
    //   }}
    // />);

    <div className={classNames({ 'u-fixed': !printMode && !embedPreviewMode })}>
      <div className={`c-dashboard__heading ${classNames({ 'o-max-width': hasMaxWidth })}`} >
        <div className={classNames({ 'o-max-width__inner': hasMaxWidth })}>
          {!printOrEmbedMode &&
            <div className="qa-dashboard__header">
              {/* <dp-site-header
                size="vm.headerSize"
                user="vm.user"
                is-homepage="header.isHomepage"
                has-print-button="header.hasPrintButton"
                has-embed-button="header.hasEmbedButton"
              /> */}
              <AngularWrapper
                moduleName={'dpHeaderWrapper'}
                component="dpSiteHeader"
                dependencies={['atlas']}
                bindings={{
                  size: homePage ? headerSize.SIZE.TALL : headerSize.SIZE.SHORT,
                  isHomePage: homePage,
                  hasMaxWidth,
                  user,
                  hasPrintButton,
                  hasEmbedButton
                }}
              />

            </div>
          }

          {printMode &&
            <div className="qa-dashboard__print-header">
              {/* <dp-print-header close-action="vm.hidePrintAction" /> */}

              <AngularWrapper
                moduleName={'dpHeaderWrapper'}
                component="dpPrintHeader"
                dependencies={['atlas']}
                bindings={{
                  closeAction: hidePrintMode
                }}
              />

            </div>
          }

          {embedPreviewMode &&
            <div className="qa-dashboard__embed-header">
              {/* <dp-embed-header close-action="vm.hideEmbedMode" /> */}

              <AngularWrapper
                moduleName={'dpHeaderWrapper'}
                component="dpEmbedHeader"
                dependencies={['atlas']}
                bindings={{
                  closeAction: hideEmbedMode
                }}
              />

            </div>
          }
        </div>
      </div>
    </div>

  );

Header.propTypes = {
  homePage: PropTypes.bool.isRequired,
  hasMaxWidth: PropTypes.bool.isRequired,
  user: PropTypes.shape({}).isRequired,
  printMode: PropTypes.bool.isRequired,
  embedPreviewMode: PropTypes.bool.isRequired,
  printOrEmbedMode: PropTypes.bool.isRequired,
  hasPrintButton: PropTypes.bool.isRequired,
  hasEmbedButton: PropTypes.bool.isRequired
};

export default Header;
