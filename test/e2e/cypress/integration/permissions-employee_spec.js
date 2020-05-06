import { queries, urls, values } from '../support/permissions-constants'
import { DATA_SELECTION_TABLE, MAP } from '../support/selectors'

describe('employee permissions', () => {
  beforeEach(() => {
    cy.server()
    cy.hidePopup()
  })

  before(() => {
    cy.login('EMPLOYEE')
  })

  after(() => {
    cy.logout()
  })

  it('1. Should show "Kadastrale subjecten" for medewerker in the autocomplete', () => {
    cy.route('/typeahead?q=bakker').as('getResults')
    cy.visit('/')

    cy.get('#auto-suggest__input').focus().click().type('bakker')

    cy.wait('@getResults')
    cy.get('.auto-suggest__tip').should('exist').and('be.visible')
    cy.get('.auto-suggest__dropdown').contains(values.kadastraleSubjecten)
    cy.get('.auto-suggest__dropdown-item').contains(' & Toledo Holding B.V.')
  })

  it('2A. Should allow an employee to view a natural person but not the "Zakelijke rechten"', () => {
    cy.route('/brk/subject/*').as('getResults')
    cy.visit(urls.natuurlijk)

    cy.wait('@getResults')
    cy.contains(
      'Medewerkers met speciale bevoegdheden kunnen alle gegevens zien (ook zakelijke rechten).',
    )
    cy.get(queries.headerTitle).contains('akker')
    cy.get(queries.natuurlijkPersoon).should('exist').and('be.visible')
  })

  it('2B. Should allow an employee to view a non-natural subject', () => {
    cy.route('/brk/subject/*').as('getResults')
    cy.visit(urls.nietNatuurlijk)

    cy.wait('@getResults')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.headerTitle).contains('er & T')
    cy.get(queries.nietNatuurlijkPersoon).should('exist').and('be.visible')
  })

  it('3. Should show an employee all info for a cadastral subject', () => {
    cy.route('/brk/object/*').as('getResults')
    cy.route('/brk/object-expand/*').as('getObjectExpand')
    cy.route('/bag/v1.1/nummeraanduiding/?kadastraalobject=*').as('getNummeraanduidingen')
    cy.visit(urls.business)

    cy.wait('@getResults')
    cy.wait('@getObjectExpand')
    cy.wait('@getNummeraanduidingen')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.headerTitle).contains('6661')
    cy.get(queries.headerSubTitle).contains(values.aantekeningen)
  })

  it('4. Should show an employee all info for an address', () => {
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
      expect($values).to.contain(values.zakelijkeRechten)
    })
    cy.contains(
      'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om vestigingen te bekijken.',
    ).should('not.exist')
    cy.contains(
      'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer gegevens te zien: zakelijke rechten en aantekeningen.',
    ).should('not.exist')
  })

  it('5. Should show an employee all info for "Gemeentelijke beperking"', () => {
    cy.route('/wkpb/beperking/*').as('getResults')
    cy.route('/wkpb/brondocument/?beperking=*').as('getBronDocument')
    cy.route('/brk/object/?beperkingen__id=*').as('getObject')

    cy.visit(urls.gemeentelijkeBeperking)

    cy.wait('@getResults')
    cy.wait('@getBronDocument')
    cy.wait('@getObject')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.headerTitle).contains('9230')
    cy.get(queries.keyValueList).contains(values.documentnaam)
  })

  it('6. Should allow an employee to view map layers', () => {
    cy.visit(urls.map)
    cy.get(MAP.toggleMapPanel).click()
    cy.get(MAP.checkboxGebiedsindeling).check()
    cy.get(MAP.checkboxHoogte).check()
    cy.get(MAP.checkboxVestigingen).check()
    cy.get(queries.legendNotification).should('not.contain', values.legendPermissionNotification)
  })

  it('7A. Should allow an employee to view "Vestigingen"', () => {
    cy.route('/dataselectie/hr/*').as('getResults')

    cy.visit(urls.vestigingenTabel)

    cy.wait('@getResults')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(DATA_SELECTION_TABLE.table).contains('Handelsnaam')
  })

  it('7B. Should show an employee all "Pand" information', () => {
    cy.server()
    cy.route('/bag/v1.1/pand/*').as('getResults')
    cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
    cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')
    cy.route('/handelsregister/vestiging/?pand=*').as('getVestigingen')

    cy.visit(urls.pand)

    cy.wait('@getResults')
    cy.wait('@getMonumenten')
    cy.wait('@getNummeraanduidingen')
    cy.wait('@getVestigingen')
    cy.get(queries.headerTitle).contains('0001216')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.listItem).contains(values.pandVestigingName)
  })

  it('7C. Should show an employee all information in a Geo search', () => {
    cy.defineGeoSearchRoutes()
    cy.route('/bag/v1.1/pand/*').as('getResults')
    cy.route('/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
    cy.route('/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')
    cy.route('/handelsregister/vestiging/?pand=*').as('getVestigingen')
    cy.route('/panorama/thumbnail/?*').as('getPanorama')

    cy.visit(urls.geoSearch)

    cy.waitForGeoSearch()
    cy.wait('@getResults')
    cy.wait('@getMonumenten')
    cy.wait('@getNummeraanduidingen')
    cy.wait('@getVestigingen')
    cy.wait('@getPanorama')

    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.headerSubTitle).contains(values.vestigingen)
    cy.get('.qa-toggle-fullscreen').click()
    cy.get(MAP.mapSearchResultsCategoryHeader).contains(values.vestigingen)
  })

  it('7D. Should show an employee all information in a "ligplaats" search', () => {
    cy.route('/bag/v1.1/ligplaats/*').as('getResults')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/monumenten/situeringen/?betreft_nummeraanduiding=*').as('getMonument')
    cy.route('/handelsregister/vestiging/?nummeraanduiding=*').as('getVestigingen')

    cy.visit(urls.ligplaats)

    cy.wait('@getResults')
    cy.wait('@getNummeraanduiding')
    cy.wait('@getMonument')
    cy.wait('@getVestigingen')
    cy.get(queries.headerTitle).contains('Zwanenburgwal 44')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.listItem).contains(values.ligplaatsVestigingName)
  })

  it('7E. Should show an employee all information in "standplaats" search', () => {
    cy.route('/bag/v1.1/standplaats/*').as('getResults')
    cy.route('/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
    cy.route('/handelsregister/vestiging/?nummeraanduiding=*').as('getVestigingen')

    cy.visit(urls.standplaats)

    cy.wait('@getResults')
    cy.wait('@getNummeraanduiding')
    cy.wait('@getVestigingen')
    cy.get(queries.headerTitle).contains('Rollemanstraat')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.listItem).contains(values.standplaatsVestigingName)
  })

  it('7F. Should allow an employee to view "vestiging"', () => {
    cy.route('/handelsregister/vestiging/*').as('getVestiging')
    cy.route('/handelsregister/maatschappelijkeactiviteit/*').as('getMaatschappelijkeActiviteit')

    cy.visit(urls.vestiging)

    cy.wait('@getVestiging')
    cy.wait('@getMaatschappelijkeActiviteit')
    cy.get(queries.headerTitle).contains('uwe Loo')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.keyValueList).contains(values.vestigingName)

    cy.get('.qa-toggle-fullscreen').click()
    cy.get(queries.infoNotification).should('not.exist')
    cy.get(queries.mapDetailResultHeaderSubTitle).contains(values.vestigingName)
  })

  it('7G. Should allow an employee to view "maatschappelijke activiteit"', () => {
    cy.route('/handelsregister/maatschappelijkeactiviteit/*').as('getMaatschappelijkeActiviteit')
    cy.route('/handelsregister/persoon/*').as('getPersoon')
    cy.route('/handelsregister/vestiging/?maatschappelijke_activiteit=*').as('getVestigingen')
    cy.route('/handelsregister/functievervulling/?heeft_aansprakelijke=*').as(
      'getFunctievervullingen',
    )

    cy.visit(urls.maatschappelijkeActiviteit)

    cy.wait('@getMaatschappelijkeActiviteit')
    cy.wait('@getPersoon')
    cy.wait('@getVestigingen')
    cy.wait('@getFunctievervullingen')
    cy.get(queries.headerTitle).contains(values.maatschappelijkeActiviteitName)
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.keyValueList).contains(values.maatschappelijkeActiviteitVestigingName)
  })

  it('8A. Should show an employee all information in "monument"', () => {
    cy.route('/monumenten/monumenten/*').as('getMonument')
    cy.route('/monumenten/complexen/*').as('getComplex')
    cy.route('/monumenten/situeringen/?monument_id=*').as('getSitueringen')

    cy.visit(urls.monument)

    cy.wait('@getMonument')
    cy.wait('@getComplex')
    cy.wait('@getSitueringen')
    cy.get(queries.headerTitle).contains('Museumtuin met hekwerken en bouwfragmenten')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.keyValueList).contains(values.redengevendeOmschrijving)
    cy.get('.qa-toggle-fullscreen').click()
    cy.get(queries.mapDetailResultItem).contains(values.type)
  })

  it('8B. Should show an employee all information in "monument complex"', () => {
    cy.route('/monumenten/complexen/*').as('getComplex')
    cy.route('/monumenten/monumenten/?complex_id=*').as('getMonumenten')

    cy.visit(urls.monumentComplex)

    cy.wait('@getComplex')
    cy.wait('@getMonumenten')
    cy.get(queries.headerTitle).contains('us Bo')
    cy.get(queries.warningPanel).should('not.exist')
    cy.get(queries.keyValueList).contains(values.beschrijving)
  })
})
