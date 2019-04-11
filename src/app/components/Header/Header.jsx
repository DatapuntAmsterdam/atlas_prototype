import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';
import classNames from 'classnames';
import HEADER_SIZE from '../../../header/services/header-size/header-size.constant';
import { hidePrintMode, hideEmbedMode } from '../../../shared/ducks/ui/ui';

import './Header.scss';

const Header = ({
  homePage,
  hasMaxWidth,
  user,
  printMode,
  embedPreviewMode,
  printOrEmbedMode,
  hasPrintButton,
  hasEmbedButton }) => (
    <div className={classNames({ 'u-fixed': !printMode && !embedPreviewMode })}>
      <div className={`c-dashboard__heading ${classNames({ 'o-max-width': hasMaxWidth })}`} >
        <div className={classNames({ 'o-max-width__inner': hasMaxWidth })}>
          {!printOrEmbedMode &&
            <div className="qa-dashboard__header">
              <AngularWrapper
                moduleName={'dpHeaderWrapper'}
                component="dpSiteHeader"
                dependencies={['atlas']}
                bindings={{
                  size: homePage ? HEADER_SIZE.SIZE.TALL : HEADER_SIZE.SIZE.SHORT,
                  isHomepage: homePage,
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
              <AngularWrapper
                moduleName={'dpHeaderWrapper'}
                component="dpPrintHeader"
                dependencies={['atlas']}
                bindings={{
                  closeAction: hidePrintMode()
                }}
              />

            </div>
          }

          {embedPreviewMode &&
            <div className="qa-dashboard__embed-header">
              <AngularWrapper
                moduleName={'dpHeaderWrapper'}
                component="dpEmbedHeader"
                dependencies={['atlas']}
                bindings={{
                  closeAction: hideEmbedMode()
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
