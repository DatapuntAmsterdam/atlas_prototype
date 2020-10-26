import { urls, values } from '../support/permissions-constants'
import {
  ADDRESS_PAGE,
  DATA_SEARCH,
  DATA_SELECTION_TABLE,
  MAP,
  MAP_LAYERS,
} from '../support/selectors'

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

    cy.get(DATA_SEARCH.warningPanelAngular)
      .scrollIntoView()
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om kadastrale subjecten te bekijken. Om ook zakelijke rechten van natuurlijke personen te bekijken, moet je als medewerker bovendien speciale bevoegdheden hebben.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.headerTitle).should('not.exist')
    cy.get(DATA_SEARCH.natuurlijkPersoon).should('not.exist')
  })

  it('2B. Should NOT allow a visitor to view a non-natural subject', () => {
    cy.visit(urls.nietNatuurlijk)

    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om kadastrale subjecten te bekijken. Om ook zakelijke rechten van natuurlijke personen te bekijken, moet je als medewerker bovendien speciale bevoegdheden hebben.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.headerTitle).should('not.exist')
    cy.get(DATA_SEARCH.nietNatuurlijkPersoon).should('not.exist')
  })

  it('3. Should show a visitor limited info for a cadastral object', () => {
    cy.route('/brk/object/*').as('getObject')
    cy.route('/brk/object-expand/*').as('getObjectExpand')
    cy.route('/bag/v1.1/nummeraanduiding/?kadastraalobject=*').as('getNummeraanduidingen')

    cy.visit(urls.business)

    cy.wait('@getObject')
    cy.wait('@getObjectExpand')
    cy.wait('@getNummeraanduidingen')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer gegevens te zien: koopsom, koopjaar en cultuur (on)bebouwd; zakelijke rechten en aantekeningen.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.headerTitle).contains('G 0000')
    cy.get(DATA_SEARCH.headerSubTitle).should(($values) => {
      expect($values).to.not.contain(values.aantekeningen)
    })
    cy.get(`${DATA_SEARCH.keyValueList}> dt`).should('not.contain', 'Koopsom')
    cy.get(`${DATA_SEARCH.keyValueList}> dt`).should('not.contain', 'Koopjaar')
    cy.get(`${DATA_SEARCH.keyValueList}> dt`).should('not.contain', 'Cultuur bebouwd')
    cy.get(`${DATA_SEARCH.keyValueList}> dt`).should('not.contain', 'Cultuur onbebouwd')
    cy.get(`${DATA_SEARCH.keyValueList}> dt`).should('not.contain', 'Zakelijke rechten')
  })

  it('4. Should show a visitor limited info for an address', () => {
    cy.defineAddressDetailRoutes()
    cy.visit(urls.address)

    cy.waitForAdressDetail()
    cy.get(DATA_SEARCH.headerTitle).contains('Nes 98')
    cy.get(DATA_SEARCH.headerSubTitle).should(($values) => {
      expect($values).to.contain('Ligt in')
      expect($values).to.contain('Panoramabeeld')
      expect($values).to.contain('Verblijfsobject')
      expect($values).to.contain('Panden')
      expect($values).to.contain('Vestigingen')
      expect($values).to.contain('Kadastrale objecten')
      expect($values).to.contain('Monumenten')
      expect($values).to.not.contain(values.zakelijkeRechten)
    })
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om vestigingen te bekijken.',
      )
      .scrollIntoView()
      .should('be.visible')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer gegevens te zien: zakelijke rechten en aantekeningen.',
      )
      .should('be.visible')
  })

  it('5. Should show a visitor limited info for "Gemeentelijke beperking"', () => {
    cy.route('/wkpb/beperking/*').as('getBeperking')
    cy.route('/wkpb/brondocument/?beperking=*').as('getBronDocument')
    cy.route('/brk/object/?beperkingen__id=*').as('getObject')

    cy.visit(urls.gemeentelijkeBeperking)

    cy.wait('@getBeperking')
    cy.wait('@getBronDocument')
    cy.wait('@getObject')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer gegevens te zien: documentnaam en link naar bestand.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.headerTitle).contains('9230')
    cy.get(DATA_SEARCH.keyValueList).contains(values.documentnaam).should('not.exist')
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
    cy.get(DATA_SEARCH.headerTitle).contains('036310001')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om vestigingen te bekijken.',
      )
      .scrollIntoView()
      .should('be.visible')
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
    cy.get(DATA_SEARCH.headerSubTitle).contains('121437.46, 487418.76 (52.3736166, 4.8943521)')
    cy.contains(
      'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te vinden: vestigingen.',
    )
    cy.get(DATA_SEARCH.headerSubTitle).contains(values.vestigingen).should('not.exist')
    cy.get(ADDRESS_PAGE.buttonMaximizeMap).first().click()
    cy.waitForGeoSearch()
    cy.get(MAP.mapSearchResultsCategoryHeader).should('not.contain', values.vestigingen)
  })

  it('7D. Should show a visitor limited information in a "ligplaats" search', () => {
    cy.route('/bag/v1.1/ligplaats/*').as('getLigplaats')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getMonument')

    cy.visit(urls.ligplaats)

    cy.wait('@getLigplaats')
    cy.wait('@getNummeraanduiding')
    cy.wait('@getMonument')
    cy.get(DATA_SEARCH.headerTitle).contains('Zwanenburgwal 44')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om vestigingen te bekijken.',
      )
      .scrollIntoView()
      .should('be.visible')
    cy.get(DATA_SEARCH.listItem).should('not.contain', values.ligplaatsVestigingName)
  })

  it('7E. Should show a visitor limited information in "standplaats" search', () => {
    cy.route('/bag/v1.1/standplaats/*').as('getStandplaats')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getMonument')

    cy.visit(urls.standplaats)

    cy.wait('@getStandplaats')
    cy.wait('@getNummeraanduiding')
    cy.get(DATA_SEARCH.headerTitle).contains('Rollemanstraat')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om vestigingen te bekijken.',
      )
      .scrollIntoView()
      .should('be.visible')
    cy.get(DATA_SEARCH.listItem).should('not.contain', values.standplaatsVestigingName)
  })

  it('7F. Should NOT allow a visitor to view "vestiging"', () => {
    cy.visit(urls.vestiging)
    cy.get(DATA_SEARCH.headerTitle).should('not.exist')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.keyValueList).should('not.exist')
  })

  it('7G. Should NOT allow a visitor to view "maatschappelijke activiteit"', () => {
    cy.visit(urls.maatschappelijkeActiviteit)
    cy.get(DATA_SEARCH.headerTitle).should('not.exist')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.keyValueList).should('not.exist')
  })
  it('8A. Should show a visitor limited information in "monument"', () => {
    cy.route('/monumenten/monumenten/*').as('getMonument')
    cy.route('/monumenten/complexen/*').as('getComplex')
    cy.route('/monumenten/situeringen/?monument_id=*').as('getSitueringen')

    cy.visit(urls.monument)

    cy.wait('@getMonument')
    cy.wait('@getComplex')
    cy.wait('@getSitueringen')
    cy.get(DATA_SEARCH.headerTitle).contains('Museumtuin met hekwerken en bouwfragmenten')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer gegevens te zien: type, architect en opdrachtgever, bouwjaar, oorspronkelijke functie, beschrijving en redengevende omschrijving.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.keyValueList).contains(values.redengevendeOmschrijving).should('not.exist')
    cy.get(ADDRESS_PAGE.buttonMaximizeMap).first().click()
    cy.get(DATA_SEARCH.mapDetailResultItem).should('not.contain', values.type)
  })

  it('8B. Should show a visitor limited information in "monument complex"', () => {
    cy.route('/monumenten/complexen/*').as('getComplex')
    cy.route('/monumenten/monumenten/?complex_id=*').as('getMonumenten')

    cy.visit(urls.monumentComplex)

    cy.wait('@getComplex')
    cy.wait('@getMonumenten')
    cy.get(DATA_SEARCH.headerTitle).contains('Hortus Botanicus')
    cy.get(DATA_SEARCH.warningPanelAngular)
      .contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer gegevens te zien: beschrijving.',
      )
      .should('be.visible')
    cy.get(DATA_SEARCH.keyValueList).should('not.contain', values.beschrijving)
  })
})
