import { queries, urls, values } from '../support/permissions-constants'
import { DATA_SELECTION_TABLE, MAP } from '../support/selectors'

describe('visitor permissions', () => {
  beforeEach(() => {
    cy.server()
    cy.hidePopup()
  })

  it('1. Should NOT show "Kadastrale subjecten" in the autocomplete', () => {
    cy.route('/typeahead?q=bakker').as('getResults')
    cy.visit('/')

    cy.get('#auto-suggest__input').focus().type('bakker')

    cy.wait('@getResults')
    cy.get('.auto-suggest__tip').should('exist').and('be.visible')
    cy.get(queries.autoSuggestHeader).should(($values) => {
      expect($values).to.not.contain(values.kadastraleSubjecten)
    })
  })

  it('2A. Should NOT allow a visitor to view a natural subject', () => {
    cy.visit(urls.natuurlijk)

    cy.get(queries.warningPanelAngular)
      .scrollIntoView()
      .contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.headerTitle).should('not.exist')
    cy.get(queries.natuurlijkPersoon).should('not.exist')
  })

  it('2B. Should NOT allow a visitor to view a non-natural subject', () => {
    cy.visit(urls.nietNatuurlijk)

    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.headerTitle).should('not.exist')
    cy.get(queries.nietNatuurlijkPersoon).should('not.exist')
  })

  it('3. Should show a visitor limited info for a cadastral subject', () => {
    cy.route('/brk/object/*').as('getResults')
    cy.route('/brk/object-expand/*').as('getObjectExpand')
    cy.route('/bag/v1.1/nummeraanduiding/?kadastraalobject=*').as('getNummeraanduidingen')

    cy.visit(urls.business)

    cy.wait('@getResults')
    cy.wait('@getObjectExpand')
    cy.wait('@getNummeraanduidingen')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.headerTitle).contains('G 0000')
    cy.get(queries.headerSubTitle).should(($values) => {
      expect($values).to.not.contain(values.aantekeningen)
    })
  })

  it('4. Should show a visitor limited info for an address', () => {
    cy.route('/bag/v1.1/verblijfsobject/*').as('getVerblijfsobject')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/bag/v1.1/pand/?verblijfsobjecten__id=*').as('getPanden')
    cy.route('/brk/object-expand/?verblijfsobjecten__id=*').as('getObjectExpand')
    cy.route('/monumenten/monumenten/*').as('getMonument')
    cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getSitueringen')

    cy.visit(urls.address)

    cy.wait('@getVerblijfsobject')
    cy.wait('@getMonument')
    cy.wait('@getNummeraanduiding')
    cy.wait('@getObjectExpand')
    cy.wait('@getPanden')
    cy.wait('@getSitueringen')
    cy.get(queries.headerTitle).contains('Nes 98')
    cy.get(queries.headerSubTitle).should(($values) => {
      expect($values).to.contain('Ligt in')
      expect($values).to.contain('Panoramabeeld')
      expect($values).to.contain('Verblijfsobject')
      expect($values).to.contain('Panden')
      expect($values).to.contain('Vestigingen')
      expect($values).to.contain('Kadastrale objecten')
      expect($values).to.contain('Monumenten')
      expect($values).to.not.contain(values.zakelijkeRechten)
    })
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
  })

  it('5. Should show a visitor limited info for "Gemeentelijke beperking"', () => {
    cy.route('/wkpb/beperking/*').as('getResults')
    cy.route('/wkpb/brondocument/?beperking=*').as('getBronDocument')
    cy.route('/brk/object/?beperkingen__id=*').as('getObject')

    cy.visit(urls.gemeentelijkeBeperking)

    cy.wait('@getResults')
    cy.wait('@getBronDocument')
    cy.wait('@getObject')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.headerTitle).contains('9230')
    cy.get(queries.keyValueList).contains(values.documentnaam).should('not.exist')
  })

  it('6. Should show a visitor a notification for limited map layers', () => {
    cy.visit(urls.map)

    cy.get('.map-panel').should('have.class', 'map-panel--collapsed')
    cy.get('.map-panel__toggle').click()
    cy.get('.map-panel').should('have.class', 'map-panel--expanded')

    cy.get(MAP.checkboxVestigingen).check()
    cy.get(queries.legendNotification)
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
    cy.route('/bag/v1.1/pand/*').as('getResults')
    cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
    cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')

    cy.visit(urls.pand)

    cy.wait('@getResults')
    cy.wait('@getMonumenten')
    cy.wait('@getNummeraanduidingen')
    cy.get(queries.headerTitle).contains('036310001')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.listItem).should('not.contain', values.pandVestigingName)
  })

  it('7C. Should show a visitor limited information in a Geo search', () => {
    cy.defineGeoSearchRoutes()
    cy.route('/bag/v1.1/pand/*').as('getResults')
    cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
    cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')

    cy.visit(urls.geoSearch)

    cy.waitForGeoSearch()
    cy.wait('@getResults')
    cy.wait('@getMonumenten')
    cy.wait('@getNummeraanduidingen')
    cy.get('.o-header').contains('121437.46, 487418.76 (52.3736166, 4.8943521)')
    cy.contains(
      'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te vinden: vestigingen.',
    )
    cy.get(queries.headerSubTitle).contains(values.vestigingen).should('not.exist')
    // the map view maximize button should exist
    cy.get('button.icon-button__right')
    // click on the maximize button to open the map view
    cy.get('button.icon-button__right').first().click()
    cy.wait(250)
    cy.get(MAP.mapSearchResultsCategoryHeader).should('not.contain', values.vestigingen)
  })

  it('7D. Should show a visitor limited information in a "ligplaats" search', () => {
    cy.route('/bag/v1.1/ligplaats/*').as('getResults')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getMonument')

    cy.visit(urls.ligplaats)

    cy.wait('@getResults')
    cy.wait('@getNummeraanduiding')
    cy.wait('@getMonument')
    cy.get(queries.headerTitle).contains('Zwanenburgwal 44')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.listItem).should('not.contain', values.ligplaatsVestigingName)
  })

  it('7E. Should show a visitor limited information in "standplaats" search', () => {
    cy.route('/bag/v1.1/standplaats/*').as('getResults')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getMonument')

    cy.visit(urls.standplaats)

    cy.wait('@getResults')
    cy.wait('@getNummeraanduiding')
    cy.get(queries.headerTitle).contains('Rollemanstraat')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.listItem).should('not.contain', values.standplaatsVestigingName)
  })

  it('7F. Should NOT allow a visitor to view "vestiging"', () => {
    cy.visit(urls.vestiging)
    cy.get(queries.headerTitle).should('not.exist')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.keyValueList).should('not.exist')
  })

  it('7G. Should NOT allow a visitor to view "maatschappelijke activiteit"', () => {
    cy.visit(urls.maatschappelijkeActiviteit)
    cy.get(queries.headerTitle).should('not.exist')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.keyValueList).should('not.exist')
  })
  it('8A. Should show a visitor limited information in "monument"', () => {
    cy.route('/monumenten/monumenten/*').as('getMonument')
    cy.route('/monumenten/complexen/*').as('getComplex')
    cy.route('/monumenten/situeringen/?monument_id=*').as('getSitueringen')

    cy.visit(urls.monument)

    cy.wait('@getMonument')
    cy.wait('@getComplex')
    cy.wait('@getSitueringen')
    cy.get(queries.headerTitle).contains('Museumtuin met hekwerken en bouwfragmenten')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.keyValueList).contains(values.redengevendeOmschrijving).should('not.exist')
    // the map view maximize button should exist
    cy.get('button.icon-button__right')
    // click on the maximize button to open the map view
    cy.get('button.icon-button__right').first().click()
    cy.get(queries.mapDetailResultItem).should('not.contain', values.type)
  })

  it('8B. Should show a visitor limited information in "monument complex"', () => {
    cy.route('/monumenten/complexen/*').as('getComplex')
    cy.route('/monumenten/monumenten/?complex_id=*').as('getMonumenten')

    cy.visit(urls.monumentComplex)

    cy.wait('@getComplex')
    cy.wait('@getMonumenten')
    cy.get(queries.headerTitle).contains('Hortus Botanicus')
    cy.get(queries.warningPanelAngular).contains('Medewerkers/ketenpartners van Gemeente Amsterdam')
    cy.get(queries.keyValueList).should('not.contain', values.beschrijving)
  })
})
