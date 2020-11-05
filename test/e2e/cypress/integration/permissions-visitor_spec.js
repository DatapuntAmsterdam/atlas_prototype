import { urls, values } from '../support/permissions-constants'
import {
  ADDRESS_PAGE,
  COMPONENTS,
  DATA_DETAIL,
  DATA_SEARCH,
  DATA_SELECTION_TABLE,
  MAP,
  MAP_LAYERS,
} from '../support/selectors'

const SPECIAL_AUTH_ALERT_DESCRIPTION =
  'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: kadastrale subjecten. Om ook zakelijke rechten van natuurlijke personen te bekijken, moet je als medewerker bovendien speciale bevoegdheden hebben.'

const VESTIGINGEN_ALERT =
  'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: Vestigingen.'

describe('visitor permissions', () => {
  beforeEach(() => {
    cy.server()
    cy.hidePopup()
  })

  it('0. Should NOT show "Kadastrale subjecten" in the autocomplete', () => {
    cy.route('/typeahead?q=bakker').as('getResults')
    cy.visit('/')

    cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker')

    cy.wait('@getResults')
    cy.get(DATA_SEARCH.autoSuggestTip).should('exist').and('be.visible')
    cy.get(DATA_SEARCH.autoSuggestHeader).should(($values) => {
      expect($values)
        .to.not.contain(values.kadastraleSubjecten)
        .and.to.not.contain(values.vestigingen)
        .and.to.not.contain(values.maatschappelijkeActiviteiten)
    })
  })

  it('1. Should NOT show "Kadastrale subjecten" and "Vestigingen" in the results', () => {
    cy.route('/typeahead?q=bakker').as('getResults')
    cy.visit('/')

    cy.get(DATA_SEARCH.autoSuggestInput).focus().type('bakker{enter}')

    cy.wait('@getResults')
    cy.contains('Vestigingen (').should('not.be.visible')
    cy.contains('Maatschappelijke activiteiten (').should('not.be.visible')
    cy.contains('Kadastrale subjecten (').should('not.be.visible')
    cy.contains('Aafje Cornelia Bakker').should('not.be.visible')
    cy.contains('Bakker & Toledo Holding B.V.').should('not.be.visible')
  })

  it('2A. Should NOT allow a visitor to view a natural subject', () => {
    cy.visit(urls.natuurlijk)

    cy.get(COMPONENTS.authAlert).contains(SPECIAL_AUTH_ALERT_DESCRIPTION).should('be.visible')

    cy.get(DATA_DETAIL.main).should('not.exist')
  })

  it('2B. Should NOT allow a visitor to view a non-natural subject', () => {
    cy.visit(urls.nietNatuurlijk)

    cy.get(COMPONENTS.authAlert).contains(SPECIAL_AUTH_ALERT_DESCRIPTION).should('be.visible')
    cy.get(DATA_DETAIL.main).should('not.exist')
  })

  it('3. Should show a visitor limited info for a cadastral object', () => {
    cy.route('/brk/object/*').as('getObject')
    cy.route('/brk/object-expand/*').as('getObjectExpand')
    cy.route('/bag/v1.1/nummeraanduiding/?kadastraalobject=*').as('getNummeraanduidingen')

    cy.visit(urls.business)

    cy.wait('@getObject')
    cy.wait('@getObjectExpand')
    cy.wait('@getNummeraanduidingen')
    cy.get(COMPONENTS.authAlert)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: koopsom, koopjaar en cultuur (on)bebouwd; zakelijke rechten en aantekeningen.',
      )
      .should('be.visible')
    cy.get(DATA_DETAIL.heading).contains('G 0000')
    cy.contains('Besluit op basis van Monumentenwet 1988').should('not.be.visible')
    // Todo: can we simplify this?
    cy.get(`${DATA_DETAIL.definitionList}> dt`).should('not.contain', 'Koopsom')
    cy.get(`${DATA_DETAIL.definitionList}> dt`).should('not.contain', 'Koopjaar')
    cy.get(`${DATA_DETAIL.definitionList}> dt`).should('not.contain', 'Cultuur bebouwd')
    cy.get(`${DATA_DETAIL.definitionList}> dt`).should('not.contain', 'Cultuur onbebouwd')
    cy.get(`${DATA_DETAIL.definitionList}> dt`).should('not.contain', 'Zakelijke rechten')
  })

  it('4. Should show a visitor limited info for an address', () => {
    cy.defineAddressDetailRoutes()
    cy.visit(urls.address)

    cy.waitForAdressDetail()
    cy.get(DATA_DETAIL.heading).contains('Nes 98')
    cy.get(DATA_DETAIL.subHeading).should(($values) => {
      expect($values).to.contain('Ligt in')
      expect($values).to.contain('Verblijfsobject')
      expect($values).to.contain('Panden')
      expect($values).to.contain('Vestigingen')
      expect($values).to.contain('Kadastrale objecten')
      expect($values).to.contain('Monumenten')
      expect($values).to.not.contain(values.zakelijkeRechten)
    })
    cy.get(COMPONENTS.authAlert).contains(VESTIGINGEN_ALERT).scrollIntoView().should('be.visible')
    cy.get(COMPONENTS.authAlert)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: Kadastrale objecten.',
      )
      .should('be.visible')
  })

  it('6. Should show a visitor a notification for limited map layers', () => {
    cy.visit(urls.map)

    cy.get(MAP.mapPanel).should('have.class', 'map-panel--collapsed')
    cy.get(MAP.toggleMapPanel).click()
    cy.get(MAP.mapPanel).should('have.class', 'map-panel--expanded')

    cy.get(MAP_LAYERS.checkboxVestigingen).check({ force: true })
    cy.get(MAP.legendNotification)
      .contains(values.legendPermissionNotification)
      .should('exist')
      .and('be.visible')
  })

  it('7A. Should NOT allow a visitor to view "Vestigingen"', () => {
    cy.visit(urls.vestigingenTabel)
    cy.contains(
      'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
    )
    cy.get(DATA_SELECTION_TABLE.table).should('not.exist')
  })

  it('7B. Should show a visitor limited "Pand" information', () => {
    cy.route('/bag/v1.1/pand/*').as('getPand')
    cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
    cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')

    cy.visit(urls.pand)

    cy.wait('@getPand')
    cy.wait('@getMonumenten')
    cy.wait('@getNummeraanduidingen')
    cy.get(DATA_DETAIL.heading).contains('036310001')
    cy.get(COMPONENTS.authAlert).contains(VESTIGINGEN_ALERT).scrollIntoView().should('be.visible')
    cy.get(DATA_SEARCH.listItem).should('not.contain', values.pandVestigingName)
  })

  it('7C. Should show a visitor limited information in a Geo search', () => {
    cy.defineGeoSearchRoutes()
    cy.route('/bag/v1.1/pand/*').as('getPand')
    cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
    cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')

    cy.visit(urls.geoSearch)

    cy.waitForGeoSearch()
    cy.wait('@getPand')
    cy.wait('@getMonumenten')
    cy.wait('@getNummeraanduidingen')
    cy.contains('121437.46, 487418.76 (52.3736166, 4.8943521)')
    cy.get(COMPONENTS.authAlert).contains(
      'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: vestigingen.',
    )
    cy.get('h2').contains('values.vestigingen').should('not.exist')
    cy.get(ADDRESS_PAGE.buttonMaximizeMap).first().click()
    cy.waitForGeoSearch()
    cy.get(MAP.mapSearchResultsCategoryHeader).should('not.contain', values.vestigingen)
  })

  it('7D. Should show a visitor limited information in a "ligplaats" search', () => {
    cy.route('/bag/v1.1/ligplaats/*').as('getLigplaats')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')

    cy.visit(urls.ligplaats)

    cy.wait('@getLigplaats')
    cy.wait('@getNummeraanduiding')
    cy.get(DATA_DETAIL.heading).contains('Zwanenburgwal 44')
    cy.get(COMPONENTS.authAlert).contains(VESTIGINGEN_ALERT).scrollIntoView().should('be.visible')
    cy.get(DATA_SEARCH.listItem).should('not.contain', values.ligplaatsVestigingName)
  })

  it('7E. Should show a visitor limited information in "standplaats" search', () => {
    cy.route('/bag/v1.1/standplaats/*').as('getStandplaats')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getMonument')

    cy.visit(urls.standplaats)

    cy.wait('@getStandplaats')
    cy.wait('@getNummeraanduiding')
    cy.get(DATA_DETAIL.heading).contains('Rollemanstraat')
    cy.get(COMPONENTS.authAlert).contains(VESTIGINGEN_ALERT).scrollIntoView().should('be.visible')
    cy.get(DATA_SEARCH.listItem).should('not.contain', values.standplaatsVestigingName)
  })

  it('7F. Should NOT allow a visitor to view "vestiging"', () => {
    cy.visit(urls.vestiging)
    cy.get(DATA_DETAIL.heading).should('not.exist')
    cy.get(COMPONENTS.authAlert)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.keyValueList).should('not.exist')
  })

  it('7G. Should NOT allow a visitor to view "maatschappelijke activiteit"', () => {
    cy.visit(urls.maatschappelijkeActiviteit)
    cy.get(DATA_DETAIL.heading).should('not.exist')
    cy.get(COMPONENTS.authAlert)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.keyValueList).should('not.exist')
  })
  it('8A. Should show a visitor limited information in "monument"', () => {
    cy.route('/monumenten/monumenten/*').as('getMonument')
    cy.route('/monumenten/situeringen/?monument_id=*').as('getSitueringen')

    cy.visit(urls.monument)

    cy.wait('@getMonument')
    cy.wait('@getSitueringen')
    cy.get(DATA_DETAIL.heading).contains('Museumtuin met hekwerken en bouwfragmenten')
    cy.get(COMPONENTS.authAlert)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: type, architect en opdrachtgever, bouwjaar, oorspronkelijke functie, beschrijving en redengevende omschrijving.',
      )
      .should('be.visible')
    cy.get(DATA_DETAIL.linkList).contains(values.redengevendeOmschrijving).should('not.exist')
    cy.get(ADDRESS_PAGE.buttonMaximizeMap).first().click()
    cy.get(DATA_SEARCH.mapDetailResultItem).should('not.contain', values.type)
  })

  it('8B. Should show a visitor limited information in "monument complex"', () => {
    cy.route('/monumenten/complexen/*').as('getComplex')
    cy.route('/monumenten/monumenten/?complex_id=*').as('getMonumenten')

    cy.visit(urls.monumentComplex)

    cy.wait('@getComplex')
    cy.wait('@getMonumenten')
    cy.get(DATA_DETAIL.heading).contains('Hortus Botanicus')
    cy.get(COMPONENTS.authAlert)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: beschrijving.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.keyValueList).should('not.contain', values.beschrijving)
  })
})
