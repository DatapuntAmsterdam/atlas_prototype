import React from 'react'
import PropTypes from 'prop-types'
import RouterLink from 'redux-first-router-link'
import { routing } from '../routes'
import Footer from '../components/Footer/Footer'
import PreviewVideo from '../components/PreviewVideo/PreviewVideo'
import HomepageAddressBlock from '../../homepage/components/address-block/HomepageAddressBlock'
import HomepageBlock from '../../homepage/components/block/HomepageBlock'
import ShareBar from '../components/ShareBar/ShareBar'
import {
  toMapWithLegendOpen,
  toPanoramaAndPreserveQuery,
} from '../../store/redux-first-router/actions'
import Notification from '../../shared/components/notification/Notification'
import HomepageDatasetsThemesBlock from '../../homepage/components/datasets-themes-block/HomepageDatasetsThemesBlock'
import CMSWidget from '../components/CMSWidget/CMSWidget'

const INSTRUCTION_LINKS = {
  BEDIENING: {
    route: routing.bediening.type,
    title: 'Bediening',
  },
  GEGEVENS: {
    route: routing.gegevens.type,
    title: 'Gegevens',
  },
  APIS: {
    route: routing.apis.type,
    title: "API's",
  },
}

const ABOUT_LINKS = {
  PRIVACY_BEVEILIGING: {
    route: routing.privacy_beveiliging.type,
    title: 'Privacy en informatiebeveiliging',
  },
  BESCHIKBAAR_KWALITEIT: {
    route: routing.beschikbaar_kwaliteit.type,
    title: 'Beschikbaarheid en kwaliteit data',
  },
  BEHEER_WERKWIJZE: {
    route: routing.beheer_werkwijze.type,
    title: 'Technisch beheer en werkwijze',
  },
} // TODO: refactor, test

/* istanbul ignore next */ const Home = ({ showFooter }) => (
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
                      linkAction={toMapWithLegendOpen()}
                      title="Data op de kaart"
                      description="Selecteer kaartlagen, vind gegevens op een punt in de kaart,
                        meet of teken een gebied"
                      blockIsLink
                    >
                      <PreviewVideo
                        poster="/assets/video/map.jpg"
                        src="/assets/video/map.mp4"
                        type="video/mp4"
                      />
                      <div className="c-homepage__block-button">
                        <div className="o-btn--transparent">Data op de kaart</div>
                        <div className="c-homepage__block-details">
                          Selecteer kaartlagen, vind gegevens op een punt in de kaart, meet of teken
                          een gebied
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
                  <HomepageDatasetsThemesBlock />
                </div>

                <div className="u-col-sm--3 c-homepage__block--address" id="homepage-address-block">
                  <HomepageAddressBlock />
                </div>

                <div className="u-col-sm--3">
                  <div className="qa-panorama-link">
                    <HomepageBlock
                      classes="c-homepage__block--right"
                      linkAction={toPanoramaAndPreserveQuery(
                        undefined,
                        undefined,
                        undefined,
                        'home',
                      )}
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
                    <CMSWidget limit={3} type="news" />
                  </div>
                  <div className="u-col-sm--3">
                    <div className="u-margin__left--1 c-homepage__news-instructions">
                      <h2 className="c-homepage__news-instructions-title">Instructies</h2>
                      {Object.keys(INSTRUCTION_LINKS).map(key => (
                        <div key={key} className="c-user-content-widget__entry">
                          <RouterLink
                            to={{ type: INSTRUCTION_LINKS[key].route }}
                            className="o-btn o-btn--link qa-btn--link"
                          >
                            {INSTRUCTION_LINKS[key].title}
                          </RouterLink>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="u-clearfix" />
                </div>
              </div>
            </div>
            <div className="u-row u-margin__bottom--4">
              <div className="c-homepage__text">
                <div className="u-col-sm--8">
                  <div className="u-margin__left--3 c-homepage__visie">
                    <h1 className="c-homepage__visie-header">Amsterdam City Data</h1>
                    <p className="c-homepage__visie-paragraph">
                      Amsterdam beschikt over een schat aan gegevens over de stad. Via dit
                      dataportaal stellen wij, in samenwerking met onze partners, deze gegevens
                      beschikbaar. Samen met u willen wij werken aan vernieuwende datatoepassingen
                      voor Amsterdam als leefbare stad.
                    </p>
                    <p className="c-homepage__visie-paragraph">
                      Amsterdam City Data blijft zich ontwikkelen. Het aantal beschikbare gegevens
                      en functionaliteiten van dit dataportaal zal verder groeien. Dit stemmen we af
                      op de behoefte in de stad.
                    </p>
                    <p className="c-homepage__visie-paragraph">
                      Op dit moment is het dataportaal met name geschikt voor professionals, zoals
                      onderzoekers en uiteraard de medewerkers en ketenpartners van Gemeente
                      Amsterdam. Daarnaast ondersteunen we ontwikkelaars die gegevens gebruiken in
                      eigen toepassingen.
                    </p>
                    <div className="c-homepage__visie-panel">
                      <Notification level="disclaimer" canClose={false} className="c-panel">
                        <div>
                          <p
                            className={`c-homepage__visie-paragraph
                                c-homepage__visie-paragraph--panel`}
                          >
                            Meer weten over data en de gemeente Amsterdam? Informatie over beleid,
                            inspirerende voorbeelden van toepassingen en informatie voor de pers
                            vindt u op:
                          </p>
                          <a
                            className="c-link c-link--arrow"
                            href="https://www.amsterdam.nl/ois"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            amsterdam.nl/ois
                          </a>
                        </div>
                      </Notification>
                    </div>
                  </div>
                </div>
                <div className="u-col-sm--1">&nbsp;</div>
                <div className="u-col-sm--3">
                  <div className="u-margin__left--1 c-homepage__beleid">
                    <div>
                      <div className="c-user-content-widget__beleid-zie-ook">Over</div>
                      {Object.keys(ABOUT_LINKS).map(key => (
                        <div key={key} className="c-user-content-widget__entry">
                          <RouterLink
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
                          </RouterLink>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="u-row">
              <div className="u-col-sm--12">
                <div className="u-margin__left--3">
                  <ShareBar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  </div>
)

Home.propTypes = {
  showFooter: PropTypes.bool,
}

Home.defaultProps = {
  showFooter: true,
}

export default Home
