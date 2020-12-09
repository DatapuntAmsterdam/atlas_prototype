import { ALERTS, DETAIL_PANEL } from '../support/selectors'

describe('employee permissions', () => {
  beforeEach(() => {
    cy.hidePopup()
  })

  describe('BRK detail panels', () => {
    it('1. Should NOT show a "natural person""', () => {
      cy.visit('data/brk/subject/idNL.KAD.Persoon.171720901')
      cy.contains(ALERTS.KADASTRAAL_SUBJECT)
      cy.get(DETAIL_PANEL.definitionList).should('not.exist')
    })

    it('2. Should NOT show "non-natural subject" with "Zakelijke rechten"', () => {
      cy.visit('data/brk/subject/idNL.KAD.Persoon.423186718')
      cy.contains(ALERTS.KADASTRAAL_SUBJECT)
      cy.get(DETAIL_PANEL.definitionList).should('not.exist')
      cy.get(DETAIL_PANEL.linkList).should('not.exist')
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

      cy.contains(ALERTS.KADASTRAAL_OBJECT_ITEMS)
      cy.checkListItems('../fixtures/kadastraalObjectVisitor.json')
      cy.checkLinkItems('../fixtures/kadastraalObjectVisitor.json')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.contains('Besluit op basis van Monumentenwet 1988,').should('not.exist')

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
      cy.get(DETAIL_PANEL.linkList).should('have.length', 5)

      cy.checkListItems('../fixtures/verblijfsObjectVisitor.json')
      cy.checkLinkItems('../fixtures/verblijfsObjectVisitor.json')
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
      cy.contains(ALERTS.VESTIGINGEN).scrollIntoView().should('be.visible')
      cy.contains(ALERTS.KADASTRAAL_OBJECT).scrollIntoView().should('be.visible')
    })
    it('2. Should show a "pand"', () => {
      cy.intercept('**/bag/v1.1/pand/*').as('getPand')
      cy.intercept('**/monumenten/monumenten/?betreft_pand=*').as('getMonumenten')
      cy.intercept('**/bag/v1.1/nummeraanduiding/?pand=*').as('getNummeraanduidingen')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/bag/pand/id0363100012168052')

      cy.wait('@getPand')
      cy.wait('@getMonumenten')
      cy.wait('@getNummeraanduidingen')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/pandVisitor.json')
      cy.checkLinkItems('../fixtures/pandVisitor.json')
      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Pand', 'Adressen', 'Vestigingen', 'Monumenten'])
    })
    it('3. Should show a "ligplaats"', () => {
      cy.intercept('**/bag/v1.1/ligplaats/*').as('getLigplaats')
      cy.intercept('**/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/bag/ligplaats/id0363020000881621')

      cy.wait('@getLigplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/ligplaatsVisitor.json')
      cy.checkLinkItems('../fixtures/ligplaatsVisitor.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Ligplaatsen', 'Vestigingen'])
    })

    it('4. Should show a "standplaats"', () => {
      cy.intercept('**/bag/v1.1/standplaats/*').as('getStandplaats')
      cy.intercept('**/bag/v1.1/nummeraanduiding/*').as('getNummeraanduiding')
      cy.intercept('**/panorama/thumbnail?*').as('getPanorama')

      cy.visit('data/bag/standplaats/id0363030000930866')

      cy.wait('@getStandplaats')
      cy.wait('@getNummeraanduiding')
      cy.wait('@getPanorama')

      cy.checkListItems('../fixtures/standplaatsVisitor.json')
      cy.checkLinkItems('../fixtures/standplaatsVisitor.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')
      cy.checkInfoBoxes(['Adressen', 'Standplaatsen', 'Vestigingen', 'Monumenten'])
    })
    it('5. Should show a "woonplaats"', () => {
      cy.intercept('**/bag/v1.1/woonplaats/*').as('getWoonplaats')
      cy.intercept('**/bag/v1.1/openbareruimte/*').as('getOpenbareRuimte')
      cy.visit('data/bag/woonplaats/id3594/?zoom=7')
      cy.wait('@getWoonplaats')
      cy.wait('@getOpenbareRuimte')

      cy.checkListItems('../fixtures/woonplaats.json')
      cy.checkLinkItems('../fixtures/woonplaats.json')

      cy.checkInfoBoxes(['Woonplaatsen', 'Openbare ruimtes'])
    })
  })
  describe('Handelsregister detail panels', () => {
    it('1. Should show a "vestiging"', () => {
      cy.visit('data/handelsregister/vestiging/id000003579875/?modus=gesplitst')
      cy.contains(ALERTS.GENERAL).should('be.visible')
      cy.get(DETAIL_PANEL.definitionList).should('not.exist')
      cy.get(DETAIL_PANEL.linkList).should('not.exist')
    })

    it('2. Should show a "maatschappelijke activiteit"', () => {
      cy.visit('data/handelsregister/maatschappelijkeactiviteit/id01029509')
      cy.contains(ALERTS.GENERAL).should('be.visible')
      cy.get(DETAIL_PANEL.definitionList).should('not.exist')
      cy.get(DETAIL_PANEL.linkList).should('not.exist')
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

      cy.contains(ALERTS.MONUMENTEN).should('be.visible')
      cy.checkListItems('../fixtures/monumentVisitor.json')

      cy.get(DETAIL_PANEL.panoramaPreview).scrollIntoView().should('be.visible')

      cy.checkInfoBoxes(['Monumenten', 'Complexen', 'Panden', 'Adressen'])
    })

    it('2. Should show a "monumenten complex"', () => {
      cy.intercept('**/monumenten/complexen/*').as('getComplex')
      cy.intercept('**/monumenten/monumenten/?complex_id=*').as('getMonumenten')

      cy.visit('data/monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5')

      cy.wait('@getComplex')
      cy.wait('@getMonumenten')

      cy.contains(ALERTS.COMPLEXEN).should('be.visible')
      cy.checkListItems('../fixtures/complexVisitor.json')

      cy.checkInfoBoxes(['Complexen', 'Monumenten'])
    })
  })
})
