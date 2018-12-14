import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import { AngularWrapper } from 'react-angular';
import { routing } from '../routes';
import Footer from '../components/Footer/Footer';
import PreviewVideo from '../components/PreviewVideo/PreviewVideo';
import HomepageAddressBlock from '../../homepage/components/address-block/HomepageAddressBlock';
import HomepageBlock from '../../homepage/components/block/HomepageBlock';
import { toDatasets, toPanorama } from '../../store/redux-first-router';

const HOMEPAGE_CONFIG = {
  PANORAMA: {
    id: 'TMX7316010203-000719_pano_0000_000950',
    heading: 226
  }
};

const INSTRUCTION_LINKS = {
  BEDIENING: {
    route: routing.bediening.type,
    title: 'Bediening'
  },
  GEGEVENS: {
    route: routing.gegevens.type,
    title: 'Gegevens'
  },
  APIS: {
    route: routing.apis.type,
    title: 'API\'s'
  }
};

const ABOUT_LINKS = {
  PRIVACY_BEVEILIGING: {
    route: routing.privacy_beveiliging.type,
    title: 'Privacy en informatiebeveiliging'
  },
  BESCHIKBAAR_KWALITEIT: {
    route: routing.beschikbaar_kwaliteit.type,
    title: 'Beschikbaarheid en kwaliteit data'
  },
  BEHEER_WERKWIJZE: {
    route: routing.beheer_werkwijze.type,
    title: 'Technisch beheer en werkwijze'
  }
};

