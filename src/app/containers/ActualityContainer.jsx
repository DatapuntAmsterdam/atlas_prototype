import React from 'react';
import { AngularWrapper } from 'react-angular';

const ActualityContainer = () => (
  <div className="c-page">
    <div
      style={{ display: 'block' }}
      className="c-dashboard__column  u-col-sm--12 qa-dashboard__column--right"
    >
      <div className="c-dashboard__page o-max-width">
        <div className="c-dashboard__page-inner c-dashboard__content o-max-width__inner u-gutter">
          <h1 className="o-header__title u-margin__bottom--3">Actualiteit</h1>
          <div className="qa-page">
            <AngularWrapper
              moduleName={'dpMetadataWrapper'}
              component="dpMetadata"
              dependencies={['atlas']}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);


export default ActualityContainer;
