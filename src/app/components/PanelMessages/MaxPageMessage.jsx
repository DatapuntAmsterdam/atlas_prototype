import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../Panel/Panel';

const MaxPageMessage = ({ maxAvailablePages }) => (
  <Panel
    isPanelVisible
    canClose
    type="warning"
  >
    <div className="qa-message-max-pages">
      <h2 className="c-panel__title">Deze pagina kan niet worden getoond</h2>
      <p className="c-panel__paragraph">
        Alleen de eerste {maxAvailablePages} pagina&apos;s kunnen
        worden
        weergegeven (om technische redenen). Bij
        downloaden worden wel alle resultaten opgenomen.
      </p>
      <p className="c-panel__paragraph">
        Tip: Gebruik de download-knop om alle resultaten te bekijken. Of voeg
        meer
        filtercriteria
        toe voor specifiekere resultaten.
      </p>
    </div>
  </Panel>
);

MaxPageMessage.propTypes = {
  maxAvailablePages: PropTypes.number.isRequired
};

export default MaxPageMessage;