/* istanbul ignore next */ // TODO: refactor, test
const Home = ({ showFooter }) => (
  <div className="c-dashboard__column u-col-sm--12 qa-dashboard__column--right">
    <div className="c-dashboard__page o-max-width">
      <div className="c-dashboard__page-inner c-dashboard__content o-max-width__inner u-gutter">
        <div className="qa-page">
          <div className="c-homepage u-padding__top--4">
            <div className="u-grid">
              <div className="u-row">
                <div className="u-col-sm--9">
                  <div className="qa-map-link">
                    <HomepageBlock
                      classes="c-homepage__block--left"
                      linkAction={{ type: routing.map.type }}
                      title="Data op de kaart"
                      description="Selecteer kaartlagen, vind gegevens op een punt in de kaart,
                        meet of teken een gebied"
                      blockIsLink
                    >
                      <PreviewVideo
                        poster="/assets/video/map.png"
                        src="/assets/video/map.mp4"
                        type="video/mp4"
                      />
                      <div className="c-homepage__block-button">
                        <div className="o-btn--transparent">Data op de kaart</div>
                        <div className="c-homepage__block-details">Selecteer kaartlagen, vind
                          gegevens op
                          een punt in de kaart, meet of teken een gebied
                        </div>
                      </div>
                    </HomepageBlock>
                  </div>
                </div>
                <div className="u-col-sm--3">
                  <div>
                    <a
                      href="https://maps.amsterdam.nl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`c-homepage__block
                          c-homepage__block--right
                          c-homepage__block--tall
                          c-homepage__block--amsterdam-maps`}
                    >
                      <div className="c-homepage__block-button c-homepage__block-button--tall">
                        <div className="c-homepage__block-details-title o-btn--transparent">
                          Meer op Maps Amsterdam
                        </div>
                        <div className="c-homepage__block-details">
                          Ruimtelijke themakaarten (nog te integreren)
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="u-row">
                <div className="u-col-sm--6 c-homepage__block--data-selection">
                  <HomepageBlock
                    classes="c-homepage__block--left c-homepage__block--datasets"
                    linkAction={toDatasets()}
                    title="Datasetcatalogus"
                    description="Blader door datasets (verzamelingen gegevens)"
                    blockIsLink
                  >
                    <AngularWrapper
                      moduleName="dpCatalogusThemesWrapper"
                      component="dpCatalogusThemes"
                      dependencies={['atlas']}
                    />
                  </HomepageBlock>
                </div>

                <div
                  className="u-col-sm--3 c-homepage__block--address"
                  id="homepage-address-block"
                >
                  <HomepageAddressBlock />
                </div>

                <div className="u-col-sm--3">
                  <div className="qa-straatbeeld-link">
                    <HomepageBlock
                      classes="c-homepage__block--right"
                      linkAction={
                        toPanorama(HOMEPAGE_CONFIG.PANORAMA.id, HOMEPAGE_CONFIG.PANORAMA.heading)
                      }
                      title="Panoramabeelden"
                      description="Kijk rond ter plaatse"
                      blockIsLink
                    >
                      <PreviewVideo
                        poster="/assets/video/panorama.jpg"
                        src="/assets/video/panorama.mp4"
                        type="video/mp4"
                      />
                    </HomepageBlock>
                  </div>
                </div>
              </div>
              <div className="u-row">
                <div className="c-homepage__news">
                  <div className="u-col-sm--9">
                    <div>
                      <h1 className="u-padding__left--3 c-homepage__news-header">Nieuws</h1>
                      <div>
                        <AngularWrapper
                          moduleName="dpUserContentWidgetWrapper"
                          component="dpUserContentWidget"
                          dependencies={['atlas']}
                          bindings={{
                            limitTo: 3
                          }}
                          interpolateBindings={{
                            type: 'news'
                          }}
                        />
                      </div>
                      <div className="u-padding__left--3 c-homepage__news-show-more">
                        <Link
                          to={{ type: routing.nieuws.type }}
                          className="o-btn o-btn--link"
                        >
                          Nieuwsoverzicht
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="u-col-sm--3">
                    <div className="u-margin__left--1 c-homepage__news-instructions">
                      <h2 className="c-homepage__news-instructions-title">Instructies</h2>
                      {Object.keys(INSTRUCTION_LINKS).map((key) => (
                        <div key={key} className="c-user-content-widget__entry">
                          <Link
                            to={{ type: INSTRUCTION_LINKS[key].route }}
                            className="o-btn o-btn--link qa-btn--link"
                          >{INSTRUCTION_LINKS[key].title}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="u-clearfix" />
                </div>
              </div>
            </div>
            <div className="u-row">
              <div className="c-homepage__text">
                <div className="u-col-sm--8">
                  <div className="u-margin__left--3 c-homepage__visie">
                    <h1 className="c-homepage__visie-header">Amsterdam City Data</h1>
                    <p className="c-homepage__visie-paragraph">
                      Amsterdam beschikt over een schat
                      aan gegevens over de stad. Via dit dataportaal stellen wij, in samenwerking
                      met onze partners, deze gegevens beschikbaar. Samen met u willen wij werken
                      aan vernieuwende datatoepassingen voor Amsterdam als leefbare stad.
                    </p>
                    <p className="c-homepage__visie-paragraph">
                      Amsterdam City Data blijft zich ontwikkelen. Het aantal beschikbare gegevens
                      en functionaliteiten van dit dataportaal zal verder groeien. Dit stemmen we af
                      op de behoefte in de stad.
                    </p>
                    <p className="c-homepage__visie-paragraph">
                      Op dit moment is het dataportaal met name geschikt voor professionals, zoals
                      onderzoekers en uiteraard de medewerkers en ketenpartners van
                      Gemeente Amsterdam. Daarnaast ondersteunen we ontwikkelaars die gegevens
                      gebruiken in eigen toepassingen.
                    </p>
                    <div className="c-homepage__visie-panel">
                      <AngularWrapper
                        moduleName={'dpPanelWrapper'}
                        component="dpPanel"
                        dependencies={['atlas']}
                        bindings={{
                          isPanelVisible: true,
                          canClose: false
                        }}
                        interpolateBindings={{
                          type: 'info'
                        }}
                      >
                        <div>
                          <p
                            className={`c-homepage__visie-paragraph
                                c-homepage__visie-paragraph--panel`}
                          >
                            Meer weten over data en de gemeente Amsterdam? Informatie over beleid,
                            samenwerkingsverbanden, inspirerende voorbeelden van toepassingen en
                            informatie voor de pers vindt u op:
                          </p>
                          <a
                            className="c-link c-link--arrow"
                            href="https://amsterdam.nl/data"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            amsterdam.nl/data
                          </a>
                        </div>
                      </AngularWrapper>
                    </div>
                  </div>
                </div>
                <div className="u-col-sm--1">&nbsp;</div>
                <div className="u-col-sm--3">
                  <div className="u-margin__left--1 c-homepage__beleid">
                    <div>
                      <div className="c-user-content-widget__beleid-zie-ook">Over</div>
                      {Object.keys(ABOUT_LINKS).map((key) => (
                        <div key={key} className="c-user-content-widget__entry">
                          <Link
                            to={{ type: ABOUT_LINKS[key].route }}
                            className="o-btn o-btn--link"
                          >
                            <div
                              className={`c-user-content-widget__short
                                  s-cms-widget-content
                                  s-cms-widget-content--inline`}
                            >
                              <p>{ABOUT_LINKS[key].title}</p>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showFooter &&
      <Footer />
      }
    </div>
  </div>
);

Home.propTypes = {
  showFooter: PropTypes.bool
};

Home.defaultProps = {
  showFooter: true
};

export default Home;
