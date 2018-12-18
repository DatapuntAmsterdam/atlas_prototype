import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../Panel/Panel';

const NoDetailsAvailable = ({ layerWarning }) => (
  <div className="qa-highlight-warning c-panel--offsets-below-page-title">
    <Panel
      isPanelVisible={layerWarning}
      canClose
      type="warning"
    >
      Geen details beschikbaar van: {layerWarning}
    </Panel>
  </div>
);

NoDetailsAvailable.defaultProps = {
  layerWarning: null
};

NoDetailsAvailable.propTypes = {
  layerWarning: PropTypes.string
};

export default NoDetailsAvailable;
