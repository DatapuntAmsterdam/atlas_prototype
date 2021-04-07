import { DETAIL_PANEL, MAP } from '../support/selectors'

describe('employee permissions', () => {
  beforeEach(() => {
    cy.hidePopup()
  })
  before(() => {
    cy.login('EMPLOYEE_PLUS')
  })

  after(() => {
    cy.logout()
  })
  describe('BRK detail panels', () => {
    it.skip('1. Should show a "natural person" with "Zakelijke rechten"', () => {
      cy.intercept('**/brk/subject/*').as('getSubject')
      cy.visit('data/brk/subject/idNL.KAD.Persoon.171720901')

      cy.wait('@getSubject')
      cy.contains(
        'Medewerkers met speciale bevoegdheden kunnen alle gegevens zien (ook Zakelijke rechten).',
      ).should('not.exist')
      cy.checkListItems('../fixtures/kadastraalSubjectNaturalPerson.json')
      cy.get(DETAIL_PANEL.definitionList).should('not.contain', 'Statutaire zetel')
      cy.contains('Eigendom (recht van) (1').should('be.visible')
      cy.checkInfoBoxes(['Kadastra', 'Zakelijke rechten'])
    })

    it.skip('2. Should show a "non-natural subject" with "Zakelijke rechten"', () => {
      cy.intercept('**/brk/subject/*').as('getSubject')
      cy.visit('data/brk/subject/idNL.KAD.Persoon.423186718')

      cy.wait('@getSubject')
      cy.checkListItems('../fixtures/kadastraalSubjectNonNaturalPerson.json')
      cy.checkLinkItems('../fixtures/kadastraalSubjectNonNaturalPerson.json')
      cy.get(DETAIL_PANEL.linkList).contains('Eigendom (recht van)')
      cy.checkInfoBoxes(['Kadastra', 'Zakelijke rechten'])
    })

    it('3. Should show a "kadastraal object"', () => {
      cy.intercept('**/brk/object/*').as('getObject')
      cy.intercept('**/brk/object-expand/*').as('getObjectExpand')
      cy.intercept('**/bag/v1.1/nummeraanduiding/?kadastraalobject=*').as('getNummeraanduidingen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
      cy.visit('data/brk/object/idNL.KAD.OnroerendeZaak.11460666170000')

      cy.wait('@getObject')
      cy.wait('@getObjectExpand')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getPanorama')
      cy.checkListItems('../fixtures/kadastraalObjectEmployee.json')
      cy.checkLinkItems('../fixtures/kadastraalObjectEmployee.json')
      cy.get(DETAIL_PANEL.panoramaPreview).should('be.visible')
      cy.contains('Besluit op basis van Monumentenwet 1988,').scrollIntoView().should('be.visible')

      cy.checkInfoBoxes([
        'Kadastra',
        'Zakelijke rechten',
        'Ontstaan uit',
        'Betrokken bij',
        'Adressen',
      ])
    })
  })
  describe('BAG detail panels', () => {
    it('1. Should show an "address"', () => {
      cy.defineAddressDetailRoutes()
      cy.visit('data/bag/verblijfsobject/id0363010000749400')
      cy.waitForAdressDetail()

      // Wait for all listitems to be visible
      cy.get(DETAIL_PANEL.linkList).should('have.length', 6)

      cy.checkListItems('../fixtures/verblijfsObjectEmployee.json')
      cy.checkLinkItems('../fixtures/verblijfsObjectEmployee.json')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes([
        'Adressen',
        'Verblijfsobjecten',
        'Adressen',
        'Panden',
        'Vestigingen',
        'Kadastrale objecten',
        'Monumenten',
        'Bouw- en omgevingsdossiers',
      ])
      cy.contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om vestigingen te bekijken.',
      ).should('not.exist')
      cy.contains(
        'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer te informatie te vinden over: Kadastrale objecten.',
      )
        .scrollIntoView()
        .should('be.visible')
    })
    it('2. Should show a "pand"', () => {
      cy.intercept('**/bag/v1.1/pand/*').as('getPand')
      cy.intercept('**/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
      cy.intercept('**/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')
      cy.intercept('**/handelsregister/vestiging/?pand=*').as('getVestigingen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/bag/pand/id0363100012168052')

      cy.wait('@getPand')
      cy.wait('@getMonumenten')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/pandEmployee.json')
      cy.checkLinkItems('../fixtures/pandEmployee.json')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Pand', 'Adressen', 'Vestigingen', 'Monumenten'])
    })
    it('3. Should show a "ligplaats"', () => {
      cy.intercept('**/bag/v1.1/ligplaats/*').as('getLigplaats')
      cy.intercept('**/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')
      cy.intercept('**/handelsregister/vestiging/?*').as('getVestigingen')

      cy.visit('data/bag/ligplaats/id0363020000881621')

      cy.wait('@getLigplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getPanorama')
      cy.wait('@getVestigingen')

      cy.checkListItems('../fixtures/ligplaatsEmployee.json')
      cy.checkLinkItems('../fixtures/ligplaatsEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Ligplaatsen', 'Vestigingen'])
    })

    it('4. Should show a "standplaats"', () => {
      cy.intercept('**/bag/v1.1/standplaats/*').as('getStandplaats')
      cy.intercept('**/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.intercept('**/handelsregister/vestiging/?nummeraanduiding=*').as('getVestigingen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/bag/standplaats/id0363030000930866')

      cy.wait('@getStandplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getVestigingen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/standplaatsEmployee.json')
      cy.checkLinkItems('../fixtures/standplaatsEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Standplaatsen', 'Vestigingen', 'Monumenten'])
    })
    it('5. Should show a "woonplaats"', () => {
      cy.intercept('**/v1/bag/woonplaatsen/*').as('getWoonplaats')
      cy.visit('data/bag/woonplaats/id3594/?zoom=7')
      cy.wait('@getWoonplaats')

      cy.checkListItems('../fixtures/woonplaats.json')
      cy.checkLinkItems('../fixtures/woonplaats.json')

      cy.checkInfoBoxes(['Woonplaatsen', 'Openbare ruimtes'])
    })
  })
  describe('Handelsregister detail panels', () => {
    it('1. Should show a "vestiging"', () => {
      cy.intercept('**/handelsregister/vestiging/*').as('getVestiging')
      cy.intercept('**/handelsregister/maatschappelijkeactiviteit/*').as(
        'getMaatschappelijkeActiviteit',
      )

      cy.visit('data/handelsregister/vestiging/id000003579875/?modus=gesplitst')
      cy.wait('@getVestiging')
      cy.wait('@getMaatschappelijkeActiviteit')

      cy.checkListItems('../fixtures/vestiging.json')
      cy.checkLinkItems('../fixtures/vestiging.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Vestigingen', 'Maatschappelijke activiteiten'])

      cy.get(MAP.toggleFullScreen).click()
      cy.get('.map-detail-result__item-value').contains('Havom B.V.')
    })

    it('2. Should show a "maatschappelijke activiteit"', () => {
      cy.intercept('**/handelsregister/maatschappelijkeactiviteit/*').as(
        'getMaatschappelijkeActiviteit',
      )
      cy.intercept('**/handelsregister/persoon/*').as('getPersoon')
      cy.intercept('**/handelsregister/vestiging/?maatschappelijke_activiteit=*').as(
        'getVestigingen',
      )
      cy.intercept('**/handelsregister/functievervulling/?heeft_aansprakelijke=*').as(
        'getFunctievervullingen',
      )

      cy.visit('data/handelsregister/maatschappelijkeactiviteit/id01029509')
      cy.wait('@getMaatschappelijkeActiviteit')
      cy.wait('@getPersoon')
      cy.wait('@getVestigingen')
      cy.wait('@getFunctievervullingen')

      cy.checkListItems('../fixtures/maatschappelijkeActiviteit.json')
      cy.checkLinkItems('../fixtures/maatschappelijkeActiviteit.json')

      cy.checkInfoBoxes(['Maatschappelijke activiteiten', 'Functievervullingen', 'Vestigingen'])
    })
  })
  describe('Monumenten en complexen detail panels', () => {
    it('1. Should show a "monument"', () => {
      cy.intercept('**/monumenten/monumenten/*').as('getMonument')
      cy.intercept('**/monumenten/situeringen/?monument_id=*').as('getSitueringen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/monumenten/monumenten/id3cf53160-d8bf-4447-93ba-1eb03a35cfe4/')

      cy.wait('@getMonument')
      cy.wait('@getSitueringen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/monumentEmployee.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Monumenten', 'Complexen', 'Panden', 'Adressen'])
    })

    it('2. Should show a "monumenten complex"', () => {
      cy.intercept('**/monumenten/complexen/*').as('getComplex')
      cy.intercept('**/monumenten/monumenten/?complex_id=*').as('getMonumenten')

      cy.visit('data/monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5')

      cy.wait('@getComplex')
      cy.wait('@getMonumenten')

      cy.checkListItems('../fixtures/complexEmployee.json')

      cy.checkInfoBoxes(['Complexen', 'Monumenten'])
    })
  })
})
