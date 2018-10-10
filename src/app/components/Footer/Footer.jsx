import React from 'react';
import Link from 'redux-first-router-link';
import { routing } from '../../routes';

const FooterComponent = () => (
  <footer className="c-dashboard__footer o-max-width">
    <div className="c-dashboard__footer-content u-row">
      <div className="u-col-sm--8">
        <div className="u-margin__left--2 c-dashboard__proclaimer">
          <h2 className="c-dashboard__proclaimer-header">Proclaimer</h2>
          <p className="c-dashboard__proclaimer-paragraph">Gemeente Amsterdam
            biedt met City Data een voorziening waar data voor iedereen
            beschikbaar zijn en hergebruikt mogen worden. De gegevens
            worden aangeboden door gemeentelijke en externe partijen. De
            eigenaren van deze gegevens zijn primair verantwoordelijk
            voor de kwaliteit van hun gepubliceerde data. Opmerkingen en
            aanvullingen op de gegevens kunt u <a
              className="c-link--inverse"
              href="mailto:terugmelding.basisinformatie@amsterdam.nl"
            >melden</a>.
          </p>
          <p className="c-dashboard__proclaimer-paragraph">
            <Link // eslint-disable-line jsx-a11y/anchor-is-valid
              to={{ type: routing.proclaimer.type }}
              className="o-btn o-btn--link--inverse"
            >Lees de hele proclaimer</Link>
          </p>
        </div>
      </div>
      <div className="u-col-sm--3 u-col-sm--offset-1">
        <div className="c-dashboard__social">
          <h2 className="c-dashboard__social-header">Volg de gemeente</h2>
          <div className="c-dashboard__social-link">
            <a
              className="o-btn--link--inverse"
              href="https://twitter.com/AmsterdamNL"
              rel="external noopener noreferrer"
              target="_blank"
            >Twitter</a>
          </div>
          <div className="c-dashboard__social-link">
            <a
              className="o-btn o-btn--link--inverse"
              href="https://www.facebook.com/gemeenteamsterdam"
              rel="external noopener noreferrer"
              target="_blank"
            >Facebook</a>
          </div>
          <div className="c-dashboard__social-link">
            <a
              className="o-btn o-btn--link--inverse"
              href="https://www.linkedin.com/company/gemeente-amsterdam"
              rel="external noopener noreferrer"
              target="_blank"
            >LinkedIn</a>
          </div>
          <div className="c-dashboard__social-link">
            <a
              className="o-btn o-btn--link--inverse"
              href="https://github.com/Amsterdam"
              rel="external noopener noreferrer"
              target="_blank"
            >GitHub</a>
          </div>
        </div>
      </div>
      <div className="u-clearfix" />
    </div>
  </footer>
);

export default FooterComponent;
