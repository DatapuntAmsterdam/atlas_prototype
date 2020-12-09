import { MAP, MAP_LAYERS } from '../support/selectors'

describe('Check if all map layers are visible when selected', () => {
  beforeEach(() => {
    cy.hidePopup()
    cy.visit('/data/?modus=kaart&legenda=true')
  })
  it('Should check Onroerende zaken layers', () => {
    cy.checkMapLayerCategory('Onroerende zaken')
    cy.get(MAP.mapZoomIn).click()

    cy.checkMapLayer(
      'Kadastrale perceelsgrenzen',
      MAP_LAYERS.checkboxOZKadastralePerceelsgrenzen,
      4,
    )
    cy.checkMapLayer('Kadastrale eigenaren', MAP_LAYERS.checkboxOZKadastraleEigenaren, 14)
    cy.checkMapLayer(
      'Kadastrale erfpachtuitgevers',
      MAP_LAYERS.checkboxOZKadastraleErfpachtuitgevers,
      16,
    )
    cy.checkMapLayer('Gemeentelijk eigendom', MAP_LAYERS.checkboxOZGemeentelijkEigendom, 18)
    cy.checkMapLayer('Panden ouder dan 1960', MAP_LAYERS.checkboxOZPandenOuderDan1960, 19)
    cy.checkMapLayer('Panden naar bouwjaar', MAP_LAYERS.checkboxOZPandenNaarBouwjaar, 20)

    cy.get(MAP_LAYERS.checkboxOnroerendeZaken).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Gebiedsindeling layers', () => {
    cy.checkMapLayerCategory('Gebiedsindeling')

    cy.checkMapLayer('Buurt', MAP_LAYERS.checkboxGIBuurt, 1)
    cy.checkMapLayer('Wijk', MAP_LAYERS.checkboxGIWijk, 2)
    cy.checkMapLayer('Stadsdeel', MAP_LAYERS.checkboxGIStadsdeel, 3)
    cy.checkMapLayer('Bouwblokken', MAP_LAYERS.checkboxGIBouwblokken, 4)
    cy.checkMapLayer('Gebiedsgericht werken', MAP_LAYERS.checkboxGIGebiedsgerichtWerken, 6)
    cy.checkMapLayer(
      'Grootstedelijke gebieden, projecten en belangen',
      MAP_LAYERS.checkboxGIGrootstedelijkeGebieden,
      8,
    )
    cy.get(MAP_LAYERS.checkboxGebiedsindeling).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Hoogte layers', () => {
    cy.checkMapLayerCategory('Hoogte')

    cy.checkMapLayer('Terreinmodel (DTM AHN)', MAP_LAYERS.checkboxHoogteTerreinmodel, 1)
    cy.checkMapLayer('Oppervlaktemodel (DSM AHN)', MAP_LAYERS.checkboxHoogteOppervlaktemodel, 2)
    cy.checkMapLayer('Normaal Amsterdams Peil (NAP)', MAP_LAYERS.checkboxHoogteNAP, 3)
    cy.checkMapLayer('Meetbouten - Status', MAP_LAYERS.checkboxHoogteMeetboutenStatus, 4)
    cy.checkMapLayer('Meetbouten - Zaksnelheid', MAP_LAYERS.checkboxHoogteMeetboutenZaksnelheid, 5)
    cy.checkMapLayer('Meetbouten - Referentiepunten', MAP_LAYERS.checkboxHoogteReferentiepunten, 6)

    cy.get(MAP_LAYERS.checkboxHoogte).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Parkeren layers', () => {
    cy.checkMapLayerCategory('Parkeren')

    cy.checkMapLayer('Fiscale indelingen', MAP_LAYERS.checkboxParkerenFiscaleIndelingen, 1)
    cy.checkMapLayer('Speciale bestemmingen', MAP_LAYERS.checkboxParkerenSpecialeBestemmingen, 2)
    cy.checkMapLayer('Taxistandplaats', MAP_LAYERS.checkboxParkerenTaxistandplaats, 3)
    cy.checkMapLayer('Laden en lossen', MAP_LAYERS.checkboxParkerenLadenEnLossen, 4)
    cy.checkMapLayer('Kiss & Ride', MAP_LAYERS.checkboxParkerenKissAndRide, 5)
    cy.checkMapLayer('Parkeren - Fiscaal', MAP_LAYERS.checkboxParkerenParkerenFiscaal, 6)
    cy.checkMapLayer('Parkeerverbod', MAP_LAYERS.checkboxParkerenParkeerverbod, 7)
    cy.checkMapLayer(
      'Gehandicaptenplaats algemeen',
      MAP_LAYERS.checkboxParkerenGehandicaptenAlgemeen,
      8,
    )
    cy.checkMapLayer(
      'Gehandicaptenplaats kenteken',
      MAP_LAYERS.checkboxParkerenGehandicaptenplaatsKenteken,
      9,
    )
    cy.checkMapLayer(
      'Specifieke voertuigcategorie',
      MAP_LAYERS.checkboxParkerenSpecifiekeVoertuigcategorie,
      10,
    )
    cy.checkMapLayer('Vergunninghouders', MAP_LAYERS.checkboxParkerenVergunninghouders, 11)
    cy.checkMapLayer('Blauwe zone', MAP_LAYERS.checkboxParkerenBlauweZone, 12)
    cy.checkMapLayer(
      'Parkeervergunninggebieden',
      MAP_LAYERS.checkboxParkerenParkeervergunninggebieden,
      14,
    )
    cy.checkMapLayer('Vrachtwagens', MAP_LAYERS.checkboxParkerenVrachtwagens, 15)

    cy.get(MAP_LAYERS.checkboxParkeren).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check COVID-19 maatregelen layers', () => {
    cy.checkMapLayerCategory('COVID-19 maatregelen')

    cy.checkMapLayer('Alcoholverkoopverbod', MAP_LAYERS.checkboxCovidAlcohol, 1)
    cy.checkMapLayer('Straatartiestverbod', MAP_LAYERS.checkboxCovidStraatartiest, 2)
    cy.checkMapLayer('Gebiedsverbod', MAP_LAYERS.checkboxCovidGebied, 3)

    cy.get(MAP_LAYERS.checkboxCovid).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Energie layers', () => {
    cy.checkMapLayerCategory('Energie')

    cy.checkMapLayer('Aardgasvrij', MAP_LAYERS.checkboxEnergieAardgasvrij, 1)
    cy.checkMapLayer('Bouwstroompunten', MAP_LAYERS.checkboxEnergieBouwstroompunten, 2)

    cy.get(MAP_LAYERS.checkboxEnergie).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Historische kaarten layers', () => {
    cy.checkMapLayerCategory('Historische kaarten')

    cy.contains('1909 (1:1000, Dienst der Publieke Werken)').should('be.visible')
    cy.contains('1943 (1:1000, Dienst der Publieke Werken)').should('be.visible')
    cy.contains('1943 (1:2500, Dienst der Publieke Werken)').should('be.visible')
    cy.contains('1985 (1:1000, Dienst der Publieke Werken)').should('be.visible')
    cy.get(MAP_LAYERS.checkboxHK1909).check({ force: true }).should('be.checked')
    cy.url('contains', '**hist-pw1909%3A1&legenda=true')
    cy.get(MAP_LAYERS.checkboxHK19431000).check({ force: true }).should('be.checked')
    cy.url('contains', '**hist-pw1909%3A1%7Chist-pw1943%3A1&legenda=true')
    cy.get(MAP_LAYERS.checkboxHK194325000).check({ force: true }).should('be.checked')
    cy.url('contains', '**hist-pw1909%3A1%7Chist-pw1943%3A1%7Chist-pw1943-2500%3A1&legenda=true')
    cy.get(MAP_LAYERS.checkboxHK1985).check({ force: true }).should('be.checked')
    cy.url(
      'contains',
      '**hist-pw1909%3A1%7Chist-pw1943%3A1%7Chist-pw1943-2500%3A1%7Chist-pw1985%3A1&legenda=true',
    )
    cy.get(MAP_LAYERS.checkboxHistorischeKaarten).uncheck({ force: true }).should('not.be.checked')
    cy.url('contains', '/data/?modus=kaart&legenda=true')
  })
  it('Should check OV-net layers', () => {
    cy.checkMapLayerCategory('OV-net')

    cy.checkMapLayer('Spoorlijnen', MAP_LAYERS.checkboxOVNetSpoorlijnen, 2)
    cy.contains('Metrolijn').should('be.visible')
    cy.contains('Tramlijn').should('be.visible')

    cy.get(MAP_LAYERS.checkboxOVNet).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Milieuzones verkeer layers', () => {
    cy.checkMapLayerCategory('Milieuzones verkeer')

    cy.checkMapLayer('Bestelauto', MAP_LAYERS.checkboxMVBestelauto, 1)
    cy.checkMapLayer('Brom- en snorfiets', MAP_LAYERS.checkboxMVBromSnorfiets, 2)
    cy.checkMapLayer('Taxi', MAP_LAYERS.checkboxMVTaxi, 3)
    cy.checkMapLayer('Touringcar', MAP_LAYERS.checkboxMVTouringcar, 4)
    cy.checkMapLayer('Vrachtauto', MAP_LAYERS.checkboxMVVrachtauto, 5)

    cy.get(MAP_LAYERS.checkboxMilieuZonesVerkeer).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Oplaadpunten layers', () => {
    cy.checkMapLayerCategory('Oplaadpunten')

    cy.checkMapLayer('Snel laden (> 50 Kw)', MAP_LAYERS.checkboxOplaadpuntenSnelLaden, 2)
    cy.contains('Snellaadpunt (beschikbaar, ±15 min. geleden)').should('be.visible')
    cy.contains('Snellaadpunt (niet beschikbaar, ±15 min. geleden)').should('be.visible')
    cy.checkMapLayer('Gewoon laden', MAP_LAYERS.checkboxOplaadpuntenGewoonLaden, 4)
    cy.contains('Gewoon laadpunt (beschikbaar, ±15 min. geleden)').should('be.visible')
    cy.contains('Gewoon laadpunt (niet beschikbaar, ±15 min. geleden)').should('be.visible')

    cy.get(MAP_LAYERS.checkboxOplaadpunten).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Verkeer - Routes layers', () => {
    cy.checkMapLayerCategory('Verkeer - Routes')

    cy.checkMapLayer('Taxi', MAP_LAYERS.checkboxVRTaxi, 2)
    cy.contains('Verbod lijnbusbaan').should('be.visible')
    cy.contains(`Hoofdroutes taxi's`).should('be.visible')
    cy.checkMapLayer('Vrachtauto', MAP_LAYERS.checkboxVRVrachtauto, 6)
    cy.contains('Vrachtauto 7,5t-route').should('be.visible')
    cy.contains('Routes gevaarlijke stoffen').should('be.visible')
    cy.contains('Tunnels gevaarlijke stoffen').should('be.visible')
    cy.contains('U-routes').should('be.visible')
    cy.checkMapLayer('Verzinkbare palen', MAP_LAYERS.checkboxVRVerzinkbarePalen, 7)
    cy.checkMapLayer('Fietspaaltjes', MAP_LAYERS.checkboxVRFietspaaltjes, 8)
    cy.checkMapLayer('Risicozones', MAP_LAYERS.checkboxVRRisicozones, 9)

    cy.get(MAP_LAYERS.checkboxVerkeerRoutes).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Gemeentelijke bekendmakingen layers', () => {
    cy.checkMapLayerCategory('Gemeentelijke bekendmakingen')

    cy.checkMapLayer('Bestemmingsplan', MAP_LAYERS.checkboxGBBestemmingsplan, 1)
    cy.checkMapLayer('Drank- en horecavergunning', MAP_LAYERS.checkboxGBDrankHorecaVergunning, 2)
    cy.checkMapLayer('Evenementenvergunning', MAP_LAYERS.checkboxGBEvenementenvergunning, 3)
    cy.checkMapLayer('Exploitatievergunning', MAP_LAYERS.checkboxGBExploitatievergunning, 4)
    cy.checkMapLayer('Inspraak', MAP_LAYERS.checkboxGBInspraak, 5)
    cy.checkMapLayer('Kapvergunning', MAP_LAYERS.checkboxGBKapvergunning, 6)
    cy.checkMapLayer('Ligplaatsvergunning', MAP_LAYERS.checkboxGBLigplaatsvergunning, 7)
    cy.checkMapLayer('Mededelingen', MAP_LAYERS.checkboxGBMededelingen, 8)
    cy.checkMapLayer('Meldingen', MAP_LAYERS.checkboxGBMeldingen, 9)
    cy.checkMapLayer('Omgevingsvergunning', MAP_LAYERS.checkboxGBOmgevingsvergunning, 10)
    cy.checkMapLayer('Onttrekkingsvergunning', MAP_LAYERS.checkboxGBOnttrekkingsvergunning, 11)
    cy.checkMapLayer('Openingstijden', MAP_LAYERS.checkboxGBOpeningstijden, 12)
    cy.checkMapLayer('Rectificatie', MAP_LAYERS.checkboxGBRectificatie, 13)
    cy.checkMapLayer('Speelautomatenvergunning', MAP_LAYERS.checkboxGBSpeelautomatenvergunning, 14)
    cy.checkMapLayer('Splitsingsvergunning', MAP_LAYERS.checkboxGBSplitsingsvergunning, 15)
    cy.checkMapLayer('Terrasvergunning', MAP_LAYERS.checkboxGBTerrasvergunning, 16)
    cy.checkMapLayer('Verkeersbesluit', MAP_LAYERS.checkboxGBVerkeersbesluit, 17)
    cy.checkMapLayer(
      'Verordeningen en reglementen',
      MAP_LAYERS.checkboxGBVerordeingenReglementen,
      18,
    )
    cy.checkMapLayer('Overig', MAP_LAYERS.checkboxGBOverig, 19)

    cy.get(MAP_LAYERS.checkboxGemeentelijkeBekendmakingen)
      .uncheck({ force: true })
      .should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Afvalcontainers layers', () => {
    cy.checkMapLayerCategory('Afvalcontainers')

    cy.checkMapLayer('Restafval', MAP_LAYERS.checkboxAfvalRestafval, 1)
    cy.checkMapLayer('Papier', MAP_LAYERS.checkboxAfvalPapier, 2)
    cy.checkMapLayer('Glas', MAP_LAYERS.checkboxAfvalGlas, 3)
    cy.checkMapLayer('Plastic', MAP_LAYERS.checkboxAfvalPlastic, 4)
    cy.checkMapLayer('Textiel', MAP_LAYERS.checkboxAfvalTextiel, 5)
    cy.checkMapLayer('GFE', MAP_LAYERS.checkboxAfvalGFE, 6)

    cy.get(MAP_LAYERS.checkboxAfvalcontainers).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Veiligheid en overlast layers', () => {
    cy.checkMapLayerCategory('Veiligheid en overlast')

    cy.checkMapLayer('Algemene overlastgebieden', MAP_LAYERS.checkboxVenOAlgemeen, 1)
    cy.checkMapLayer('Dealeroverlastgebieden', MAP_LAYERS.checkboxVenODealer, 2)
    cy.checkMapLayer('Cameratoezichtgebieden', MAP_LAYERS.checkboxVenOCamera, 3)
    cy.checkMapLayer('Alcoholverbodsgebieden', MAP_LAYERS.checkboxVenOAlcohol, 4)
    cy.checkMapLayer('Rondleidingverbodsgebieden', MAP_LAYERS.checkboxVenORondleiding, 5)
    cy.checkMapLayer('Omgeving taxistandplaatsen', MAP_LAYERS.checkboxVenOTaxiStandplaats, 6)
    cy.checkMapLayer('Vuurwerkvrije zones', MAP_LAYERS.checkboxVenOVuurwerkvrij, 7)

    cy.get(MAP_LAYERS.checkboxVeiligheidEnOverlast)
      .uncheck({ force: true })
      .should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Cultureel erfgoed layers', () => {
    cy.checkMapLayerCategory('Cultureel erfgoed')

    cy.checkMapLayer('Monumenten', MAP_LAYERS.checkboxCEMonumenten, 2)
    cy.checkMapLayer('Unesco werelderfgoedzones', MAP_LAYERS.checkboxCEUnesco, 3)

    cy.get(MAP_LAYERS.checkboxCultureelErfgoed).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Evenementen layers', () => {
    cy.checkMapLayerCategory('Evenementen')

    cy.checkMapLayer('Evenementen', MAP_LAYERS.checkboxEvenementenEvenementen, 1)
    cy.get(MAP_LAYERS.checkboxEvenementen).uncheck({ force: true }).should('not.be.checked')

    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Winkelgebieden layers', () => {
    cy.checkMapLayerCategory('Winkelgebieden')

    cy.checkMapLayer('Reclamebelastingtarieven', MAP_LAYERS.checkboxWGReclamebelastingtarieven, 3)
    cy.get(MAP_LAYERS.checkboxWGWinkelgebieden).check({ force: true }).should('be.checked')
    cy.get(MAP.imageLayer).should('exist').and('have.length', 4)
    cy.checkMapLayer('Bedrijfsinvesteringszones', MAP_LAYERS.checkboxWGBedrijfsinvesteringszones, 5)

    cy.get(MAP_LAYERS.checkboxWinkelgebieden).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Taxi layers', () => {
    cy.checkMapLayerCategory('Taxi')

    cy.checkMapLayer('Verbod lijnbusbaan', MAP_LAYERS.checkboxTaxiVerbodLijnbusbaan, 1)
    cy.checkMapLayer("Hoofdroutes taxi's", MAP_LAYERS.checkboxTaxiHoofdroutes, 2)
    cy.checkMapLayer('Taxistandplaats', MAP_LAYERS.checkboxTaxiTaxistandplaats, 3)
    cy.checkMapLayer('Milieuzones - Taxi', MAP_LAYERS.checkboxTaxiMilieuzones, 4)
    cy.checkMapLayer('Omgeving taxistandplaatsen', MAP_LAYERS.checkboxTaxiOmgevingSP, 5)
    cy.checkMapLayer('Verzinkbare palen', MAP_LAYERS.checkboxTaxiVerzinkbarePalen, 6)
    cy.checkMapLayer('Oplaadpunten - Snel laden', MAP_LAYERS.checkboxTaxiSnelLaden, 8)
    cy.checkMapLayer('Oplaadpunten - Gewoon laden', MAP_LAYERS.checkboxTaxiGewoonLaden, 10)

    cy.get(MAP_LAYERS.checkboxTaxi).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Logistiek layers', () => {
    cy.checkMapLayerCategory('Logistiek')

    cy.checkMapLayer('Routes - Vrachtauto', MAP_LAYERS.checkboxLRoutesVrachtauto, 4)
    cy.checkMapLayer('Laden en lossen', MAP_LAYERS.checkboxLLadenLossen, 5)
    cy.checkMapLayer('Milieuzones - Bestelauto', MAP_LAYERS.checkboxLMilieuzonesBestelauto, 6)
    cy.checkMapLayer('Wegen - Risicozones', MAP_LAYERS.checkboxLWegenRisicozones, 7)
    cy.checkMapLayer('Milieuzones - Vrachtauto', MAP_LAYERS.checkboxLMilieuzonesVrachtauto, 8)
    cy.checkMapLayer('Parkeervakken vrachtwagens', MAP_LAYERS.checkboxLParkeervakkenVrachtwagens, 9)

    cy.get(MAP_LAYERS.checkboxLogistiek).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Ondergrond layers', () => {
    cy.checkMapLayerCategory('Ondergrond')
    cy.get(MAP.mapZoomIn).click()

    cy.checkMapLayer(
      'Aardgasbuisleidingen - Risicozones',
      MAP_LAYERS.checkboxOAardgasbuisleidingen,
      5,
    )
    cy.checkMapLayer(
      'Explosieven - Uitgevoerde CE-onderzoeken',
      MAP_LAYERS.checkboxOExplosievenCE,
      6,
    )
    cy.checkMapLayer('Explosieven - Gevrijwaarde gebieden', MAP_LAYERS.checkboxOExplosievenGG, 7)
    cy.checkMapLayer('Explosieven - Verdachte gebieden', MAP_LAYERS.checkboxOExplosievenVG, 8)
    cy.checkMapLayer('LPG-stations - Risicozones', MAP_LAYERS.checkboxOLPGStations, 10)
    cy.checkMapLayer('LPG-tanks - Risicozones', MAP_LAYERS.checkboxOLPGTanks, 13)
    cy.checkMapLayer('LPG-vulpunten - Risicozones', MAP_LAYERS.checkboxOLPGVulpunten, 16)
    cy.checkMapLayer('LPG-afleverzuilen - Risicozones', MAP_LAYERS.checkboxOLPGAfleverzuilen, 18)
    cy.checkMapLayer('Explosieven - Inslagen', MAP_LAYERS.checkboxOExplosieven, 19)
    cy.checkMapLayer('Grondmonsters', MAP_LAYERS.checkboxOGrondmonsters, 20)
    cy.checkMapLayer('Grondmonsters asbest', MAP_LAYERS.checkboxOGrondmonstersA, 21)
    cy.checkMapLayer('Grondwatermonsters', MAP_LAYERS.checkboxOGrondwatermonsters, 22)
    cy.checkMapLayer('Meetbouten - Zaksnelheid', MAP_LAYERS.checkboxOMeetboutenZaksnelheid, 23)
    cy.checkMapLayer('Meetbouten - Status', MAP_LAYERS.checkboxOMeetboutenStatus, 24)
    cy.checkMapLayer(
      'Meetbouten - Referentiepunten',
      MAP_LAYERS.checkboxOMeetboutenReferentiepunten,
      25,
    )
    cy.checkMapLayer('Verzinkbare palen', MAP_LAYERS.checkboxOVerzinkbarePalen, 26)

    cy.get(MAP_LAYERS.checkboxOndergrond).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Bodemkwaliteit layers', () => {
    cy.checkMapLayerCategory('Bodemkwaliteit')

    cy.checkMapLayer('Grondmonsters', MAP_LAYERS.checkboxBKGrondmonsters, 1)
    cy.checkMapLayer('Grondwatermonsters', MAP_LAYERS.checkboxBKGrondwatermonsters, 2)
    cy.checkMapLayer('Grondmonsters asbest', MAP_LAYERS.checkboxBKGrondmonstersAsbest, 3)
    cy.checkMapLayer(
      'Geotechnische sonderingen (CPT BRO)',
      MAP_LAYERS.checkboxBKGeotechnischeSonderingen,
      4,
    )

    cy.get(MAP_LAYERS.checkboxBodemkwaliteit).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Explosieven layers', () => {
    cy.checkMapLayerCategory('Explosieven')

    cy.checkMapLayer('Inslagen', MAP_LAYERS.checkboxEInslagen, 1)
    cy.checkMapLayer('Verdachte gebieden', MAP_LAYERS.checkboxEVerdachteGeb, 2)
    cy.checkMapLayer('Gevrijwaarde gebieden', MAP_LAYERS.checkboxEGevrijwaardeGeb, 3)
    cy.checkMapLayer('Uitgevoerde CE-onderzoeken', MAP_LAYERS.checkboxECEOnderzoeken, 4)

    cy.get(MAP_LAYERS.checkboxExplosieven).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Geluidszones layers', () => {
    cy.checkMapLayerCategory('Geluidszones')

    cy.checkMapLayer('Industrie', MAP_LAYERS.checkBoxGZIndustrie, 2)
    cy.checkMapLayer('Spoorwegen', MAP_LAYERS.checkBoxGZSpoorwegen, 3)
    cy.checkMapLayer('Metro', MAP_LAYERS.checkBoxGZMetro, 4)
    cy.checkMapLayer('Schiphol - Ruimtelijke beperkingen', MAP_LAYERS.checkBoxGZSchiphol, 5)

    cy.get(MAP_LAYERS.checkboxGeluidszones).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Schiphol layers', () => {
    cy.checkMapLayerCategory('Schiphol')

    cy.checkMapLayer('Ruimtelijke beperkingen', MAP_LAYERS.checkboxSchipholRB, 1)
    cy.checkMapLayer('Maatgevende toetshoogte', MAP_LAYERS.checkboxSchipholMT, 2)
    cy.checkMapLayer('Toetshoogte i.v.m. radar', MAP_LAYERS.checkboxSchipholTR, 3)
    cy.checkMapLayer('Vogelvrijwaringsgebied', MAP_LAYERS.checkboxSchipholVG, 4)

    cy.get(MAP_LAYERS.checkboxSchiphol).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Risicozones layers', () => {
    cy.checkMapLayerCategory('Risicozones')

    cy.checkMapLayer('LPG-vulpunten', MAP_LAYERS.checkboxRZLPGVulpunten, 3)
    cy.checkMapLayer('LPG-afleverzuilen', MAP_LAYERS.checkboxRZLPGAfleverzuilen, 5)
    cy.checkMapLayer('LPG-tanks', MAP_LAYERS.checkboxRZLPGTanks, 8)
    cy.checkMapLayer('LPG-stations', MAP_LAYERS.checkboxRZLPGStations, 10)
    cy.checkMapLayer('Spoorwegen', MAP_LAYERS.checkboxRZSpoorwegen, 11)
    cy.checkMapLayer('Vaarwegen', MAP_LAYERS.checkboxRZVaarwegen, 12)
    cy.checkMapLayer('Wegen', MAP_LAYERS.checkboxRZWegen, 13)
    cy.checkMapLayer('Veiligheidsafstanden', MAP_LAYERS.checkboxRZVeiligheidsafstanden, 19)
    cy.checkMapLayer(
      'Bedrijven - Bronnen en risicozones',
      MAP_LAYERS.checkboxRZBedrijvenBronnen,
      21,
    )
    cy.checkMapLayer(
      'Bedrijven - Invloedsgebieden',
      MAP_LAYERS.checkboxRZBedrijvenInvloedsgebieden,
      21,
    )
    cy.checkMapLayer('Bedrijven - Terreingrenzen', MAP_LAYERS.checkboxRZBedrijvenTerreingrenzen, 23)
    cy.checkMapLayer('Aardgasbuisleidingen', MAP_LAYERS.checkboxRZAardgasbuisleidingen, 28)
    cy.checkMapLayer('Routes gevaarlijke stoffen', MAP_LAYERS.checkboxRZRoutesGS, 29)
    cy.checkMapLayer('Tunnels gevaarlijke stoffen', MAP_LAYERS.checkboxRZTunnelsGS, 30)
    cy.checkMapLayer('U-routes', MAP_LAYERS.checkboxRZURoutes, 31)

    cy.get(MAP_LAYERS.checkboxRisicoZones)
      .scrollIntoView()
      .uncheck({ force: true })
      .should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Panoramabeelden layers', () => {
    cy.checkMapLayerCategory('Panoramabeelden')

    cy.checkMapLayer('Panoramabeelden', MAP_LAYERS.checkBoxPanoramabeeldenBeeldenPano, 5)
    cy.checkMapLayer('Panoramabeelden - WOZ', MAP_LAYERS.checkBoxPanoramabeeldenBeeldenWOZ, 9)

    cy.get(MAP_LAYERS.checkBoxPanoramabeelden).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Grondexploitaties layers', () => {
    cy.checkMapLayerCategory('Grondexploitaties')

    cy.checkMapLayer('Projecten', MAP_LAYERS.checkboxGrondEProjecten, 1)

    cy.get(MAP_LAYERS.checkboxGrondexploitaties).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Vergunningen layers', () => {
    cy.checkMapLayerCategory('Vergunningen')

    cy.checkMapLayer('Vergunningen kamerverhuur', MAP_LAYERS.checkboxVergunningenKamerverhuur, 1)
    cy.checkMapLayer('Vergunningen Bed & Breakfast', MAP_LAYERS.checkboxVergunningenBedBreakfast, 2)

    cy.get(MAP_LAYERS.checkboxVergunningen).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
  it('Should check Belastingen layers', () => {
    cy.checkMapLayerCategory('Belastingen')

    cy.checkMapLayer('Precario woonschepen', MAP_LAYERS.checkboxBelastingenPrecWoonschepen, 2)
    cy.checkMapLayer(
      'Precario bedrijfsvaartuigen',
      MAP_LAYERS.checkboxBelastingenPrecBedrijfsvaartuigen,
      3,
    )
    cy.checkMapLayer(
      'Precario passagiersvaartuigen',
      MAP_LAYERS.checkboxBelastingenPrecPassagiersvaartuigen,
      5,
    )
    cy.checkMapLayer('Precario terrassen', MAP_LAYERS.checkboxBelastingenPrecTerrassen, 8)
    cy.checkMapLayer(
      'Reclamebelastingtarieven',
      MAP_LAYERS.checkboxBelastingenReclamebelastingtarieven,
      11,
    )

    cy.get(MAP_LAYERS.checkboxBelastingen).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
})
describe('Check map layers logged in', () => {
  beforeEach(() => {
    cy.hidePopup()
  })
  before(() => {
    cy.login('EMPLOYEE')
  })

  after(() => {
    cy.logout()
  })
  it('Should allow an employee to view map layers "Vestigingen"', () => {
    cy.visit('/data/?modus=kaart&legenda=true')
    cy.checkMapLayerCategory('Vestigingen')
    cy.get(MAP.legendNotification).should('not.exist')
    cy.checkMapLayer('Bouw', MAP_LAYERS.checkboxVestigingBouw, 1)
    cy.checkMapLayer('Cultuur, sport, recreatie', MAP_LAYERS.checkboxVestigingCultuur, 2)
    cy.checkMapLayer(
      'Financiële dienstv., verhuur van (on)roerend goed',
      MAP_LAYERS.checkboxVestigingFinance,
      3,
    )
    cy.checkMapLayer('Handel, vervoer, opslag', MAP_LAYERS.checkboxVestigingHandel, 4)
    cy.checkMapLayer('Horeca', MAP_LAYERS.checkboxVestigingHoreca, 5)
    cy.checkMapLayer('Informatie, telecommunicatie', MAP_LAYERS.checkboxVestigingIt, 6)
    cy.checkMapLayer('Landbouw', MAP_LAYERS.checkboxVestigingLandbouw, 7)
    cy.checkMapLayer('Overheid, onderwijs, zorg', MAP_LAYERS.checkboxVestigingOverheid, 8)
    cy.checkMapLayer(
      'Persoonlijke dienstverlening',
      MAP_LAYERS.checkboxVestigingPersDiensverlening,
      9,
    )
    cy.checkMapLayer('Productie, installatie, reparatie', MAP_LAYERS.checkboxVestigingProductie, 10)
    cy.checkMapLayer(
      'Zakelijke dienstverlening',
      MAP_LAYERS.checkboxVestigingZakDienstverlening,
      11,
    )
    cy.checkMapLayer('Overige', MAP_LAYERS.checkboxVestigingOverige, 12)
    cy.get(MAP_LAYERS.checkboxVestigingen).uncheck({ force: true }).should('not.be.checked')
    cy.get(MAP.imageLayer).should('not.exist')
  })
})
describe('Check if all map layers are fetched by an url', () => {
  it('should check if all layers are working', () => {
    cy.checkAllLayers()
  })
})
