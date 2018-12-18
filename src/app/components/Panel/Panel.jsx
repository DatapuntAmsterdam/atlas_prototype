import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';

const Panel = ({ children, isPanelVisible, canClose, type }) => (
  <AngularWrapper
    moduleName={'dpPanelWrapper'}
    component="dpPanel"
    dependencies={['atlas']}
    bindings={{
      isPanelVisible,
      canClose
    }}
    interpolateBindings={{
      type
    }}
  >
    {children}
  </AngularWrapper>
);

Panel.defaultProps = {
  type: 'info',
  canClose: true,
  isPanelVisible: false,
  children: null
};

Panel.propTypes = {
  isPanelVisible: PropTypes.bool,
  canClose: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node
};

export default Panel;
