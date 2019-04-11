import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';

import './Header.scss';

const Header = ({ homePage, hasMaxWidth, user, printMode, embedPreviewMode, printOrEmbedMode }) => (
  <AngularWrapper
    moduleName={'dpHeaderWrapper'}
    component="dpHeader"
    dependencies={['atlas']}
    bindings={{
      isHomePage: homePage,
      hasMaxWidth,
      user,
      isPrintMode: printMode,
      isEmbedPreview: embedPreviewMode,
      isPrintOrEmbedOrPreview: printOrEmbedMode
    }}
  />
);

Header.propTypes = {
  homePage: PropTypes.string.isRequired,
  hasMaxWidth: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  printMode: PropTypes.string.isRequired,
  embedPreviewMode: PropTypes.string.isRequired,
  printOrEmbedMode: PropTypes.string.isRequired
};

export default Header;
