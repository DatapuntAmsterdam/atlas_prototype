import React from 'react';
import Link from 'redux-first-router-link';
import { routing } from '../../routes';
import Panel from '../Panel/Panel';

const NotAuthorizedPanel = () => (
  <Panel
    isPanelVisible
    canClose
    type="warning"
  >
    <div>
      <p className="c-panel__paragraph">
        Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met zakelijk
        rechthebbenden te bekijken.
      </p>
      <p className="c-panel__paragraph">
        Zie
        <Link
          className="c-link--light qa-link-to-page-button qa-dp-link"
          to={{
            type: routing.bediening.type,
            payload: { deeplink: 'inloggen' }
          }}
        >
          Help &#62; Bediening &#62; Inloggen
        </Link>
      </p>
    </div>
  </Panel>
);

export default NotAuthorizedPanel;
